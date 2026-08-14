<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\ResetPassword;
use InvalidArgumentException;
final class InvalidResetToken extends InvalidArgumentException
{
    public const ERROR_CODE = 'INVALID_RESET_TOKEN';
    public function __construct() { parent::__construct('El enlace de recuperación no es válido o ha expirado.'); }
}
