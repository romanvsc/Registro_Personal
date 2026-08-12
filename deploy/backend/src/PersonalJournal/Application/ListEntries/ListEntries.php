<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\ListEntries;

use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;

final readonly class ListEntries
{
    public function __construct(private JournalEntryRepository $entries, private EntryTypeRepository $types) {}

    public function execute(int $userId): array
    {
        $types = [];
        foreach ($this->types->active() as $type) $types[$type->id] = $type;

        return array_map(static function ($entry) use ($types): array {
            $type = $types[$entry->typeId] ?? null;
            return [
                'id' => $entry->id,
                'type' => $type?->slug ?? 'desconocido',
                'typeName' => $type?->name ?? 'Registro',
                'icon' => $type?->icon ?? 'nuevo-registro',
                'title' => $entry->title,
                'detail' => $entry->notes,
                'score' => $entry->feelingScore->value,
                'values' => $entry->values,
                'occurredAt' => $entry->occurredAt->format(DATE_ATOM),
                'time' => $entry->occurredAt->format('H:i'),
            ];
        }, $this->entries->byUser($userId));
    }
}
