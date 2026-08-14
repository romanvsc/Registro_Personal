<?php
declare(strict_types=1);
namespace App\IdentityAccess\Domain\PasswordReset\Entity;
use DateTimeImmutable;
final readonly class PasswordResetToken
{
    public function __construct(
        public int $id,
        public int $userId,
        public string $tokenHash,
        public DateTimeImmutable $expiresAt,
        public ?DateTimeImmutable $usedAt,
    ) {}

    public function isUsableAt(DateTimeImmutable $now): bool
    {
        return $this->usedAt === null && $this->expiresAt > $now;
    }
}
