<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\JournalEntry\Repository;

use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;

interface JournalEntryRepository
{
    public function save(JournalEntry $entry): JournalEntry;

    /** @return JournalEntry[] */
    public function byPage(int $userId, int $limit, int $offset): array;

    public function countByUser(int $userId): int;
}