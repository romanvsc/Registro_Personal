<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application;

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;

/**
 * Presentación de un tipo de registro para el API de administración.
 */
final readonly class EntryTypeView
{
    public static function from(EntryType $type): array
    {
        return [
            'id' => $type->id,
            'slug' => $type->slug,
            'name' => $type->name,
            'icon' => $type->icon,
            'active' => $type->isActive,
            'sortOrder' => $type->sortOrder,
            'fields' => array_map(static fn ($field) => [
                'key' => $field['field_key'],
                'label' => $field['label'],
                'inputType' => $field['input_type'],
                'required' => (bool) $field['is_required'],
                'sortOrder' => (int) $field['sort_order'],
                'options' => $field['options_json'] ? json_decode($field['options_json'], true) : [],
            ], $type->fields),
        ];
    }
}
