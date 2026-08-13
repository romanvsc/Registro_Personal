<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\DeleteEntry;

use App\PersonalJournal\Application\EntryNotFoundException;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;

final readonly class DeleteEntry
{
    public function __construct(private JournalEntryRepository $entries) {}

    public function execute(int $userId, int $id): array
    {
        if (!$this->entries->delete($id, $userId)) {
            throw new EntryNotFoundException('Registro no encontrado.');
        }
        return ['status' => 'ok'];
    }
}