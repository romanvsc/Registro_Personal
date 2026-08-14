<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\Register;
use InvalidArgumentException;
final class RegistrationValidationException extends InvalidArgumentException
{
    public const ERROR_CODE = 'REGISTRATION_VALIDATION_ERROR';
}
