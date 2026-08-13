<?php
declare(strict_types=1);

namespace App\PersonalJournal\Infrastructure\Persistence;

use App\PersonalJournal\Domain\JournalEntry\ValueObject\EntryFilters;

/**
 * Helper mínimo de construcción de condiciones del historial.
 * Sólo arma el WHERE y sus parámetros (prepared); la paginación y el ORDER BY los decide el repositorio.
 */
final readonly class JournalEntryQueryBuilder
{
    /**
     * @return array{sql: string, params: array<int, mixed>}
     */
    public function build(int $userId, EntryFilters $filters): array
    {
        $sql = 'WHERE je.user_id = ?';
        $params = [$userId];

        if ($filters->type !== null) {
            $sql .= ' AND et.slug = ?';
            $params[] = $filters->type;
        }
        if ($filters->from !== null) {
            $sql .= ' AND je.occurred_at >= ?';
            $params[] = $filters->from->format('Y-m-d 00:00:00');
        }
        if ($filters->to !== null) {
            $sql .= ' AND je.occurred_at <= ?';
            $params[] = $filters->to->format('Y-m-d 23:59:59');
        }
        if ($filters->minScore !== null) {
            $sql .= ' AND je.feeling_score >= ?';
            $params[] = $filters->minScore;
        }
        if ($filters->maxScore !== null) {
            $sql .= ' AND je.feeling_score <= ?';
            $params[] = $filters->maxScore;
        }
        if ($filters->search !== null) {
            $sql .= ' AND (je.title LIKE ? OR je.notes LIKE ?)';
            $like = '%' . $this->escapeLike($filters->search) . '%';
            $params[] = $like;
            $params[] = $like;
        }

        return ['sql' => $sql, 'params' => $params];
    }

    private function escapeLike(string $value): string
    {
        return strtr($value, ['\\' => '\\\\', '%' => '\%', '_' => '\_']);
    }
}