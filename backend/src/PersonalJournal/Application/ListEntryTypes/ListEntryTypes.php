<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\ListEntryTypes;

use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;

final readonly class ListEntryTypes
{
    public function __construct(private EntryTypeRepository $types) {}

    public function execute(): array
    {
        return array_map(static fn ($type) => [
            'id' => $type->id,
            'slug' => $type->slug,
            'name' => $type->name,
            'icon' => $type->icon,
            'fields' => array_map(static fn ($field) => [
                'key' => $field['field_key'],
                'label' => $field['label'],
                'inputType' => $field['input_type'],
                'required' => (bool) $field['is_required'],
                'options' => $field['options_json'] ? json_decode($field['options_json'], true) : [],
            ], $type->fields),
        ], $this->types->active());
    }
}
