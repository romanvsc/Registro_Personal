<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\Port;

interface SessionStore
{
    public function authenticate(int $userId): void;
    public function authenticatedUserId(): ?int;
    public function clear(): void;
}
