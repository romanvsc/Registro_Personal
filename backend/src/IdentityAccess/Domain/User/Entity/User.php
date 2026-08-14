<?php
declare(strict_types=1);

namespace App\IdentityAccess\Domain\User\Entity;

use App\IdentityAccess\Domain\User\ValueObject\Email;
use DomainException;

final readonly class User
{
    public ?int $id;
    public string $name;
    public Email $email;
    public string $passwordHash;
    private bool $active;

    public function __construct(?int $id, string $name, Email $email, string $passwordHash, bool $active)
    {
        $normalizedName = trim($name);
        $nameLength = function_exists('mb_strlen') ? mb_strlen($normalizedName) : strlen($normalizedName);
        if (($id !== null && $id < 1) || $normalizedName === '' || $nameLength > 120 || $passwordHash === '') {
            throw new DomainException('El usuario es inválido.');
        }
        $this->id = $id;
        $this->name = $normalizedName;
        $this->email = $email;
        $this->passwordHash = $passwordHash;
        $this->active = $active;
    }

    public static function register(string $name, Email $email, string $passwordHash): self
    {
        return new self(null, $name, $email, $passwordHash, true);
    }

    public function ensureCanAuthenticate(): void
    {
        if (!$this->active) throw new DomainException('La cuenta está desactivada.');
    }
}
