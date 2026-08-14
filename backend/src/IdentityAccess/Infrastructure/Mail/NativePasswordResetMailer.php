<?php
declare(strict_types=1);
namespace App\IdentityAccess\Infrastructure\Mail;
use App\IdentityAccess\Application\Port\PasswordResetMailer;
final readonly class NativePasswordResetMailer implements PasswordResetMailer
{
    public function __construct(private string $from, private string $fromName) {}
    public function send(string $recipientEmail, string $recipientName, string $resetUrl): void
    {
        $subject = 'Restablecer contraseña - Mi registro';
        $message = "Hola {$recipientName},\n\nUsá este enlace para restablecer tu contraseña:\n{$resetUrl}\n\nEl enlace vence en 60 minutos y sólo puede utilizarse una vez.";
        $safeName = str_replace(["\r", "\n"], '', $this->fromName);
        $safeFrom = str_replace(["\r", "\n"], '', $this->from);
        if (!filter_var($safeFrom, FILTER_VALIDATE_EMAIL)) throw new \RuntimeException('MAIL_FROM no es válido.');
        if (!mail($recipientEmail, $subject, $message, "From: {$safeName} <{$safeFrom}>\r\nContent-Type: text/plain; charset=UTF-8")) throw new \RuntimeException('No se pudo enviar el correo de recuperación.');
    }
}
