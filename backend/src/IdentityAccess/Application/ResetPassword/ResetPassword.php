<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\ResetPassword;
use App\IdentityAccess\Application\Port\Clock;
use App\IdentityAccess\Application\Port\PasswordHasher;
use App\IdentityAccess\Application\Port\TransactionManager;
use App\IdentityAccess\Application\Register\RegistrationValidationException;
use App\IdentityAccess\Domain\PasswordReset\Repository\PasswordResetTokenRepository;
use App\IdentityAccess\Domain\User\Repository\UserRepository;

final readonly class ResetPassword
{
    public function __construct(
        private UserRepository $users,
        private PasswordResetTokenRepository $tokens,
        private PasswordHasher $passwords,
        private TransactionManager $transactions,
        private Clock $clock,
    ) {}

    public function execute(string $plainToken, string $password, string $passwordConfirmation): void
    {
        if ($plainToken === '') throw new InvalidResetToken();
        $this->transactions->run(function () use ($plainToken, $password, $passwordConfirmation): void {
            $token = $this->tokens->findByHash(hash('sha256', $plainToken));
            $now = $this->clock->now();
            if ($token === null || !$token->isUsableAt($now)) throw new InvalidResetToken();
            if ((function_exists('mb_strlen') ? mb_strlen($password) : strlen($password)) < 8) {
                throw new RegistrationValidationException('La contraseña debe tener al menos 8 caracteres.');
            }
            if (!hash_equals($password, $passwordConfirmation)) throw new RegistrationValidationException('Las contraseñas no coinciden.');
            if ($this->users->findById($token->userId) === null) throw new InvalidResetToken();
            $this->users->updatePasswordHash($token->userId, $this->passwords->hash($password));
            $this->tokens->invalidateForUser($token->userId, $now);
        });
    }
}
