<?php
declare(strict_types=1);

namespace App\IdentityAccess\Domain\User\Entity;

use App\IdentityAccess\Domain\User\ValueObject\Email;
use DomainException;

final readonly class User
{
    public function __construct(
        public int $id,
        public string $name,
        public Email $email,
        public string $passwordHash,
        private bool $active,
    ) {
        if ($id < 1 || trim($name) === '' || $passwordHash === '') {
            throw new DomainException('El usuario persistido es inválido.');
        }
    }

    public function ensureCanAuthenticate(): void
    {
        if (!$this->active) {
            throw new DomainException('La cuenta está desactivada.');
        }
    }
}
