<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\EntryType\Entity;

use InvalidArgumentException;

final readonly class EntryType
{
    public function __construct(
        public int $id,
        public string $slug,
        public string $name,
        public string $icon,
        public array $fields,
    ) {}

    public function validateValues(array $values): array
    {
        $validated = [];
        foreach ($this->fields as $field) {
            $key = $field['field_key'];
            $value = $values[$key] ?? null;
            if ((bool) $field['is_required'] && ($value === null || $value === '')) {
                throw new InvalidArgumentException("El campo {$field['label']} es obligatorio.");
            }
            if ($value !== null && $value !== '') $validated[$key] = $value;
        }
        return $validated;
    }
}
