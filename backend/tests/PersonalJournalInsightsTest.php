<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/ValueObject/FeelingScore.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/ValueObject/EntryFilters.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/Entity/JournalEntry.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/Repository/JournalEntryRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/Insights/GetSummary/DateRange.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/Insights/GetSummary/GetSummary.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/Insights/GetTrend/GetTrend.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/Insights/GetComparison/GetComparison.php';

use App\PersonalJournal\Application\Insights\GetComparison\GetComparison;
use App\PersonalJournal\Application\Insights\GetSummary\GetSummary;
use App\PersonalJournal\Application\Insights\GetTrend\GetTrend;
use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use App\PersonalJournal\Domain\JournalEntry\ValueObject\EntryFilters;

final class InsightsInMemoryRepository implements JournalEntryRepository
{
    /** @var JournalEntry[] */
    private array $entries = [];

    public function __construct(array $entries) { $this->entries = $entries; }

    public function save(JournalEntry $entry): JournalEntry { return $entry; }
    public function update(JournalEntry $entry): JournalEntry { return $entry; }
    public function delete(int $id, int $userId): bool { return true; }
    public function byIdForUser(int $id, int $userId): ?JournalEntry { return null; }
    public function byPage(int $userId, EntryFilters $filters, int $limit, int $offset): array { return []; }
    public function countByUser(int $userId, EntryFilters $filters): int { return 0; }
    public function countByUserAndType(int $userId, int $typeId): int { return 0; }

    public function summaryForUser(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array
    {
        $rows = $this->own($userId, $from, $to);
        if (!$rows) return ['total' => 0, 'average' => null, 'min' => null, 'max' => null];
        $values = array_map(static fn (JournalEntry $e) => $e->feelingScore->value, $rows);
        return [
            'total' => count($values),
            'average' => round(array_sum($values) / count($values), 1),
            'min' => min($values),
            'max' => max($values),
        ];
    }

    public function breakdownByType(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array
    {
        $byType = [];
        foreach ($this->own($userId, $from, $to) as $entry) {
            $byType[$entry->typeId]['total'] = ($byType[$entry->typeId]['total'] ?? 0) + 1;
            $byType[$entry->typeId]['sum'] = ($byType[$entry->typeId]['sum'] ?? 0) + $entry->feelingScore->value;
        }
        $result = [];
        foreach ($byType as $typeId => $data) {
            $result[] = ['slug' => "type{$typeId}", 'name' => "Tipo {$typeId}", 'count' => $data['total'], 'averageScore' => round($data['sum'] / $data['total'], 1)];
        }
        usort($result, static fn (array $a, array $b) => $b['count'] <=> $a['count']);
        return $result;
    }

    public function trendForPeriod(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array
    {
        $byDate = [];
        foreach ($this->own($userId, $from, $to) as $entry) {
            $date = $entry->occurredAt->format('Y-m-d');
            $byDate[$date]['total'] = ($byDate[$date]['total'] ?? 0) + 1;
            $byDate[$date]['sum'] = ($byDate[$date]['sum'] ?? 0) + $entry->feelingScore->value;
        }
        $result = [];
        foreach ($byDate as $date => $data) {
            $result[] = ['date' => $date, 'count' => $data['total'], 'averageScore' => round($data['sum'] / $data['total'], 1)];
        }
        usort($result, static fn (array $a, array $b) => $a['date'] <=> $b['date']);
        return $result;
    }

    public function periodForComparison(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array
    {
        $rows = $this->own($userId, $from, $to);
        if (!$rows) return ['total' => 0, 'average' => 0.0];
        $values = array_map(static fn (JournalEntry $e) => $e->feelingScore->value, $rows);
        return ['total' => count($values), 'average' => round(array_sum($values) / count($values), 1)];
    }

    /** @return JournalEntry[] */
    private function own(int $userId, ?DateTimeImmutable $from, ?DateTimeImmutable $to): array
    {
        $rows = [];
        foreach ($this->entries as $entry) {
            if ($entry->userId !== $userId) continue;
            $date = $entry->occurredAt->format('Y-m-d');
            if ($from !== null && $date < $from->format('Y-m-d')) continue;
            if ($to !== null && $date > $to->format('Y-m-d')) continue;
            $rows[] = $entry;
        }
        return $rows;
    }
}

function entry(int $userId, int $typeId, int $score, string $date): JournalEntry
{
    return JournalEntry::reconstitute(0, $userId, $typeId, "Título {$userId}", null, $score, [], new DateTimeImmutable($date));
}

// Usuario 1: tres registros, dos tipos, distintos días.
$rows = [
    entry(1, 1, 8, '2026-08-10 10:00:00'),
    entry(1, 1, 6, '2026-08-11 10:00:00'),
    entry(1, 2, 9, '2026-08-11 20:00:00'),
    entry(1, 2, 4, '2026-08-12 09:00:00'),
    // Usuario 2: no debe filtrar en los cálculos del usuario 1
    entry(2, 1, 1, '2026-08-10 10:00:00'),
    entry(2, 2, 2, '2026-08-11 10:00:00'),
];
$repo = new InsightsInMemoryRepository($rows);

// --- Summary ---
$summary = new GetSummary($repo);
$all = $summary->execute(1);
assert($all['totalEntries'] === 4);
assert($all['averageScore'] === 6.8); // (8+6+9+4)/4 = 6.75 -> 6.8
assert($all['highestScore'] === 9);
assert($all['lowestScore'] === 4);
assert(count($all['byType']) === 2);

$empty = $summary->execute(2, '2026-08-12', '2026-08-12');
assert($empty['totalEntries'] === 0);
assert($empty['averageScore'] === null);

$range = $summary->execute(1, '2026-08-10', '2026-08-11');
assert($range['totalEntries'] === 3);
assert($range['averageScore'] === 7.7); // (8+6+9)/3 = 7.67 -> 7.7

// --- Trend ---
$trend = new GetTrend($repo);
$result = $trend->execute(1, '2026-08-10', '2026-08-12');
assert(count($result['items']) === 3);
assert($result['items'][0]['date'] === '2026-08-10');
assert($result['items'][0]['averageScore'] === 8.0);
assert($result['items'][0]['count'] === 1);
assert($result['items'][1]['date'] === '2026-08-11');
assert($result['items'][1]['count'] === 2);
assert($result['items'][1]['averageScore'] === 7.5); // (6+9)/2

// Usuario 2 con días: usa days
$days = $trend->execute(2, null, null, 365);
assert(count($days['items']) === 2);

// --- Comparison ---
$comparison = new GetComparison($repo);
$cmp = $comparison->execute(1, '2026-08-11', '2026-08-12');
assert($cmp['current']['entries'] === 3);
assert($cmp['current']['averageScore'] === 6.3); // (6+9+4)/3 = 6.33 -> 6.3
assert($cmp['previous']['averageScore'] === 8.0); // ventana anterior contiene el 2026-08-10 del user1
assert(abs($cmp['difference']['percentage'] - (-21.25)) < 0.01); // (6.3-8.0)/8.0*100

echo "PersonalJournal insights tests: OK\n";
