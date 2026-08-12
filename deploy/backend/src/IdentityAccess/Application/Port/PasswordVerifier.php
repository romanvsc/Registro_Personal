<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\Port;

interface PasswordVerifier
{
    public function verify(string $plainPassword, string $passwordHash): bool;
}
