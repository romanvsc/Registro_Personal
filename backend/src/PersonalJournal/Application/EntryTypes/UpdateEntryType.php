<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\EntryTypes;

use App\PersonalJournal\Application\ConflictException;
use App\PersonalJournal\Application\EntryNotFoundException;
use App\PersonalJournal\Application\EntryTypeView;
use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;

final readonly class UpdateEntryType
{
    public function __construct(private EntryTypeRepository $types) {}

    public function execute(int $userId, int $id, array $input): array
    {
        $current = $this->types->byId($id, $userId);
        if ($current === null) {
            throw new EntryNotFoundException('Tipo de registro no encontrado.');
        }

        $name = EntryType::validateName((string) ($input['name'] ?? $current->name));
        $slug = EntryType::validateSlug((string) ($input['slug'] ?? $current->slug));
        $icon = (string) ($input['icon'] ?? $current->icon);
        EntryType::validateIcon($icon);
        $sortOrder = (int) ($input['sortOrder'] ?? $current->sortOrder);
        EntryType::validateSortOrder($sortOrder);
        $fields = array_key_exists('fields', $input)
            ? EntryType::normalizeFields(is_array($input['fields']) ? $input['fields'] : [])
            : $current->fields;

        if ($this->types->slugExists($slug, $id, $userId)) {
            throw new ConflictException("Ya existe un tipo con el slug \"{$slug}\".");
        }

        $updated = new EntryType($id, $slug, $name, $icon, $fields, $current->isActive, $sortOrder, $userId);
        if (array_key_exists('active', $input)) {
            $updated = $updated->withActive((bool) $input['active']);
        }
        $saved = $this->types->save($updated);

        return ['type' => EntryTypeView::from($saved)];
    }
}