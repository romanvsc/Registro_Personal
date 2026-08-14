<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\Port;
interface PasswordResetRateLimiter { public function consume(string $clientIp, string $normalizedEmail): void; }
