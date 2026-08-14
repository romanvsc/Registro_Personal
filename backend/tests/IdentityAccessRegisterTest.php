<?php
declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) return;
    $file = __DIR__ . '/../src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($file)) require_once $file;
});

use App\IdentityAccess\Application\Port\InitialEntryTypesProvisioner;
use App\IdentityAccess\Application\Port\PasswordHasher;
use App\IdentityAccess\Application\Port\SessionStore;
use App\IdentityAccess\Application\Port\TransactionManager;
use App\IdentityAccess\Application\Register\Register;
use App\IdentityAccess\Application\Register\RegistrationValidationException;
use App\IdentityAccess\Domain\User\Entity\User;
use App\IdentityAccess\Domain\User\Exception\EmailAlreadyExists;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\Email;
use App\IdentityAccess\Infrastructure\Security\NativePasswordHasher;
use App\IdentityAccess\Infrastructure\Persistence\PdoTransactionManager;
use App\IdentityAccess\Infrastructure\Persistence\PdoUserRepository;

function expect(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

final class RegisterUsers implements UserRepository
{
    /** @var array<int, User> */
    public array $users = [];
    private int $nextId = 1;

    public function findByEmail(Email $email): ?User
    {
        foreach ($this->users as $user) if ($user->email->value === $email->value) return $user;
        return null;
    }
    public function findById(int $id): ?User { return $this->users[$id] ?? null; }
    public function add(User $user): User
    {
        if ($this->findByEmail($user->email) !== null) throw new EmailAlreadyExists();
        $persisted = new User($this->nextId++, $user->name, $user->email, $user->passwordHash, true);
        $this->users[$persisted->id] = $persisted;
        return $persisted;
    }
    public function save(User $user): User
    {
        if ($user->id === null) throw new RuntimeException('Usuario sin id.');
        $this->users[$user->id] = $user;
        return $user;
    }
    public function updatePasswordHash(int $userId, string $passwordHash): void
    {
        $user = $this->users[$userId] ?? throw new RuntimeException('Usuario inexistente.');
        $this->users[$userId] = new User($user->id, $user->name, $user->email, $passwordHash, true);
    }
}

final class RegisterSession implements SessionStore
{
    public ?int $userId = null;
    public int $authentications = 0;
    public function authenticate(int $userId): void { $this->userId = $userId; $this->authentications++; }
    public function authenticatedUserId(): ?int { return $this->userId; }
    public function clear(): void { $this->userId = null; }
}

final class RegisterTypes implements InitialEntryTypesProvisioner
{
    /** @var list<int> */
    public array $users = [];
    public function provisionFor(int $userId): void { $this->users[] = $userId; }
}

final class FailingRegisterTypes implements InitialEntryTypesProvisioner
{
    public function provisionFor(int $userId): void { throw new RuntimeException('Falló la configuración inicial.'); }
}

final class ImmediateTransaction implements TransactionManager
{
    public function run(callable $operation): mixed { return $operation(); }
}

function makeRegister(RegisterUsers $users, RegisterSession $session, RegisterTypes $types): Register
{
    return new Register($users, new NativePasswordHasher(), $session, $types, new ImmediateTransaction());
}

$users = new RegisterUsers();
$session = new RegisterSession();
$types = new RegisterTypes();
$register = makeRegister($users, $session, $types);
$result = $register->execute('  Roman Demo  ', '  ROMAN@EXAMPLE.COM ', 'una passphrase válida', 'una passphrase válida');
expect($result === ['id' => 1, 'name' => 'Roman Demo', 'email' => 'roman@example.com', 'avatarKey' => null, 'biography' => ''], 'El registro válido no normalizó los datos.');
expect($session->userId === 1 && $session->authentications === 1, 'No se creó la sesión después del registro.');
expect($types->users === [1], 'No se solicitaron los tipos iniciales para el nuevo usuario.');
$created = $users->findById(1);
expect($created !== null && $created->passwordHash !== 'una passphrase válida', 'La contraseña quedó en texto plano.');
expect(password_verify('una passphrase válida', $created->passwordHash), 'La contraseña no quedó hasheada correctamente.');

$invalidCases = [
    ['', 'valid@example.com', '12345678', '12345678', 'nombre vacío'],
    [str_repeat('a', 121), 'long-name@example.com', '12345678', '12345678', 'nombre demasiado largo'],
    ['Nombre', 'correo-inválido', '12345678', '12345678', 'email inválido'],
    ['Nombre', 'short@example.com', '1234567', '1234567', 'password corta'],
    ['Nombre', 'different@example.com', '12345678', '87654321', 'passwords distintas'],
];
foreach ($invalidCases as [$name, $email, $password, $confirmation, $label]) {
    try {
        $register->execute($name, $email, $password, $confirmation);
        throw new RuntimeException("Se aceptó un caso inválido: {$label}.");
    } catch (RegistrationValidationException) {}
}

try {
    $register->execute('Duplicado', 'ROMAN@example.com', 'otra passphrase', 'otra passphrase');
    throw new RuntimeException('Se aceptó un email duplicado.');
} catch (EmailAlreadyExists $error) {
    expect($error->getMessage() === 'Ya existe una cuenta asociada a este correo.', 'Mensaje incorrecto para email duplicado.');
}
expect(count($users->users) === 1, 'El duplicado creó un segundo usuario.');
expect($session->authentications === 1, 'Se creó sesión para un registro fallido.');

// La creación del usuario se revierte si falla la configuración inicial y no se abre sesión.
$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, is_active INTEGER NOT NULL, avatar_key TEXT NULL, biography TEXT NOT NULL DEFAULT '')");
$rollbackSession = new RegisterSession();
$rollbackRegister = new Register(
    new PdoUserRepository($pdo),
    new NativePasswordHasher(),
    $rollbackSession,
    new FailingRegisterTypes(),
    new PdoTransactionManager($pdo),
);
try {
    $rollbackRegister->execute('Rollback', 'rollback@example.com', 'passphrase segura', 'passphrase segura');
    throw new RuntimeException('El registro debía fallar al provisionar tipos.');
} catch (RuntimeException $error) {
    expect($error->getMessage() === 'Falló la configuración inicial.', 'Se recibió un error inesperado al probar rollback.');
}
expect((int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn() === 0, 'El usuario no se revirtió tras fallar la configuración.');
expect($rollbackSession->userId === null, 'Se creó sesión antes de completar la transacción.');

echo "IdentityAccess register tests: OK\n";
