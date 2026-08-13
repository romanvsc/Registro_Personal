<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\GetEntry;

use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;

final readonly class GetEntry
{
    public function __construct(
        private JournalEntryRepository $entries,
        private EntryTypeRepository $types,
    ) {}

    public function execute(int $userId, int $id): array
    {
        $entry = $this->entries->byIdForUser($id, $userId);
        if ($entry === null) {
            throw new \App\PersonalJournal\Application\EntryNotFoundException('Registro no encontrado.');
        }
        return [
            'entry' => \App\PersonalJournal\Application\JournalEntryView::from($entry, $this->types->byId($entry->typeId)),
        ];
    }
}