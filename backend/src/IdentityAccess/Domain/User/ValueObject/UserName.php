<?php
declare(strict_types=1);

namespace App\IdentityAccess\Domain\User\ValueObject;

use InvalidArgumentException;

final readonly class UserName
{
    public string $value;

    public function __construct(string $value)
    {
        $normalized = trim($value);
        $length = function_exists('mb_strlen') ? mb_strlen($normalized) : strlen($normalized);
        if ($normalized === '') throw new InvalidArgumentException('El nombre es obligatorio.');
        if ($length > 120) throw new InvalidArgumentException('El nombre no puede superar los 120 caracteres.');
        $this->value = $normalized;
    }
}
