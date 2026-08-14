<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\UpdateProfile;

use DomainException;

final class ProfileValidationException extends DomainException
{
    public const ERROR_CODE = 'PROFILE_VALIDATION_ERROR';
}
