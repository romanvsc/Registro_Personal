<?php
declare(strict_types=1);
namespace App\IdentityAccess\Domain\User\Exception;
use DomainException;
final class EmailAlreadyExists extends DomainException
{
    public const ERROR_CODE = 'EMAIL_ALREADY_EXISTS';
    public function __construct() { parent::__construct('Ya existe una cuenta asociada a este correo.'); }
}
