<?php
declare(strict_types=1);

use App\PersonalJournal\Application\CreateEntry\CreateEntry;
use App\PersonalJournal\Application\DeleteEntry\DeleteEntry;
use App\PersonalJournal\Application\ConflictException;
use App\PersonalJournal\Application\EntryNotFoundException;
use App\PersonalJournal\Application\EntryTypes\CreateEntryType;
use App\PersonalJournal\Application\EntryTypes\DeleteEntryType;
use App\PersonalJournal\Application\EntryTypes\GetEntryType;
use App\PersonalJournal\Application\EntryTypes\UpdateEntryType;
use App\PersonalJournal\Application\GetEntry\GetEntry;
use App\PersonalJournal\Application\Insights\GetComparison\GetComparison;
use App\PersonalJournal\Application\Insights\GetSummary\GetSummary;
use App\PersonalJournal\Application\Insights\GetTrend\GetTrend;
use App\PersonalJournal\Application\JournalEntryView;
use App\PersonalJournal\Application\ListEntries\ListEntries;
use App\PersonalJournal\Application\ListEntryTypes\ListEntryTypes;
use App\PersonalJournal\Application\UpdateEntry\UpdateEntry;
use App\PersonalJournal\Infrastructure\Persistence\PdoEntryTypeRepository;
use App\PersonalJournal\Infrastructure\Persistence\PdoJournalEntryRepository;
use App\IdentityAccess\Application\CurrentUser\GetCurrentUser;
use App\IdentityAccess\Application\ForgotPassword\ForgotPassword;
use App\IdentityAccess\Application\ForgotPassword\RateLimitExceeded;
use App\IdentityAccess\Application\Login\Login;
use App\IdentityAccess\Application\Logout\Logout;
use App\IdentityAccess\Application\Register\Register;
use App\IdentityAccess\Application\Register\RegistrationValidationException;
use App\IdentityAccess\Application\ResetPassword\InvalidResetToken;
use App\IdentityAccess\Application\ResetPassword\ResetPassword;
use App\IdentityAccess\Application\UpdateProfile\CurrentPasswordInvalid;
use App\IdentityAccess\Application\UpdateProfile\ProfileValidationException;
use App\IdentityAccess\Application\UpdateProfile\UpdateProfile;
use App\IdentityAccess\Domain\User\Exception\EmailAlreadyExists;
use App\IdentityAccess\Infrastructure\Integration\PersonalJournalInitialEntryTypesProvisioner;
use App\IdentityAccess\Infrastructure\Persistence\PdoUserRepository;
use App\IdentityAccess\Infrastructure\Persistence\PdoTransactionManager;
use App\IdentityAccess\Infrastructure\Persistence\PdoPasswordResetTokenRepository;
use App\IdentityAccess\Infrastructure\Mail\LocalPasswordResetMailer;
use App\IdentityAccess\Infrastructure\Mail\NativePasswordResetMailer;
use App\IdentityAccess\Infrastructure\RateLimit\FilePasswordResetRateLimiter;
use App\IdentityAccess\Infrastructure\Security\CryptographicTokenGenerator;
use App\IdentityAccess\Infrastructure\Security\NativePasswordHasher;
use App\IdentityAccess\Infrastructure\Security\NativePasswordVerifier;
use App\IdentityAccess\Infrastructure\Session\NativePhpSessionStore;
use App\IdentityAccess\Infrastructure\Time\SystemClock;
use App\PersonalJournal\Application\ProvisionInitialEntryTypes\ProvisionInitialEntryTypes;

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) return;
    $file = dirname(__DIR__) . '/src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($file)) require $file;
});

