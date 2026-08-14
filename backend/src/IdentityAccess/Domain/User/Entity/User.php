<?php
declare(strict_types=1);

namespace App\IdentityAccess\Domain\User\Entity;

use App\IdentityAccess\Domain\User\ValueObject\Email;
use App\IdentityAccess\Domain\User\ValueObject\AvatarKey;
use App\IdentityAccess\Domain\User\ValueObject\Biography;
use App\IdentityAccess\Domain\User\ValueObject\UserName;
use DomainException;

final readonly class User
{
    public ?int $id;
    public UserName $name;
    public Email $email;
    public string $passwordHash;
    public ?AvatarKey $avatarKey;
    public Biography $biography;
    private bool $active;

    public function __construct(
        ?int $id,
        UserName|string $name,
        Email $email,
        string $passwordHash,
        bool $active,
        AvatarKey|string|null $avatarKey = null,
        Biography|string $biography = '',
    )
    {
        if (($id !== null && $id < 1) || $passwordHash === '') {
            throw new DomainException('El usuario es inválido.');
        }
        $this->id = $id;
        $this->name = is_string($name) ? new UserName($name) : $name;
        $this->email = $email;
        $this->passwordHash = $passwordHash;
        $this->avatarKey = is_string($avatarKey) ? AvatarKey::nullable($avatarKey) : $avatarKey;
        $this->biography = is_string($biography) ? new Biography($biography) : $biography;
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

    public function withProfile(UserName $name, ?AvatarKey $avatarKey, Biography $biography): self
    {
        return new self($this->id, $name, $this->email, $this->passwordHash, $this->active, $avatarKey, $biography);
    }

    public function withPasswordHash(string $passwordHash): self
    {
        return new self($this->id, $this->name, $this->email, $passwordHash, $this->active, $this->avatarKey, $this->biography);
    }

    public function withProfileAndPassword(UserName $name, ?AvatarKey $avatarKey, Biography $biography, ?string $passwordHash = null): self
    {
        return new self($this->id, $name, $this->email, $passwordHash ?? $this->passwordHash, $this->active, $avatarKey, $biography);
    }
}
