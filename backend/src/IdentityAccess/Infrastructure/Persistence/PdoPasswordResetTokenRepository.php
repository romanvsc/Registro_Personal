<?php
declare(strict_types=1);
namespace App\IdentityAccess\Infrastructure\Persistence;
use App\IdentityAccess\Domain\PasswordReset\Entity\PasswordResetToken;
use App\IdentityAccess\Domain\PasswordReset\Repository\PasswordResetTokenRepository;
use DateTimeImmutable;
use PDO;
final readonly class PdoPasswordResetTokenRepository implements PasswordResetTokenRepository
{
    public function __construct(private PDO $pdo) {}
    public function invalidateForUser(int $userId, DateTimeImmutable $usedAt): void
    {
        $stmt = $this->pdo->prepare('UPDATE password_reset_tokens SET used_at = :used_at WHERE user_id = :user_id AND used_at IS NULL');
        $stmt->execute(['used_at' => $usedAt->format('Y-m-d H:i:s'), 'user_id' => $userId]);
    }
    public function create(int $userId, string $tokenHash, DateTimeImmutable $expiresAt): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (:user_id, :token_hash, :expires_at)');
        $stmt->execute(['user_id' => $userId, 'token_hash' => $tokenHash, 'expires_at' => $expiresAt->format('Y-m-d H:i:s')]);
    }
    public function findByHash(string $tokenHash): ?PasswordResetToken
    {
        $lock = $this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql' && $this->pdo->inTransaction() ? ' FOR UPDATE' : '';
        $stmt = $this->pdo->prepare('SELECT id, user_id, token_hash, expires_at, used_at FROM password_reset_tokens WHERE token_hash = :token_hash LIMIT 1' . $lock);
        $stmt->execute(['token_hash' => $tokenHash]);
        $row = $stmt->fetch();
        if (!$row) return null;
        return new PasswordResetToken((int)$row['id'], (int)$row['user_id'], $row['token_hash'], new DateTimeImmutable($row['expires_at']), $row['used_at'] ? new DateTimeImmutable($row['used_at']) : null);
    }
}
