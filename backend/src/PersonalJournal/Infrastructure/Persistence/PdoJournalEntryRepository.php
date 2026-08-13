<?php
declare(strict_types=1);

namespace App\PersonalJournal\Infrastructure\Persistence;

use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use App\PersonalJournal\Domain\JournalEntry\ValueObject\EntryFilters;
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

    public function update(JournalEntry $entry): JournalEntry
    {
        $stmt = $this->pdo->prepare('UPDATE journal_entries SET entry_type_id = ?, title = ?, notes = ?, feeling_score = ?, values_json = ?, occurred_at = ? WHERE id = ? AND user_id = ?');
        $stmt->execute([
            $entry->typeId,
            $entry->title,
            $entry->notes,
            $entry->feelingScore->value,
            json_encode($entry->values, JSON_UNESCAPED_UNICODE),
            $entry->occurredAt->format('Y-m-d H:i:s'),
            $entry->id,
            $entry->userId,
        ]);
        return $entry;
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM journal_entries WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function byIdForUser(int $id, int $userId): ?JournalEntry
    {
        $stmt = $this->pdo->prepare('SELECT * FROM journal_entries WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $row = $stmt->fetch();
        return $row ? $this->mapRow($row) : null;
    }

    public function byPage(int $userId, EntryFilters $filters, int $limit, int $offset): array
    {
        $builder = new JournalEntryQueryBuilder();
        $query = $builder->build($userId, $filters);
        $stmt = $this->pdo->prepare("SELECT je.* FROM journal_entries je JOIN entry_types et ON et.id = je.entry_type_id {$query['sql']} ORDER BY occurred_at DESC, id DESC LIMIT ? OFFSET ?");
        $params = $query['params'];
        $index = 1;
        foreach ($params as $param) {
            $stmt->bindValue($index++, $param);
        }
        $stmt->bindValue($index++, $limit, PDO::PARAM_INT);
        $stmt->bindValue($index, $offset, PDO::PARAM_INT);
        $stmt->execute();
        return array_map(fn (array $row) => $this->mapRow($row), $stmt->fetchAll());
    }

    public function countByUser(int $userId, EntryFilters $filters): int
    {
        $builder = new JournalEntryQueryBuilder();
        $query = $builder->build($userId, $filters);
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM journal_entries je JOIN entry_types et ON et.id = je.entry_type_id {$query['sql']}");
        $stmt->execute($query['params']);
        return (int) $stmt->fetchColumn();
    }

    public function countByUserAndType(int $userId, int $typeId): int
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM journal_entries WHERE user_id = ? AND entry_type_id = ?');
        $stmt->execute([$userId, $typeId]);
        return (int) $stmt->fetchColumn();
    }

    public function summaryForUser(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array
    {
        [$where, $params] = $this->userRangeWhere($userId, $from, $to);
        $stmt = $this->pdo->prepare("SELECT COUNT(*) AS total, AVG(feeling_score) AS average, COALESCE(MIN(feeling_score), 0) AS min, COALESCE(MAX(feeling_score), 0) AS max FROM journal_entries {$where}");
        $stmt->execute($params);
        $row = $stmt->fetch();
        return [
            'total' => (int) $row['total'],
            'average' => round((float) $row['average'], 1),
            'min' => (int) $row['min'],
            'max' => (int) $row['max'],
        ];
    }

    public function breakdownByType(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array
    {
        [$where, $params] = $this->userRangeWhere($userId, $from, $to);
        $stmt = $this->pdo->prepare(
            "SELECT et.slug, et.name, COUNT(je.id) AS total, AVG(je.feeling_score) AS average
             FROM journal_entries je
             JOIN entry_types et ON et.id = je.entry_type_id
             {$where}
             GROUP BY et.id, et.slug, et.name
             ORDER BY total DESC, et.name ASC"
        );
        $stmt->execute($params);
        return array_map(static fn (array $row) => [
            'slug' => $row['slug'],
            'name' => $row['name'],
            'count' => (int) $row['total'],
            'averageScore' => round((float) $row['average'], 1),
        ], $stmt->fetchAll());
    }

    public function trendForPeriod(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array
    {
        $stmt = $this->pdo->prepare(
            "SELECT DATE(occurred_at) AS date, COUNT(*) AS total, AVG(feeling_score) AS average
             FROM journal_entries
             WHERE user_id = ? AND occurred_at >= ? AND occurred_at <= ?
             GROUP BY DATE(occurred_at)
             ORDER BY date ASC"
        );
        $stmt->execute([
            $userId,
            $from->format('Y-m-d 00:00:00'),
            $to->format('Y-m-d 23:59:59'),
        ]);
        return array_map(static fn (array $row) => [
            'date' => $row['date'],
            'count' => (int) $row['total'],
            'averageScore' => round((float) $row['average'], 1),
        ], $stmt->fetchAll());
    }

    public function periodForComparison(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array
    {
        [$where, $params] = $this->userRangeWhere($userId, $from, $to);
        $stmt = $this->pdo->prepare("SELECT COUNT(*) AS total, AVG(feeling_score) AS average FROM journal_entries {$where}");
        $stmt->execute($params);
        $row = $stmt->fetch();
        return [
            'total' => (int) $row['total'],
            'average' => round((float) $row['average'], 1),
        ];
    }

    /** @return array{0: string, 1: array<int, string>} */
    private function userRangeWhere(int $userId, ?DateTimeImmutable $from, ?DateTimeImmutable $to): array
    {
        $where = 'WHERE user_id = ?';
        $params = [$userId];
        if ($from !== null) {
            $where .= ' AND occurred_at >= ?';
            $params[] = $from->format('Y-m-d 00:00:00');
        }
        if ($to !== null) {
            $where .= ' AND occurred_at <= ?';
            $params[] = $to->format('Y-m-d 23:59:59');
        }
        return [$where, $params];
    }

    private function mapRow(array $row): JournalEntry
    {
        return JournalEntry::reconstitute(
            (int) $row['id'],
            (int) $row['user_id'],
            (int) $row['entry_type_id'],
            $row['title'],
            $row['notes'],
            (int) $row['feeling_score'],
            json_decode($row['values_json'] ?: '{}', true),
            new DateTimeImmutable($row['occurred_at']),
        );
    }
}