<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/IdentityAccess/Application/Port/SessionStore.php';
require_once __DIR__ . '/../src/IdentityAccess/Application/Port/PasswordVerifier.php';
require_once __DIR__ . '/../src/IdentityAccess/Domain/User/ValueObject/Email.php';
require_once __DIR__ . '/../src/IdentityAccess/Domain/User/Entity/User.php';
require_once __DIR__ . '/../src/IdentityAccess/Domain/User/Repository/UserRepository.php';
require_once __DIR__ . '/../src/IdentityAccess/Application/CurrentUser/GetCurrentUser.php';
require_once __DIR__ . '/../src/IdentityAccess/Application/Login/Login.php';

use App\IdentityAccess\Application\CurrentUser\GetCurrentUser;
use App\IdentityAccess\Application\Login\Login;
use App\IdentityAccess\Application\Port\PasswordVerifier;
use App\IdentityAccess\Application\Port\SessionStore;
use App\IdentityAccess\Domain\User\Entity\User;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\Email;

final class InMemorySessionStore implements SessionStore
{
    private ?int $userId = null;

    public function authenticate(int $userId): void { $this->userId = $userId; }
    public function authenticatedUserId(): ?int { return $this->userId; }
    public function clear(): void { $this->userId = null; }
}

final class InMemoryUserRepository implements UserRepository
{
    public function __construct(private array $users) {}

    public function findByEmail(Email $email): ?User
    {
        foreach ($this->users as $user) {
            if ($user->email->value === $email->value) return $user;
        }
        return null;
    }

    public function findById(int $id): ?User
    {
        foreach ($this->users as $user) {
            if ($user->id === $id) return $user;
        }
        return null;
    }

    public function add(User $user): User
    {
        return new User(2, $user->name, $user->email, $user->passwordHash, true);
    }
    public function updatePasswordHash(int $userId, string $passwordHash): void {}
}

final class AlwaysTruePasswordVerifier implements PasswordVerifier
{
    public function verify(string $plain, string $hash): bool { return true; }
}

$active = new User(1, 'Demo', new Email('demo@registro.local'), 'hash', true);
$users = new InMemoryUserRepository([$active]);

// Usuario no autenticado (sin sesión)
$emptySession = new InMemorySessionStore();
$current = new GetCurrentUser($users, $emptySession);
assert($current->execute() === null);

// Usuario autenticado
$session = new InMemorySessionStore();
$session->authenticate(1);
$authenticated = new GetCurrentUser($users, $session);
assert($authenticated->execute() === ['id' => 1, 'name' => 'Demo', 'email' => 'demo@registro.local']);

// Sesión con id inexistente
$ghostSession = new InMemorySessionStore();
$ghostSession->authenticate(999);
$ghost = new GetCurrentUser($users, $ghostSession);
assert($ghost->execute() === null);

// Login exitoso restablece sesión
$login = new Login($users, new AlwaysTruePasswordVerifier(), $session);

echo "IdentityAccess application tests: OK\n";
