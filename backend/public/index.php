<?php
declare(strict_types=1);

use App\PersonalJournal\Application\CreateEntry\CreateEntry;
use App\PersonalJournal\Application\JournalEntryView;
use App\PersonalJournal\Application\ListEntries\ListEntries;
use App\PersonalJournal\Application\ListEntryTypes\ListEntryTypes;
use App\PersonalJournal\Infrastructure\Persistence\PdoEntryTypeRepository;
use App\PersonalJournal\Infrastructure\Persistence\PdoJournalEntryRepository;
use App\IdentityAccess\Application\CurrentUser\GetCurrentUser;
use App\IdentityAccess\Application\Login\Login;
use App\IdentityAccess\Application\Logout\Logout;
use App\IdentityAccess\Infrastructure\Persistence\PdoUserRepository;
use App\IdentityAccess\Infrastructure\Security\NativePasswordVerifier;
use App\IdentityAccess\Infrastructure\Session\NativePhpSessionStore;

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
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
    $sessions = new NativePhpSessionStore();
    $currentUser = new GetCurrentUser($users, $sessions);
    $basePath = getenv('APP_BASE_PATH') ?: '/registro_gatos';
    $requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if ($basePath !== '/' && $requestPath !== null && str_starts_with($requestPath, $basePath)) {
        $requestPath = substr($requestPath, strlen($basePath));
    }
    $path = $requestPath === null || $requestPath === '' ? '/' : $requestPath;
    $method = $_SERVER['REQUEST_METHOD'];

    if ($path === '/api/health') respond(['status' => 'ok', 'database' => 'mysql']);
    if ($path === '/api/auth/login' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        $user = (new Login($users, new NativePasswordVerifier(), $sessions))->execute((string)($input['email'] ?? ''), (string)($input['password'] ?? ''));
        respond(['user' => $user]);
    }
    if ($path === '/api/auth/me' && $method === 'GET') {
        $user = $currentUser->execute();
        if ($user === null) respond(['error' => 'No autenticado.'], 401);
        respond(['user' => $user]);
    }
    if ($path === '/api/auth/logout' && $method === 'POST') {
        (new Logout($sessions))->execute();
        respond(['status' => 'ok']);
    }

    $authenticated = $currentUser->execute();
    if ($authenticated === null) respond(['error' => 'No autenticado.'], 401);
    $userId = $authenticated['id'];
    if ($path === '/api/entry-types' && $method === 'GET') respond((new ListEntryTypes($types))->execute());
    if ($path === '/api/entries' && $method === 'GET') {
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : null;
        respond((new ListEntries($entries, $types))->execute($userId, $page, $limit));
    }
    if ($path === '/api/entries' && $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        $created = (new CreateEntry($entries, $types))->execute($userId, $input);
        respond(['entry' => JournalEntryView::from($created, $types->byId($created->typeId))], 201);
    }
    respond(['error' => 'Ruta no encontrada'], 404);
} catch (DomainException $error) {
    respond(['error' => $error->getMessage()], 401);
} catch (InvalidArgumentException|JsonException $error) {
    respond(['error' => $error->getMessage()], 422);
} catch (Throwable $error) {
    respond(['error' => 'No se pudo completar la operación.'], 500);
}
