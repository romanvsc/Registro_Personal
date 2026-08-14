<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/IdentityAccess/Domain/User/ValueObject/Email.php';
require_once __DIR__ . '/../src/IdentityAccess/Domain/User/ValueObject/UserName.php';
require_once __DIR__ . '/../src/IdentityAccess/Domain/User/ValueObject/AvatarKey.php';
require_once __DIR__ . '/../src/IdentityAccess/Domain/User/ValueObject/Biography.php';
require_once __DIR__ . '/../src/IdentityAccess/Domain/User/Entity/User.php';

use App\IdentityAccess\Domain\User\Entity\User;
use App\IdentityAccess\Domain\User\ValueObject\Email;

$email = new Email('  DEMO@Registro.Local ');
assert($email->value === 'demo@registro.local');
$user = new User(1, 'Demo', $email, 'hash', true);
$user->ensureCanAuthenticate();

try {
    new Email('no-es-email');
    throw new RuntimeException('Email inválido aceptado.');
} catch (InvalidArgumentException) {}

try {
    (new User(2, 'Inactivo', $email, 'hash', false))->ensureCanAuthenticate();
    throw new RuntimeException('Usuario inactivo autenticado.');
} catch (DomainException) {}

echo "IdentityAccess domain tests: OK\n";
