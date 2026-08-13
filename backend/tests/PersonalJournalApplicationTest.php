<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/ValueObject/FeelingScore.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/ValueObject/EntryFilters.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/Entity/JournalEntry.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/Repository/JournalEntryRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Entity/EntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Repository/EntryTypeRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/JournalEntryView.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/EntryNotFoundException.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/GetEntry/GetEntry.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/UpdateEntry/UpdateEntry.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/DeleteEntry/DeleteEntry.php';

use App\PersonalJournal\Application\DeleteEntry\DeleteEntry;
use App\PersonalJournal\Application\EntryNotFoundException;
use App\PersonalJournal\Application\GetEntry\GetEntry;
use App\PersonalJournal\Application\UpdateEntry\UpdateEntry;
use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use App\PersonalJournal\Domain\JournalEntry\ValueObject\EntryFilters;

final class InMemoryJournalRepository implements JournalEntryRepository
{
    /** @var array<int, array{id: int, userId: int, typeId: int, entry: JournalEntry}> */
    private array $rows = [];
    private int $nextId = 1;

    public function seed(JournalEntry $entry): self
    {
        $id = $entry->id ?? $this->nextId++;
        $withId = JournalEntry::reconstitute($id, $entry->userId, $entry->typeId, $entry->title, $entry->notes, $entry->feelingScore->value, $entry->values, $entry->occurredAt);
        $this->rows[$id] = ['id' => $id, 'userId' => $withId->userId, 'typeId' => $withId->typeId, 'entry' => $withId];
        return $this;
    }

    public function save(JournalEntry $entry): JournalEntry
    {
        return $this->seed($entry)->get($this->nextId - 1, $entry->userId);
    }

    public function update(JournalEntry $entry): JournalEntry
    {
        if (!isset($this->rows[$entry->id]) || $this->rows[$entry->id]['userId'] !== $entry->userId) {
            throw new EntryNotFoundException('Registro no encontrado.');
        }
        $this->rows[$entry->id]['entry'] = $entry;
        return $entry;
    }

    public function delete(int $id, int $userId): bool
    {
        if (!isset($this->rows[$id]) || $this->rows[$id]['userId'] !== $userId) return false;
        unset($this->rows[$id]);
        return true;
    }

    public function byIdForUser(int $id, int $userId): ?JournalEntry
    {
        $row = $this->rows[$id] ?? null;
        return $row !== null && $row['userId'] === $userId ? $row['entry'] : null;
    }

    public function byPage(int $userId, EntryFilters $filters, int $limit, int $offset): array
    {
        $items = array_values(array_filter(
            array_map(static fn (array $row) => $row['entry'], $this->rows),
            fn (JournalEntry $entry) => $entry->userId === $userId
        ));
        usort($items, static fn (JournalEntry $a, JournalEntry $b) => $b->occurredAt <=> $a->occurredAt);
        return array_slice($items, $offset, $limit);
    }

    public function countByUser(int $userId, EntryFilters $filters): int
    {
        return count(array_filter($this->rows, static fn (array $row) => $row['userId'] === $userId));
    }

