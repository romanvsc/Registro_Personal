<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\JournalEntry\Repository;

use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;

interface JournalEntryRepository
{
    public function save(JournalEntry $entry): JournalEntry;
    /** @return JournalEntry[] */
    public function byUser(int $userId): array;
}
