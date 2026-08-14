<?php
declare(strict_types=1);
namespace App\IdentityAccess\Infrastructure\Security;
use App\IdentityAccess\Application\Port\TokenGenerator;
final class CryptographicTokenGenerator implements TokenGenerator
{
    public function generate(): string { return bin2hex(random_bytes(32)); }
}
