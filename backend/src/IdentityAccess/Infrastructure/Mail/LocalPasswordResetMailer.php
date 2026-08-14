<?php
declare(strict_types=1);
namespace App\IdentityAccess\Infrastructure\Mail;
use App\IdentityAccess\Application\Port\PasswordResetMailer;
final readonly class LocalPasswordResetMailer implements PasswordResetMailer
{
    public function __construct(private string $logPath) {}
    public function send(string $recipientEmail, string $recipientName, string $resetUrl): void
    {
        $directory = dirname($this->logPath);
        if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) throw new \RuntimeException('No se pudo preparar el correo local.');
        $line = json_encode(['createdAt' => gmdate(DATE_ATOM), 'recipient' => $recipientEmail, 'resetUrl' => $resetUrl], JSON_UNESCAPED_SLASHES) . PHP_EOL;
        if (file_put_contents($this->logPath, $line, FILE_APPEND | LOCK_EX) === false) throw new \RuntimeException('No se pudo registrar el correo local.');
    }
}
