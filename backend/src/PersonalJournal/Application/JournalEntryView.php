<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application;

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;

final readonly class JournalEntryView
{
    public static function from(JournalEntry $entry, ?EntryType $type): array
    {
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
    }
}