<?php
declare(strict_types=1);

namespace App\IdentityAccess\Domain\User\ValueObject;

use InvalidArgumentException;

final readonly class Email
{
    public string $value;

    public function __construct(string $value)
    {
        $normalized = strtolower(trim($value));
        if (!filter_var($normalized, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('El email no es válido.');
        }
        $this->value = $normalized;
    }
}
