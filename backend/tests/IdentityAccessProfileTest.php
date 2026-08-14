<?php
declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) return;
    $file = __DIR__ . '/../src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($file)) require_once $file;
});

use App\IdentityAccess\Application\Port\SessionStore;
use App\IdentityAccess\Application\UpdateProfile\CurrentPasswordInvalid;
use App\IdentityAccess\Application\UpdateProfile\ProfileValidationException;
use App\IdentityAccess\Application\UpdateProfile\UpdateProfile;
use App\IdentityAccess\Application\UserView;
use App\IdentityAccess\Domain\User\Entity\User;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\AvatarKey;
use App\IdentityAccess\Domain\User\ValueObject\Biography;
use App\IdentityAccess\Domain\User\ValueObject\Email;
use App\IdentityAccess\Domain\User\ValueObject\UserName;
use App\IdentityAccess\Infrastructure\Persistence\PdoUserRepository;
use App\IdentityAccess\Infrastructure\Security\NativePasswordHasher;
use App\IdentityAccess\Infrastructure\Security\NativePasswordVerifier;

function profileExpect(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

final class ProfileUsers implements UserRepository
{
    /** @param array<int, User> $users */
    public function __construct(public array $users) {}

    public function findByEmail(Email $email): ?User
    {
        foreach ($this->users as $user) if ($user->email->value === $email->value) return $user;
        return null;
    }
    public function findById(int $id): ?User { return $this->users[$id] ?? null; }
    public function add(User $user): User { throw new LogicException('No utilizado.'); }
    public function save(User $user): User
    {
        if ($user->id === null) throw new LogicException('Usuario sin id.');
        $this->users[$user->id] = $user;
        return $user;
    }
    public function updatePasswordHash(int $userId, string $passwordHash): void { throw new LogicException('No utilizado.'); }
}

final class ProfileSession implements SessionStore
{
    public bool $cleared = false;
    public function __construct(public ?int $userId) {}
    public function authenticate(int $userId): void { $this->userId = $userId; }
    public function authenticatedUserId(): ?int { return $this->userId; }
    public function clear(): void { $this->userId = null; $this->cleared = true; }
}

$userA = new User(1, 'Usuario A', new Email('a@example.com'), password_hash('secreto-a', PASSWORD_DEFAULT), true);
$userB = new User(2, 'Usuario B', new Email('b@example.com'), password_hash('secreto-b', PASSWORD_DEFAULT), true);
$users = new ProfileUsers([1 => $userA, 2 => $userB]);
$session = new ProfileSession(1);
$update = new UpdateProfile($users, new NativePasswordVerifier(), new NativePasswordHasher(), $session);

$view = $update->execute(
    '  Roman actualizado  ',
    'dorito-guino',
    '  Entrenando y registrando un día a la vez.  ',
    '',
    '',
    '',
);
profileExpect($view === [
    'id' => 1,
    'name' => 'Roman actualizado',
    'email' => 'a@example.com',
    'avatarKey' => 'dorito-guino',
    'biography' => 'Entrenando y registrando un día a la vez.',
], 'El perfil válido no se normalizó o no respetó el contrato público.');
profileExpect($users->findById(2) === $userB, 'La sesión de A modificó al usuario B.');
profileExpect(!array_key_exists('passwordHash', UserView::from($users->findById(1))), 'UserView filtró una credencial sensible.');
profileExpect(password_verify('secreto-a', $users->findById(1)?->passwordHash ?? ''), 'Actualizar sólo el perfil alteró la contraseña.');

$withoutAvatar = $update->execute('Roman actualizado', null, '', '', '', '');
profileExpect($withoutAvatar['avatarKey'] === null && $withoutAvatar['biography'] === '', 'No se pudo quitar el avatar o vaciar la biografía.');

try {
    $update->execute('Roman', 'dorito-feliz', '', 'incorrecta', 'nueva contraseña', 'nueva contraseña');
    throw new RuntimeException('Se actualizó el perfil sin validar la contraseña actual.');
} catch (CurrentPasswordInvalid $error) {
    profileExpect($error::ERROR_CODE === 'CURRENT_PASSWORD_INVALID', 'Código incorrecto para password actual inválida.');
}
profileExpect($users->findById(1)?->avatarKey === null, 'Un intento con contraseña inválida modificó el perfil.');

$anonymousSession = new ProfileSession(null);
try {
    (new UpdateProfile($users, new NativePasswordVerifier(), new NativePasswordHasher(), $anonymousSession))->execute('Intruso', null, '', '', '', '');
    throw new RuntimeException('Se actualizó un perfil sin sesión.');
} catch (DomainException $error) {
    profileExpect($error->getMessage() === 'No autenticado.' && $anonymousSession->cleared, 'La ausencia de sesión no se trató correctamente.');
}

$invalidProfiles = [
    ['', null, '', 'nombre vacío'],
    [str_repeat('a', 121), null, '', 'nombre largo'],
    ['Roman', 'avatar-inventado', '', 'avatar fuera de catálogo'],
    ['Roman', null, str_repeat('b', 501), 'biografía larga'],
];
foreach ($invalidProfiles as [$name, $avatarKey, $biography, $label]) {
    try {
        $update->execute($name, $avatarKey, $biography, '', '', '');
        throw new RuntimeException("Se aceptó un perfil inválido: {$label}.");
    } catch (ProfileValidationException $error) {
        profileExpect($error::ERROR_CODE === 'PROFILE_VALIDATION_ERROR', 'Código incorrecto para validación del perfil.');
    }
}

$invalidPasswords = [
    ['secreto-a', '', '', 'campos incompletos'],
    ['secreto-a', 'corta', 'corta', 'contraseña corta'],
    ['secreto-a', 'nueva contraseña', 'otra contraseña', 'confirmación distinta'],
];
foreach ($invalidPasswords as [$currentPassword, $password, $confirmation, $label]) {
    try {
        $update->execute('Roman actualizado', null, '', $currentPassword, $password, $confirmation);
        throw new RuntimeException("Se aceptó un cambio de contraseña inválido: {$label}.");
    } catch (ProfileValidationException) {}
}
profileExpect(password_verify('secreto-a', $users->findById(1)?->passwordHash ?? ''), 'Una validación fallida modificó la contraseña.');

$newPassword = 'esta es una nueva passphrase';
$update->execute('Roman actualizado', 'felicia-atenta', 'Nueva etapa', 'secreto-a', $newPassword, $newPassword);
$passwordUpdated = $users->findById(1) ?? throw new RuntimeException('El usuario actualizado desapareció.');
profileExpect($passwordUpdated->passwordHash !== $newPassword, 'La contraseña nueva quedó en texto plano.');
profileExpect(password_verify($newPassword, $passwordUpdated->passwordHash), 'La contraseña nueva no quedó hasheada correctamente.');
profileExpect(!password_verify('secreto-a', $passwordUpdated->passwordHash), 'La contraseña anterior todavía funciona.');

try {
    new AvatarKey('felicia-inventada');
    throw new RuntimeException('AvatarKey aceptó una clave fuera de whitelist.');
} catch (InvalidArgumentException) {}
profileExpect((new Biography('  Hola  '))->value === 'Hola', 'Biography no aplica trim.');
profileExpect((new UserName('  Nombre  '))->value === 'Nombre', 'UserName no aplica trim.');

$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->exec("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, is_active INTEGER NOT NULL, avatar_key TEXT NULL, biography TEXT NOT NULL DEFAULT '')");
$pdoOldHash = password_hash('pdo anterior', PASSWORD_DEFAULT);
$insertPdoUser = $pdo->prepare("INSERT INTO users (name, email, password_hash, is_active, avatar_key, biography) VALUES ('Persistido', 'pdo@example.com', :password_hash, 1, NULL, '')");
$insertPdoUser->execute(['password_hash' => $pdoOldHash]);
$repository = new PdoUserRepository($pdo);
$persisted = $repository->findById(1) ?? throw new RuntimeException('No se hidrató el usuario PDO.');
$pdoNewHash = (new NativePasswordHasher())->hash('pdo contraseña nueva');
$saved = $repository->save($persisted->withProfileAndPassword(new UserName('Perfil PDO'), new AvatarKey('felipa-seria'), new Biography('Guardado'), $pdoNewHash));
profileExpect($saved->name->value === 'Perfil PDO' && $saved->avatarKey?->value === 'felipa-seria' && $saved->biography->value === 'Guardado', 'PDO no guardó o hidrató el perfil completo.');
$row = $pdo->query('SELECT name, avatar_key, biography, password_hash FROM users WHERE id = 1')->fetch();
profileExpect($row['name'] === 'Perfil PDO' && $row['avatar_key'] === 'felipa-seria' && $row['biography'] === 'Guardado', 'La fila PDO no refleja el agregado actualizado.');
profileExpect(password_verify('pdo contraseña nueva', $row['password_hash']) && !password_verify('pdo anterior', $row['password_hash']), 'PDO no persistió el nuevo hash en la misma actualización.');

echo "IdentityAccess profile tests: OK\n";
