<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\UpdateProfile;

use DomainException;

final class CurrentPasswordInvalid extends DomainException
{
    public const ERROR_CODE = 'CURRENT_PASSWORD_INVALID';

    public function __construct()
    {
        parent::__construct('La contraseña actual es incorrecta.');
    }
}
