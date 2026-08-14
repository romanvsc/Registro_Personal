<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\EntryType\Service;

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use InvalidArgumentException;

final readonly class InitialEntryTypes
{
    /** @return list<EntryType> */
    public static function forUser(int $userId): array
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('El identificador del usuario debe ser positivo.');
        }

        return [
            self::type($userId, 'comida', 'Comida', 'comidas', 10, [
                ['fieldKey' => 'descripcion', 'label' => '¿Qué comiste?', 'inputType' => 'textarea'],
            ]),
            self::type($userId, 'entrenamiento', 'Entrenamiento', 'entrenamientos', 20, [
                ['fieldKey' => 'duracion', 'label' => 'Duración en minutos', 'inputType' => 'number'],
            ]),
            self::type($userId, 'animo', 'Estado de ánimo', 'estado-animo', 30, [
                ['fieldKey' => 'contexto', 'label' => '¿Qué influyó en tu ánimo?', 'inputType' => 'textarea'],
            ]),
        ];
    }

    /** @param array<int, array<string, mixed>> $fields */
    private static function type(int $userId, string $slug, string $name, string $icon, int $sortOrder, array $fields): EntryType
    {
        return EntryType::create(
            $userId,
            $slug,
            $name,
            $icon,
            EntryType::normalizeFields($fields),
            true,
            $sortOrder,
        );
    }
}
