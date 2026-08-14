<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\Register;

use App\IdentityAccess\Application\Port\InitialEntryTypesProvisioner;
use App\IdentityAccess\Application\Port\PasswordHasher;
use App\IdentityAccess\Application\Port\SessionStore;
use App\IdentityAccess\Application\Port\TransactionManager;
use App\IdentityAccess\Domain\User\Entity\User;
use App\IdentityAccess\Domain\User\Exception\EmailAlreadyExists;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\Email;
use InvalidArgumentException;
use RuntimeException;

final readonly class Register
{
    public function __construct(
        private UserRepository $users,
        private PasswordHasher $passwords,
        private SessionStore $sessions,
        private InitialEntryTypesProvisioner $initialEntryTypes,
        private TransactionManager $transactions,
    ) {}

    /** @return array{id:int,name:string,email:string} */
    public function execute(string $name, string $email, string $password, string $passwordConfirmation): array
    {
        $normalizedName = trim($name);
        $nameLength = function_exists('mb_strlen') ? mb_strlen($normalizedName) : strlen($normalizedName);
        if ($normalizedName === '') throw new RegistrationValidationException('El nombre es obligatorio.');
        if ($nameLength > 120) throw new RegistrationValidationException('El nombre no puede superar los 120 caracteres.');

        try { $normalizedEmail = new Email($email); }
        catch (InvalidArgumentException) { throw new RegistrationValidationException('Ingresá un correo electrónico válido.'); }

        $passwordLength = function_exists('mb_strlen') ? mb_strlen($password) : strlen($password);
        if ($passwordLength < 8) throw new RegistrationValidationException('La contraseña debe tener al menos 8 caracteres.');
        if (!hash_equals($password, $passwordConfirmation)) throw new RegistrationValidationException('Las contraseñas no coinciden.');

        /** @var User $created */
        $created = $this->transactions->run(function () use ($normalizedName, $normalizedEmail, $password): User {
            if ($this->users->findByEmail($normalizedEmail) !== null) throw new EmailAlreadyExists();
            $persisted = $this->users->add(User::register($normalizedName, $normalizedEmail, $this->passwords->hash($password)));
            if ($persisted->id === null) throw new RuntimeException('No se pudo identificar al usuario creado.');
            $this->initialEntryTypes->provisionFor($persisted->id);
            return $persisted;
        });

        if ($created->id === null) throw new RuntimeException('No se pudo identificar al usuario creado.');
        $this->sessions->authenticate($created->id);
        return ['id' => $created->id, 'name' => $created->name, 'email' => $created->email->value];
    }
}