header('Content-Type: application/json; charset=utf-8');
$corsOrigin = getenv('CORS_ORIGIN') ?: '';
if ($corsOrigin !== '') {
    header("Access-Control-Allow-Origin: $corsOrigin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function respond(mixed $body, int $status = 200): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    $configFile = dirname(__DIR__) . '/config.php';
    $fileConfig = is_file($configFile) ? require $configFile : [];
    $dsn = getenv('DB_DSN') ?: ($fileConfig['dsn'] ?? 'mysql:host=127.0.0.1;port=3306;dbname=registro_personal;charset=utf8mb4');
    $user = getenv('DB_USER') ?: ($fileConfig['user'] ?? 'root');
    $password = getenv('DB_PASSWORD') ?: ($fileConfig['password'] ?? '');
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $types = new PdoEntryTypeRepository($pdo);
    $entries = new PdoJournalEntryRepository($pdo);
    $users = new PdoUserRepository($pdo);
    $resetTokens = new PdoPasswordResetTokenRepository($pdo);
    $sessions = new NativePhpSessionStore();
    $currentUser = new GetCurrentUser($users, $sessions);
    $basePath = getenv('APP_BASE_PATH') ?: '/registro_gatos';
    $requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if ($basePath !== '/' && $requestPath !== null && str_starts_with($requestPath, $basePath)) {
        $requestPath = substr($requestPath, strlen($basePath));
    }
    $path = $requestPath === null || $requestPath === '' ? '/' : $requestPath;
    $method = $_SERVER['REQUEST_METHOD'];
    $appEnvironment = strtolower(getenv('APP_ENV') ?: ($fileConfig['app_env'] ?? 'production'));
    $appUrl = getenv('APP_URL') ?: ($fileConfig['app_url'] ?? '');
    $transactionManager = new PdoTransactionManager($pdo);
    $clock = new SystemClock();

    if ($path === '/api/health') respond(['status' => 'ok', 'database' => 'mysql']);
    if ($path === '/api/auth/login' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        $user = (new Login($users, new NativePasswordVerifier(), $sessions))->execute((string)($input['email'] ?? ''), (string)($input['password'] ?? ''));
        respond(['user' => $user]);
    }
    if ($path === '/api/auth/register' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($input)) throw new RegistrationValidationException('El formulario de registro es inválido.');
        $initialTypes = new PersonalJournalInitialEntryTypesProvisioner(new ProvisionInitialEntryTypes($types));
        $registered = (new Register($users, new NativePasswordHasher(), $sessions, $initialTypes, new PdoTransactionManager($pdo)))->execute(
            (string)($input['name'] ?? ''),
            (string)($input['email'] ?? ''),
            (string)($input['password'] ?? ''),
            (string)($input['passwordConfirmation'] ?? ''),
        );
        respond(['user' => $registered], 201);
    }
    if ($path === '/api/auth/forgot-password' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($input)) $input = [];
        if ($appUrl === '') throw new RuntimeException('APP_URL debe estar configurada.');
        $mailer = in_array($appEnvironment, ['local', 'development', 'test'], true)
            ? new LocalPasswordResetMailer(dirname(__DIR__) . '/var/password-reset-links.log')
            : new NativePasswordResetMailer(getenv('MAIL_FROM') ?: '', getenv('MAIL_FROM_NAME') ?: 'Mi registro');
        $message = (new ForgotPassword(
            $users,
            $resetTokens,
            new CryptographicTokenGenerator(),
            $mailer,
            new FilePasswordResetRateLimiter(dirname(__DIR__) . '/var/rate-limit/password-reset'),
            $clock,
            $transactionManager,
            $appUrl,
        ))->execute((string)($input['email'] ?? ''), (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        respond(['message' => $message]);
    }
    if ($path === '/api/auth/reset-password' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($input)) $input = [];
        (new ResetPassword($users, $resetTokens, new NativePasswordHasher(), $transactionManager, $clock))->execute(
            (string)($input['token'] ?? ''),
            (string)($input['password'] ?? ''),
            (string)($input['passwordConfirmation'] ?? ''),
        );
        respond(['message' => 'Contraseña actualizada']);
    }
    if ($path === '/api/auth/me' && $method === 'GET') {
        $user = $currentUser->execute();
        if ($user === null) respond(['error' => 'No autenticado.'], 401);
        respond(['user' => $user]);
    }
    if ($path === '/api/auth/profile' && $method === 'PATCH') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($input)) throw new ProfileValidationException('El formulario de perfil es inválido.');
        $profile = (new UpdateProfile($users, new NativePasswordVerifier(), new NativePasswordHasher(), $sessions))->execute(
            (string)($input['name'] ?? ''),
            array_key_exists('avatarKey', $input) && $input['avatarKey'] !== null ? (string)$input['avatarKey'] : null,
            (string)($input['biography'] ?? ''),
            (string)($input['currentPassword'] ?? ''),
            (string)($input['password'] ?? ''),
            (string)($input['passwordConfirmation'] ?? ''),
        );
        respond(['user' => $profile]);
    }
    if ($path === '/api/auth/logout' && $method === 'POST') {
        (new Logout($sessions))->execute();
        respond(['status' => 'ok']);
    }

    $authenticated = $currentUser->execute();
    if ($authenticated === null) respond(['error' => 'No autenticado.'], 401);
    $userId = $authenticated['id'];
    if ($path === '/api/entry-types' && $method === 'GET') {
        $includeInactive = ($_GET['includeInactive'] ?? '') === '1';
        respond((new ListEntryTypes($types))->execute($userId, $includeInactive));
    }
    if ($path === '/api/entry-types' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        respond((new CreateEntryType($types))->execute($userId, $input), 201);
    }
    if (preg_match('#^/api/entry-types/(\d+)$#', $path, $matches) === 1) {
        $typeId = (int) $matches[1];
        if ($method === 'GET') respond((new GetEntryType($types))->execute($userId, $typeId));
        if ($method === 'PATCH') {
            $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
            respond((new UpdateEntryType($types))->execute($userId, $typeId, $input));
        }
        if ($method === 'DELETE') respond((new DeleteEntryType($types, $entries))->execute($userId, $typeId));
    }
    if ($path === '/api/entries' && $method === 'GET') {
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : null;
        respond((new ListEntries($entries, $types))->execute($userId, $page, $limit, $_GET));
    }
    if ($path === '/api/entries' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        $created = (new CreateEntry($entries, $types))->execute($userId, $input);
        $createdType = $types->byId($created->typeId, $userId);
        respond(['entry' => JournalEntryView::from($created, $createdType)], 201);
    }
    if (preg_match('#^/api/entries/(\d+)$#', $path, $matches) === 1) {
        $entryId = (int) $matches[1];
        if ($method === 'GET') respond((new GetEntry($entries, $types))->execute($userId, $entryId));
        if ($method === 'PATCH') {
            $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
            respond((new UpdateEntry($entries, $types))->execute($userId, $entryId, $input));
        }
        if ($method === 'DELETE') respond((new DeleteEntry($entries))->execute($userId, $entryId));
    }
    if ($path === '/api/insights/summary' && $method === 'GET') {
        respond((new GetSummary($entries))->execute($userId, $_GET['from'] ?? null, $_GET['to'] ?? null));
    }
    if ($path === '/api/insights/trend' && $method === 'GET') {
        $days = isset($_GET['days']) ? (int) $_GET['days'] : null;
        respond((new GetTrend($entries))->execute($userId, $_GET['from'] ?? null, $_GET['to'] ?? null, $days));
    }
    if ($path === '/api/insights/comparison' && $method === 'GET') {
        respond((new GetComparison($entries))->execute($userId, $_GET['from'] ?? null, $_GET['to'] ?? null, $_GET['period'] ?? null));
    }
    respond(['error' => 'Ruta no encontrada'], 404);
} catch (RateLimitExceeded $error) {
    respond(['error' => ['code' => 'PASSWORD_RESET_RATE_LIMITED', 'message' => 'Demasiadas solicitudes. Intentá nuevamente más tarde.']], 429);
} catch (InvalidResetToken $error) {
    respond(['error' => ['code' => InvalidResetToken::ERROR_CODE, 'message' => $error->getMessage()]], 422);
} catch (EmailAlreadyExists $error) {
    respond(['error' => ['code' => EmailAlreadyExists::ERROR_CODE, 'message' => $error->getMessage()]], 409);
} catch (RegistrationValidationException $error) {
    respond(['error' => ['code' => RegistrationValidationException::ERROR_CODE, 'message' => $error->getMessage()]], 422);
} catch (CurrentPasswordInvalid $error) {
    respond(['error' => ['code' => CurrentPasswordInvalid::ERROR_CODE, 'message' => $error->getMessage()]], 422);
} catch (ProfileValidationException $error) {
    respond(['error' => ['code' => ProfileValidationException::ERROR_CODE, 'message' => $error->getMessage()]], 422);
} catch (ConflictException $error) {
    respond(['error' => $error->getMessage()], 409);
} catch (EntryNotFoundException $error) {
    respond(['error' => $error->getMessage()], 404);
} catch (DomainException $error) {
    respond(['error' => $error->getMessage()], 401);
} catch (InvalidArgumentException|JsonException $error) {
    respond(['error' => $error->getMessage()], 422);
} catch (Throwable $error) {
    respond(['error' => 'No se pudo completar la operación.'], 500);
}
