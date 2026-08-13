<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\JournalEntry\Repository;

use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;
use App\PersonalJournal\Domain\JournalEntry\ValueObject\EntryFilters;
use DateTimeImmutable;

interface JournalEntryRepository
{
    public function save(JournalEntry $entry): JournalEntry;

    public function update(JournalEntry $entry): JournalEntry;

    public function delete(int $id, int $userId): bool;

    public function byIdForUser(int $id, int $userId): ?JournalEntry;

    /** @return JournalEntry[] */
    public function byPage(int $userId, EntryFilters $filters, int $limit, int $offset): array;

    public function countByUser(int $userId, EntryFilters $filters): int;

    public function countByUserAndType(int $userId, int $typeId): int;

    /** @return array{total: int, average: float, min: int, max: int} */
    public function summaryForUser(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array;

    /** @return array<int, array{slug: string, name: string, total: int, average: float}> */
    public function breakdownByType(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array;

    /** @return array<int, array{date: string, total: int, average: float}> */
    public function trendForPeriod(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array;

    /** @return array{total: int, average: float} */
    public function periodForComparison(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array;
}