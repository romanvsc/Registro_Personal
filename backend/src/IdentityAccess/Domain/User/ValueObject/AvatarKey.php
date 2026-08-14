<?php
declare(strict_types=1);

namespace App\IdentityAccess\Domain\User\ValueObject;

use InvalidArgumentException;

final readonly class AvatarKey
{
    public const ALLOWED = [
        'dorito-feliz',
        'dorito-guino',
        'dorito-notas',
        'dorito-amor',
        'felicia-atenta',
        'felicia-dormida',
        'felicia-saludo',
        'felipa-seria',
        'felipa-candado',
        'felipa-entrenamiento',
    ];

    public string $value;

    public function __construct(string $value)
    {
        $normalized = trim($value);
        if (!in_array($normalized, self::ALLOWED, true)) {
            throw new InvalidArgumentException('Elegí un avatar válido.');
        }
        $this->value = $normalized;
    }

    public static function nullable(?string $value): ?self
    {
        if ($value === null || trim($value) === '') return null;
        return new self($value);
    }
}
