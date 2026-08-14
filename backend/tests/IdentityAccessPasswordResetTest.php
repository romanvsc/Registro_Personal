<?php
declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) return;
    $file = __DIR__ . '/../src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($file)) require_once $file;
});

use App\IdentityAccess\Application\ForgotPassword\ForgotPassword;
use App\IdentityAccess\Application\Port\Clock;
use App\IdentityAccess\Application\Port\PasswordResetMailer;
use App\IdentityAccess\Application\Port\PasswordResetRateLimiter;
use App\IdentityAccess\Application\Port\TokenGenerator;
use App\IdentityAccess\Application\Register\RegistrationValidationException;
use App\IdentityAccess\Application\ResetPassword\InvalidResetToken;
use App\IdentityAccess\Application\ResetPassword\ResetPassword;
use App\IdentityAccess\Application\ForgotPassword\RateLimitExceeded;
use App\IdentityAccess\Infrastructure\RateLimit\FilePasswordResetRateLimiter;
use App\IdentityAccess\Infrastructure\Persistence\PdoPasswordResetTokenRepository;
use App\IdentityAccess\Infrastructure\Persistence\PdoTransactionManager;
use App\IdentityAccess\Infrastructure\Persistence\PdoUserRepository;
use App\IdentityAccess\Infrastructure\Security\NativePasswordHasher;
use App\IdentityAccess\Infrastructure\Security\NativePasswordVerifier;
function resetExpect(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }

final class FixedResetClock implements Clock
{
    public function __construct(public DateTimeImmutable $current) {}
    public function now(): DateTimeImmutable { return $this->current; }
}
final class SequentialTokenGenerator implements TokenGenerator
{
    private int $next = 1;
    public function generate(): string { return str_repeat((string)$this->next++, 64); }
}
final class CapturingResetMailer implements PasswordResetMailer
{
    /** @var list<array{email:string,url:string}> */
    public array $sent = [];
    public function send(string $recipientEmail, string $recipientName, string $resetUrl): void { $this->sent[] = ['email' => $recipientEmail, 'url' => $resetUrl]; }
}
final class AllowResetRateLimiter implements PasswordResetRateLimiter
{
    public array $keys = [];
    public function consume(string $clientIp, string $normalizedEmail): void { $this->keys[] = [$clientIp, $normalizedEmail]; }
}

$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, is_active INTEGER NOT NULL)');
$pdo->exec('CREATE TABLE password_reset_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, used_at TEXT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)');
$oldPassword = 'contraseña anterior';
$oldHash = password_hash($oldPassword, PASSWORD_DEFAULT);
$insert = $pdo->prepare('INSERT INTO users (name,email,password_hash,is_active) VALUES (?,?,?,1)');
$insert->execute(['Usuario', 'usuario@example.com', $oldHash]);

$users = new PdoUserRepository($pdo);
$tokens = new PdoPasswordResetTokenRepository($pdo);
$transactions = new PdoTransactionManager($pdo);
$clock = new FixedResetClock(new DateTimeImmutable('2026-08-14 12:00:00'));
$generator = new SequentialTokenGenerator();
$mailer = new CapturingResetMailer();
$limiter = new AllowResetRateLimiter();
$forgot = new ForgotPassword($users, $tokens, $generator, $mailer, $limiter, $clock, $transactions, 'http://localhost:5125/registro_gatos');

$existingMessage = $forgot->execute(' USUARIO@EXAMPLE.COM ', '127.0.0.1');
$missingMessage = $forgot->execute('nadie@example.com', '127.0.0.1');
resetExpect($existingMessage === $missingMessage && $existingMessage === ForgotPassword::MESSAGE, 'La respuesta permite enumerar usuarios.');
resetExpect(count($mailer->sent) === 1, 'Se envió correo para usuario inexistente o faltó el existente.');
$plainToken = str_repeat('1', 64);
$stored = $pdo->query('SELECT token_hash FROM password_reset_tokens WHERE user_id = 1 ORDER BY id DESC LIMIT 1')->fetchColumn();
resetExpect($stored === hash('sha256', $plainToken) && $stored !== $plainToken, 'El token no se almacenó únicamente como hash.');
resetExpect(str_contains($mailer->sent[0]['url'], rawurlencode($plainToken)), 'El enlace no contiene el token de un solo uso.');

// Un nuevo forgot invalida el token anterior.
$forgot->execute('usuario@example.com', '127.0.0.1');
resetExpect($pdo->query('SELECT used_at FROM password_reset_tokens WHERE id = 1')->fetchColumn() !== false, 'El token anterior no fue invalidado.');
$activePlainToken = str_repeat('2', 64);

$reset = new ResetPassword($users, $tokens, new NativePasswordHasher(), $transactions, $clock);
try { $reset->execute('token-inexistente', 'nueva contraseña', 'nueva contraseña'); throw new RuntimeException('Token inválido aceptado.'); }
catch (InvalidResetToken) {}

$tokens->create(1, hash('sha256', 'token-expirado'), new DateTimeImmutable('2026-08-14 11:59:59'));
try { $reset->execute('token-expirado', 'nueva contraseña', 'nueva contraseña'); throw new RuntimeException('Token expirado aceptado.'); }
catch (InvalidResetToken) {}

try { $reset->execute($activePlainToken, 'corta', 'corta'); throw new RuntimeException('Password corta aceptada.'); }
catch (RegistrationValidationException) {}
try { $reset->execute($activePlainToken, 'nueva contraseña', 'otra contraseña'); throw new RuntimeException('Passwords distintas aceptadas.'); }
catch (RegistrationValidationException) {}

// Otro token pendiente del mismo usuario también debe quedar invalidado.
$tokens->create(1, hash('sha256', 'otro-token-pendiente'), new DateTimeImmutable('2026-08-14 13:00:00'));
$newPassword = 'esta es la nueva passphrase';
$reset->execute($activePlainToken, $newPassword, $newPassword);
$updated = $users->findById(1);
$verifier = new NativePasswordVerifier();
resetExpect($updated !== null && $verifier->verify($newPassword, $updated->passwordHash), 'La password nueva no funciona.');
resetExpect(!$verifier->verify($oldPassword, $updated->passwordHash), 'La password vieja todavía funciona.');
resetExpect((int)$pdo->query('SELECT COUNT(*) FROM password_reset_tokens WHERE user_id = 1 AND used_at IS NULL')->fetchColumn() === 0, 'Quedaron tokens pendientes sin invalidar.');

try { $reset->execute($activePlainToken, 'tercera contraseña', 'tercera contraseña'); throw new RuntimeException('Token reutilizado aceptado.'); }
catch (InvalidResetToken) {}
try { $reset->execute('otro-token-pendiente', 'tercera contraseña', 'tercera contraseña'); throw new RuntimeException('Otro token pendiente siguió activo.'); }
catch (InvalidResetToken) {}

$rateDirectory = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'registro-reset-rate-' . bin2hex(random_bytes(6));
$rateLimiter = new FilePasswordResetRateLimiter($rateDirectory, 2, 900);
$rateLimiter->consume('127.0.0.1', hash('sha256', 'usuario@example.com'));
$rateLimiter->consume('127.0.0.1', hash('sha256', 'usuario@example.com'));
try { $rateLimiter->consume('127.0.0.1', hash('sha256', 'usuario@example.com')); throw new RuntimeException('Rate limit no aplicado.'); }
catch (RateLimitExceeded) {}
foreach (glob($rateDirectory . DIRECTORY_SEPARATOR . '*.json') ?: [] as $rateFile) unlink($rateFile);
rmdir($rateDirectory);

echo "IdentityAccess password reset tests: OK\n";
