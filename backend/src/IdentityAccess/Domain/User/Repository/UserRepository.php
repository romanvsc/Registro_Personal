<?php
declare(strict_types=1);

namespace App\IdentityAccess\Domain\User\Repository;

use App\IdentityAccess\Domain\User\Entity\User;
use App\IdentityAccess\Domain\User\ValueObject\Email;

interface UserRepository
{
    public function findByEmail(Email $email): ?User;
    public function findById(int $id): ?User;
    public function add(User $user): User;
    public function save(User $user): User;
    public function updatePasswordHash(int $userId, string $passwordHash): void;
}
