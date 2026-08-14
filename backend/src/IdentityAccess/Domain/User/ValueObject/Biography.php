<?php
declare(strict_types=1);

namespace App\IdentityAccess\Domain\User\ValueObject;

use InvalidArgumentException;

final readonly class Biography
{
    public string $value;

    public function __construct(string $value)
    {
        $normalized = trim($value);
        $length = function_exists('mb_strlen') ? mb_strlen($normalized) : strlen($normalized);
        if ($length > 500) throw new InvalidArgumentException('La biografía no puede superar los 500 caracteres.');
        $this->value = $normalized;
    }
}
