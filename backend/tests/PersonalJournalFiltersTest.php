<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/ValueObject/FeelingScore.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/ValueObject/EntryFilters.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/Entity/JournalEntry.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/Repository/JournalEntryRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Entity/EntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Repository/EntryTypeRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/JournalEntryView.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/ListEntries/ListEntries.php';
require_once __DIR__ . '/../src/PersonalJournal/Infrastructure/Persistence/JournalEntryQueryBuilder.php';

use App\PersonalJournal\Application\ListEntries\ListEntries;
use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use App\PersonalJournal\Domain\JournalEntry\ValueObject\EntryFilters;
use App\PersonalJournal\Infrastructure\Persistence\JournalEntryQueryBuilder;

final class FakeListRepository implements JournalEntryRepository
{
    public function save(JournalEntry $entry): JournalEntry { return $entry; }
    public function update(JournalEntry $entry): JournalEntry { return $entry; }
    public function delete(int $id, int $userId): bool { return true; }
    public function byIdForUser(int $id, int $userId): ?JournalEntry { return null; }
    public function byPage(int $userId, EntryFilters $filters, int $limit, int $offset): array { return []; }
    public function countByUser(int $userId, EntryFilters $filters): int { return 0; }
    public function summaryForUser(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array { return ['total' => 0, 'average' => 0.0, 'min' => 0, 'max' => 0]; }
    public function breakdownByType(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array { return []; }
    public function trendForPeriod(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array { return []; }
    public function periodForComparison(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array { return ['total' => 0, 'average' => 0.0]; }
}

final class FakeTypeRepository implements EntryTypeRepository
{
    public function __construct(private EntryType $type) {}
    public function active(): array { return [$this->type]; }
    public function bySlug(string $slug): ?EntryType { return $slug === $this->type->slug ? $this->type : null; }
    public function byId(int $id): ?EntryType { return $id === $this->type->id ? $this->type : null; }
}

function expectInvalid(callable $fn): void
{
    try {
        $fn();
        throw new RuntimeException('Se esperaba InvalidArgumentException.');
    } catch (InvalidArgumentException) {}
}

$type = new EntryType(1, 'entrenamiento', 'Entrenamiento', 'icono', []);
$repo = new FakeListRepository();
$types = new FakeTypeRepository($type);
$list = new ListEntries($repo, $types);

// Sin filtros: paginación válida
$result = $list->execute(1, 1, 30, []);
assert($result['pagination']['page'] === 1);
assert($result['pagination']['limit'] === 30);

// Validación de page/limit
expectInvalid(fn () => $list->execute(1, 0, 30));
expectInvalid(fn () => $list->execute(1, 1, 101));
expectInvalid(fn () => $list->execute(1, 1, 0));

// from > to -> error
expectInvalid(fn () => $list->execute(1, 1, 30, ['from' => '2026-08-12', 'to' => '2026-08-01']));
// fechas mal formadas
expectInvalid(fn () => $list->execute(1, 1, 30, ['from' => '12/08/2026']));
expectInvalid(fn () => $list->execute(1, 1, 30, ['from' => '2026-13-01']));

// minScore > maxScore -> error
expectInvalid(fn () => $list->execute(1, 1, 30, ['minScore' => 8, 'maxScore' => 3]));
// scores fuera de rango
expectInvalid(fn () => $list->execute(1, 1, 30, ['minScore' => 0]));
expectInvalid(fn () => $list->execute(1, 1, 30, ['maxScore' => 11]));

// tipo inexistente -> error
expectInvalid(fn () => $list->execute(1, 1, 30, ['type' => 'noexiste']));
// tipo válido
$list->execute(1, 1, 30, ['type' => 'entrenamiento']);

// search demasiado largo
expectInvalid(fn () => $list->execute(1, 1, 30, ['search' => str_repeat('a', 121)]));
$list->execute(1, 1, 30, ['search' => '  gimnasio  ']);

// Combinación de filtros válida
$list->execute(1, 1, 30, ['type' => 'entrenamiento', 'from' => '2026-08-01', 'to' => '2026-08-12', 'minScore' => 5, 'maxScore' => 10, 'search' => 'gimnasio']);

// --- JournalEntryQueryBuilder: WHERE dinámico seguro y filtrado correcto ---
$builder = new JournalEntryQueryBuilder();

// Sin filtros: solo user_id
$plain = $builder->build(7, EntryFilters::none());
assert($plain['sql'] === 'WHERE je.user_id = ?');
assert($plain['params'] === [7]);

// Todos los filtros a la vez
$filters = new EntryFilters('entrenamiento', new DateTimeImmutable('2026-08-01'), new DateTimeImmutable('2026-08-12'), 5, 8, 'gimnasio');
$full = $builder->build(7, $filters);
assert(count($full['params']) === 8);
assert(str_contains($full['sql'], 'je.user_id = ?'));
assert(str_contains($full['sql'], 'et.slug = ?'));
assert(str_contains($full['sql'], 'je.occurred_at >= ?'));
assert(str_contains($full['sql'], 'je.occurred_at <= ?'));
assert(str_contains($full['sql'], 'je.feeling_score >= ?'));
assert(str_contains($full['sql'], 'je.feeling_score <= ?'));
assert(str_contains($full['sql'], 'je.title LIKE ? OR je.notes LIKE ?'));

// Escapado de wildcards en búsqueda
$search = $builder->build(1, new EntryFilters(null, null, null, null, null, '100%_llegue'));
assert($search['params'][1] === '%100\%\_llegue%');

echo "PersonalJournal filters tests: OK\n";
