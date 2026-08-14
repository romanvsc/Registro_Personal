<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\Port;
interface PasswordResetMailer { public function send(string $recipientEmail, string $recipientName, string $resetUrl): void; }
