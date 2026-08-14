<?php
declare(strict_types=1);
namespace App\IdentityAccess\Infrastructure\Security;
use App\IdentityAccess\Application\Port\PasswordHasher;
use RuntimeException;
final class NativePasswordHasher implements PasswordHasher
{
    public function hash(string $plainPassword): string
    {
        $hash = password_hash($plainPassword, PASSWORD_DEFAULT);
        if ($hash === false) throw new RuntimeException('No se pudo proteger la contraseña.');
        return $hash;
    }
}
