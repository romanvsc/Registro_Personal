<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\EntryTypes;

use App\PersonalJournal\Application\ConflictException;
use App\PersonalJournal\Application\EntryTypeView;
use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use InvalidArgumentException;

final readonly class CreateEntryType
{
    public function __construct(private EntryTypeRepository $types) {}

    public function execute(int $userId, array $input): array
    {
        $name = EntryType::validateName((string) ($input['name'] ?? ''));
        $slug = $this->resolveSlug($input, $name);
        $icon = (string) ($input['icon'] ?? '');
        EntryType::validateIcon($icon);
        $sortOrder = (int) ($input['sortOrder'] ?? 0);
        EntryType::validateSortOrder($sortOrder);
        $fields = EntryType::normalizeFields(is_array($input['fields'] ?? null) ? $input['fields'] : []);

        if ($this->types->slugExists($slug, 0, $userId)) {
            throw new ConflictException("Ya existe un tipo con el slug \"{$slug}\".");
        }

        $type = EntryType::create($userId, $slug, $name, $icon, $fields, true, $sortOrder);
        $saved = $this->types->save($type);

        return ['type' => EntryTypeView::from($saved)];
    }

    private function resolveSlug(array $input, string $name): string
    {
        $candidate = $input['slug'] ?? null;
        if ($candidate === null || trim((string) $candidate) === '') {
            $candidate = EntryType::slugify($name);
            if ($candidate === '') {
                throw new InvalidArgumentException('No se pudo generar un slug a partir del nombre.');
            }
        }
        return EntryType::validateSlug((string) $candidate);
    }
}