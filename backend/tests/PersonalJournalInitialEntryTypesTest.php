<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Entity/EntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Repository/EntryTypeRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Service/InitialEntryTypes.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/ProvisionInitialEntryTypes/ProvisionInitialEntryTypesCommand.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/ProvisionInitialEntryTypes/ProvisionInitialEntryTypes.php';
require_once __DIR__ . '/../src/PersonalJournal/Infrastructure/Persistence/PdoEntryTypeRepository.php';

use App\PersonalJournal\Application\ProvisionInitialEntryTypes\ProvisionInitialEntryTypes;
use App\PersonalJournal\Application\ProvisionInitialEntryTypes\ProvisionInitialEntryTypesCommand;
use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Infrastructure\Persistence\PdoEntryTypeRepository;

final class InitialTypesMemoryRepository implements EntryTypeRepository
{
    /** @var array<int, EntryType> */
    private array $rows = [];
    private int $nextId = 1;

    public function active(int $userId): array
    {
        return array_values(array_filter($this->rows, static fn (EntryType $type): bool => $type->userId === $userId && $type->isActive));
    }

    public function all(int $userId): array
    {
        return array_values(array_filter($this->rows, static fn (EntryType $type): bool => $type->userId === $userId));
    }

    public function bySlug(string $slug, int $userId): ?EntryType
    {
        foreach ($this->rows as $type) {
            if ($type->userId === $userId && $type->slug === $slug && $type->isActive) {
                return $type;
            }
        }
        return null;
    }

    public function byId(int $id, int $userId): ?EntryType
    {
        $type = $this->rows[$id] ?? null;
        return $type?->userId === $userId ? $type : null;
    }

    public function save(EntryType $type): EntryType
    {
        $id = $type->id === 0 ? $this->nextId++ : $type->id;
        return $this->rows[$id] = new EntryType(
            $id,
            $type->slug,
            $type->name,
            $type->icon,
            $type->fields,
            $type->isActive,
            $type->sortOrder,
            $type->userId,
        );
    }

    public function deactivate(int $id, int $userId): bool { return false; }
    public function delete(int $id, int $userId): bool { return false; }
    public function slugExists(string $slug, int $excludeId, int $userId): bool { return $this->bySlug($slug, $userId) !== null; }
}

function assertInitialTypes(array $types, int $userId): void
{
    assert(count($types) === 3);
    assert(array_map(static fn (EntryType $type): string => $type->name, $types) === ['Comida', 'Entrenamiento', 'Estado de ánimo']);
    assert(array_map(static fn (EntryType $type): string => $type->slug, $types) === ['comida', 'entrenamiento', 'animo']);

    foreach ($types as $type) {
        assert($type->userId === $userId);
        assert(count($type->fields) === 1);
        assert($type->fields[0]['field_key'] !== '');
    }
}

$memory = new InitialTypesMemoryRepository();
$provision = new ProvisionInitialEntryTypes($memory);
$provision->execute(new ProvisionInitialEntryTypesCommand(41));
$provision->execute(new ProvisionInitialEntryTypesCommand(42));

$userA = $memory->all(41);
$userB = $memory->all(42);
assertInitialTypes($userA, 41);
assertInitialTypes($userB, 42);
assert(array_intersect(
    array_map(static fn (EntryType $type): int => $type->id, $userA),
    array_map(static fn (EntryType $type): int => $type->id, $userB),
) === []);

// El adaptador PDO participa en una transacción externa sin confirmarla por su cuenta.
$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec('CREATE TABLE entry_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_active INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    UNIQUE (user_id, slug)
)');
$pdo->exec('CREATE TABLE entry_type_fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_type_id INTEGER NOT NULL,
    field_key TEXT NOT NULL,
    label TEXT NOT NULL,
    input_type TEXT NOT NULL,
    is_required INTEGER NOT NULL,
    options_json TEXT NULL,
    sort_order INTEGER NOT NULL,
    UNIQUE (entry_type_id, field_key),
    FOREIGN KEY (entry_type_id) REFERENCES entry_types(id) ON DELETE CASCADE
)');

$pdoProvision = new ProvisionInitialEntryTypes(new PdoEntryTypeRepository($pdo));
$pdo->beginTransaction();
$pdoProvision->execute(new ProvisionInitialEntryTypesCommand(77));
assert($pdo->inTransaction());
assert((int) $pdo->query('SELECT COUNT(*) FROM entry_types WHERE user_id = 77')->fetchColumn() === 3);
$pdo->rollBack();
assert((int) $pdo->query('SELECT COUNT(*) FROM entry_types WHERE user_id = 77')->fetchColumn() === 0);

$pdo->beginTransaction();
$pdoProvision->execute(new ProvisionInitialEntryTypesCommand(78));
$pdo->commit();
assert((int) $pdo->query('SELECT COUNT(*) FROM entry_types WHERE user_id = 78')->fetchColumn() === 3);
assert((int) $pdo->query('SELECT COUNT(*) FROM entry_type_fields')->fetchColumn() === 3);

// Una falla intermedia queda en manos de la transacción de onboarding y revierte lo ya creado.
$seed = $pdo->prepare('INSERT INTO entry_types (user_id, slug, name, icon, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
$seed->execute([79, 'entrenamiento', 'Ya existe', 'entrenamientos', 1, 20]);
$pdo->beginTransaction();
try {
    $pdoProvision->execute(new ProvisionInitialEntryTypesCommand(79));
    throw new RuntimeException('Se esperaba una colisión del tipo entrenamiento.');
} catch (PDOException) {
    assert($pdo->inTransaction());
    $pdo->rollBack();
}
assert((int) $pdo->query('SELECT COUNT(*) FROM entry_types WHERE user_id = 79')->fetchColumn() === 1);
assert((int) $pdo->query("SELECT COUNT(*) FROM entry_types WHERE user_id = 79 AND slug = 'comida'")->fetchColumn() === 0);

echo "PersonalJournal initial entry types tests: OK\n";
