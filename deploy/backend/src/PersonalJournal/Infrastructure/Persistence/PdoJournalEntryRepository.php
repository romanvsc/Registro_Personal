<?php
declare(strict_types=1);

namespace App\PersonalJournal\Infrastructure\Persistence;

use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use DateTimeImmutable;
use PDO;

final readonly class PdoJournalEntryRepository implements JournalEntryRepository
{
    public function __construct(private PDO $pdo) {}

    public function save(JournalEntry $entry): JournalEntry
    {
        $stmt = $this->pdo->prepare('INSERT INTO journal_entries (user_id, entry_type_id, title, notes, feeling_score, values_json, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$entry->userId, $entry->typeId, $entry->title, $entry->notes, $entry->feelingScore->value, json_encode($entry->values, JSON_UNESCAPED_UNICODE), $entry->occurredAt->format('Y-m-d H:i:s')]);
        return JournalEntry::reconstitute((int) $this->pdo->lastInsertId(), $entry->userId, $entry->typeId, $entry->title, $entry->notes, $entry->feelingScore->value, $entry->values, $entry->occurredAt);
    }

    public function byUser(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM journal_entries WHERE user_id = ? ORDER BY occurred_at DESC, id DESC');
        $stmt->execute([$userId]);
        return array_map(static fn (array $row) => JournalEntry::reconstitute(
            (int) $row['id'], (int) $row['user_id'], (int) $row['entry_type_id'], $row['title'], $row['notes'],
            (int) $row['feeling_score'], json_decode($row['values_json'] ?: '{}', true), new DateTimeImmutable($row['occurred_at'])
        ), $stmt->fetchAll());
    }
}
