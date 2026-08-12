<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\Login;

use App\IdentityAccess\Application\Port\PasswordVerifier;
use App\IdentityAccess\Application\Port\SessionStore;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\Email;
use DomainException;

final readonly class Login
{
    public function __construct(
        private UserRepository $users,
        private PasswordVerifier $passwords,
        private SessionStore $sessions,
    ) {}

    /** @return array{id:int,name:string,email:string} */
    public function execute(string $email, string $password): array
    {
        $user = $this->users->findByEmail(new Email($email));
        if ($user === null || !$this->passwords->verify($password, $user->passwordHash)) {
            throw new DomainException('Email o contraseña incorrectos.');
        }
        $user->ensureCanAuthenticate();
        $this->sessions->authenticate($user->id);
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email->value];
    }
}
