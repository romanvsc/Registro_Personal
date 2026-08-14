<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\UpdateProfile;

use App\IdentityAccess\Application\Port\PasswordVerifier;
use App\IdentityAccess\Application\Port\PasswordHasher;
use App\IdentityAccess\Application\Port\SessionStore;
use App\IdentityAccess\Application\UserView;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\AvatarKey;
use App\IdentityAccess\Domain\User\ValueObject\Biography;
use App\IdentityAccess\Domain\User\ValueObject\UserName;
use DomainException;
use InvalidArgumentException;

final readonly class UpdateProfile
{
    public function __construct(
        private UserRepository $users,
        private PasswordVerifier $passwords,
        private PasswordHasher $passwordHasher,
        private SessionStore $sessions,
    ) {}

    /** @return array{id:int,name:string,email:string,avatarKey:?string,biography:string} */
    public function execute(
        string $name,
        ?string $avatarKey,
        string $biography,
        string $currentPassword,
        string $password,
        string $passwordConfirmation,
    ): array
    {
        $userId = $this->sessions->authenticatedUserId();
        if ($userId === null || ($user = $this->users->findById($userId)) === null) {
            $this->sessions->clear();
            throw new DomainException('No autenticado.');
        }
        $user->ensureCanAuthenticate();

        try {
            $normalizedName = new UserName($name);
            $normalizedAvatar = AvatarKey::nullable($avatarKey);
            $normalizedBiography = new Biography($biography);
        } catch (InvalidArgumentException $error) {
            throw new ProfileValidationException($error->getMessage());
        }

        $passwordFields = [$currentPassword, $password, $passwordConfirmation];
        $passwordChangeRequested = array_filter($passwordFields, static fn (string $value): bool => $value !== '') !== [];
        $passwordHash = null;

        if ($passwordChangeRequested) {
            if ($currentPassword === '' || $password === '' || $passwordConfirmation === '') {
                throw new ProfileValidationException('Completá la contraseña actual, la nueva contraseña y su confirmación.');
            }
            if (!$this->passwords->verify($currentPassword, $user->passwordHash)) {
                throw new CurrentPasswordInvalid();
            }
            $passwordLength = function_exists('mb_strlen') ? mb_strlen($password) : strlen($password);
            if ($passwordLength < 8) throw new ProfileValidationException('La nueva contraseña debe tener al menos 8 caracteres.');
            if (!hash_equals($password, $passwordConfirmation)) throw new ProfileValidationException('Las contraseñas no coinciden.');
            $passwordHash = $this->passwordHasher->hash($password);
        }

        $updated = $user->withProfileAndPassword($normalizedName, $normalizedAvatar, $normalizedBiography, $passwordHash);

        return UserView::from($this->users->save($updated));
    }
}
