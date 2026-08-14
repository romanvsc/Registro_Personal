<?php
declare(strict_types=1);
namespace App\IdentityAccess\Domain\PasswordReset\Repository;
use App\IdentityAccess\Domain\PasswordReset\Entity\PasswordResetToken;
use DateTimeImmutable;
interface PasswordResetTokenRepository
{
    public function invalidateForUser(int $userId, DateTimeImmutable $usedAt): void;
    public function create(int $userId, string $tokenHash, DateTimeImmutable $expiresAt): void;
    public function findByHash(string $tokenHash): ?PasswordResetToken;
}