    public function summaryForUser(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array
    {
        $rows = $this->entriesOf($userId, $from, $to);
        if (!$rows) return ['total' => 0, 'average' => 0.0, 'min' => 0, 'max' => 0];
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
        foreach ($this->entriesOf($userId, $from, $to) as $entry) {
            $byType[$entry->typeId]['total'] = ($byType[$entry->typeId]['total'] ?? 0) + 1;
            $byType[$entry->typeId]['sum'] = ($byType[$entry->typeId]['sum'] ?? 0) + $entry->feelingScore->value;
        }
        $result = [];
        foreach ($byType as $typeId => $data) {
            $result[] = [
                'slug' => "type{$typeId}",
                'name' => "Tipo {$typeId}",
                'count' => $data['total'],
                'averageScore' => round($data['sum'] / $data['total'], 1),
            ];
        }
        return $result;
    }

    public function trendForPeriod(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array
    {
        $byDate = [];
        foreach ($this->entriesOf($userId, null, null) as $entry) {
            $date = $entry->occurredAt->format('Y-m-d');
            if ($date < $from->format('Y-m-d') || $date > $to->format('Y-m-d')) continue;
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
        $rows = [];
        foreach ($this->rows as $row) {
            $entry = $row['entry'];
            if ($entry->userId !== $userId) continue;
            $date = $entry->occurredAt->format('Y-m-d');
            if ($date < $from->format('Y-m-d') || $date > $to->format('Y-m-d')) continue;
            $rows[] = $entry;
        }
        if (!$rows) return ['total' => 0, 'average' => 0.0];
        $values = array_map(static fn (JournalEntry $e) => $e->feelingScore->value, $rows);
        return ['total' => count($values), 'average' => round(array_sum($values) / count($values), 1)];
    }

    /** @return JournalEntry[] */
    private function entriesOf(int $userId, ?DateTimeImmutable $from, ?DateTimeImmutable $to): array
    {
        $entries = [];
        foreach ($this->rows as $row) {
            $entry = $row['entry'];
            if ($entry->userId !== $userId) continue;
            $date = $entry->occurredAt->format('Y-m-d');
            if ($from !== null && $date < $from->format('Y-m-d')) continue;
            if ($to !== null && $date > $to->format('Y-m-d')) continue;
            $entries[] = $entry;
        }
        return $entries;
    }

    private function get(int $id, int $userId): JournalEntry
    {
        $entry = $this->byIdForUser($id, $userId);
        if ($entry === null) throw new EntryNotFoundException('Registro no encontrado.');
        return $entry;
    }
}

final class InMemoryEntryTypeRepository implements EntryTypeRepository
{
    /** @var EntryType[] */
    private array $byId = [];
    /** @var EntryType[] */
    private array $bySlug = [];

    public function __construct(array $types)
    {
        foreach ($types as $type) {
            $this->byId[$type->id] = $type;
            $this->bySlug[$type->slug] = $type;
        }
    }

    public function active(): array { return array_values($this->byId); }
    public function bySlug(string $slug): ?EntryType { return $this->bySlug[$slug] ?? null; }
    public function byId(int $id): ?EntryType { return $this->byId[$id] ?? null; }
}

function type(string $slug, string $name, array $fields = []): EntryType
{
    static $nextId = 1;
    return new EntryType($nextId++, $slug, $name, 'icono', $fields);
}

function expectEntryNotFound(callable $fn): void
{
    try {
        $fn();
        throw new RuntimeException('Se esperaba EntryNotFoundException.');
    } catch (EntryNotFoundException) {}
}

function field(string $key, string $label, string $inputType, int $required = 0): array
{
    return ['field_key' => $key, 'label' => $label, 'input_type' => $inputType, 'is_required' => $required, 'options_json' => null];
}

$workout = type('entrenamiento', 'Entrenamiento', [field('duracion', 'Duración', 'number')]);
$types = new InMemoryEntryTypeRepository([$workout]);

$owned = JournalEntry::reconstitute(10, 1, $workout->id, 'Mi sesión', 'Nota', 7, ['duracion' => 30], new DateTimeImmutable('2026-08-10 10:00:00'));
$foreign = JournalEntry::reconstitute(20, 2, $workout->id, 'Registro ajeno', null, 9, [], new DateTimeImmutable('2026-08-10 11:00:00'));

$repo = (new InMemoryJournalRepository())->seed($owned)->seed($foreign);

$get = new GetEntry($repo, $types);
assert($get->execute(1, 10)['entry']['title'] === 'Mi sesión');
expectEntryNotFound(fn () => $get->execute(1, 20)); // ajeno -> 404
expectEntryNotFound(fn () => $get->execute(1, 999)); // inexistente -> 404

$update = new UpdateEntry($repo, $types);
$updated = $update->execute(1, 10, ['type' => 'entrenamiento', 'title' => 'Sesión editada', 'notes' => 'Nueva nota', 'score' => 8, 'values' => ['duracion' => 45], 'occurredAt' => '2026-08-11T08:30:00']);
assert($updated['entry']['title'] === 'Sesión editada');
assert($updated['entry']['score'] === 8);
assert($updated['entry']['values']['duracion'] === 45);
$persisted = $repo->byIdForUser(10, 1);
assert($persisted !== null && $persisted->occurredAt->format('Y-m-d H:i:s') === '2026-08-11 08:30:00');
assert($persisted->userId === 1);

expectEntryNotFound(fn () => $update->execute(1, 20, ['type' => 'entrenamiento', 'title' => 'Hack', 'score' => 5])); // editar ajeno -> 404

$delete = new DeleteEntry($repo);
assert($delete->execute(1, 10)['status'] === 'ok');
assert($repo->byIdForUser(10, 1) === null);
expectEntryNotFound(fn () => $delete->execute(1, 20)); // eliminar ajeno -> 404
expectEntryNotFound(fn () => $delete->execute(1, 999)); // inexistente -> 404

echo "PersonalJournal application tests: OK\n";
