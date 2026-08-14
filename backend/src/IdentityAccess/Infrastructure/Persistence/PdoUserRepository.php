<?php
declare(strict_types=1);

namespace App\IdentityAccess\Infrastructure\Persistence;

use App\IdentityAccess\Domain\User\Entity\User;
use App\IdentityAccess\Domain\User\Exception\EmailAlreadyExists;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\Email;
use PDO;
use PDOException;

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
    public function add(User $user): User
    {
        try {
            $stmt = $this->pdo->prepare('INSERT INTO users (name, email, password_hash, is_active) VALUES (:name, :email, :password_hash, 1)');
            $stmt->execute([
                'name' => $user->name,
                'email' => $user->email->value,
                'password_hash' => $user->passwordHash,
            ]);
        } catch (PDOException $error) {
            $driverCode = isset($error->errorInfo[1]) ? (int)$error->errorInfo[1] : null;
            if ($error->getCode() === '23000' && ($driverCode === null || $driverCode === 1062)) {
                throw new EmailAlreadyExists();
            }
            throw $error;
        }

        return new User((int)$this->pdo->lastInsertId(), $user->name, $user->email, $user->passwordHash, true);
    }
    public function updatePasswordHash(int $userId, string $passwordHash): void
    {
        $stmt = $this->pdo->prepare('UPDATE users SET password_hash = :password_hash WHERE id = :id');
        $stmt->execute(['password_hash' => $passwordHash, 'id' => $userId]);
        if ($stmt->rowCount() !== 1) throw new \RuntimeException('No se pudo actualizar la contraseña.');
    }
    private function hydrate(?array $row): ?User
    {
        return $row === null ? null : new User((int)$row['id'], $row['name'], new Email($row['email']), $row['password_hash'], (bool)$row['is_active']);
    }
}
