<?php
declare(strict_types=1);

namespace App\IdentityAccess\Infrastructure\Persistence;

use App\IdentityAccess\Domain\User\Entity\User;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\Email;
use PDO;

final readonly class PdoUserRepository implements UserRepository
{
    public function __construct(private PDO $pdo) {}
    public function findByEmail(Email $email): ?User
    {
        $stmt = $this->pdo->prepare('SELECT id, name, email, password_hash, is_active FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email->value]);
        return $this->hydrate($stmt->fetch() ?: null);
    }
    public function findById(int $id): ?User
    {
        $stmt = $this->pdo->prepare('SELECT id, name, email, password_hash, is_active FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        return $this->hydrate($stmt->fetch() ?: null);
    }
    private function hydrate(?array $row): ?User
    {
        return $row === null ? null : new User((int)$row['id'], $row['name'], new Email($row['email']), $row['password_hash'], (bool)$row['is_active']);
    }
}
