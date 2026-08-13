<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/ValueObject/FeelingScore.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/ValueObject/EntryFilters.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/Entity/JournalEntry.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/JournalEntry/Repository/JournalEntryRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Entity/EntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Repository/EntryTypeRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/EntryNotFoundException.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/ConflictException.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/EntryTypeView.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/EntryTypes/CreateEntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/EntryTypes/UpdateEntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/EntryTypes/GetEntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/EntryTypes/DeleteEntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Application/ListEntryTypes/ListEntryTypes.php';

use App\PersonalJournal\Application\ConflictException;
use App\PersonalJournal\Application\EntryNotFoundException;
use App\PersonalJournal\Application\EntryTypes\CreateEntryType;
use App\PersonalJournal\Application\EntryTypes\DeleteEntryType;
use App\PersonalJournal\Application\EntryTypes\GetEntryType;
use App\PersonalJournal\Application\EntryTypes\UpdateEntryType;
use App\PersonalJournal\Application\ListEntryTypes\ListEntryTypes;
use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use App\PersonalJournal\Domain\JournalEntry\ValueObject\EntryFilters;

final class MemoryEntryTypeRepository implements EntryTypeRepository
{
    /** @var array<int, array{type: EntryType, userId: int}> */
    private array $rows = [];
    private int $nextId = 1;
    /** @var array<int, array{typeId: int, userId: int}> */
    private array $entries = [];

    public function seed(EntryType $type, int $userId = 1): void
    {
        $id = $type->id === 0 ? $this->nextId++ : $type->id;
        $this->rows[$id] = ['type' => new EntryType($id, $type->slug, $type->name, $type->icon, $type->fields, $type->isActive, $type->sortOrder, $userId), 'userId' => $userId];
        if ($id >= $this->nextId) $this->nextId = $id + 1;
    }

    public function withEntry(int $typeId, int $userId = 1): void
    {
        $this->entries[] = ['typeId' => $typeId, 'userId' => $userId];
    }

    public function active(int $userId): array
    {
        return array_values(array_filter(array_map(
            static fn ($row) => $row['type'],
            $this->rows,
        ), static fn (EntryType $type) => $type->userId === $userId && $type->isActive));
    }

    public function all(int $userId): array
    {
        return array_values(array_filter(array_map(
            static fn ($row) => $row['type'],
            $this->rows,
        ), static fn (EntryType $type) => $type->userId === $userId));
    }

    public function bySlug(string $slug, int $userId): ?EntryType
    {
        foreach ($this->rows as $row) {
            if ($row['userId'] === $userId && $row['type']->slug === $slug && $row['type']->isActive) return $row['type'];
        }
        return null;
    }

    public function byId(int $id, int $userId): ?EntryType
    {
        $row = $this->rows[$id] ?? null;
        return $row !== null && $row['userId'] === $userId ? $row['type'] : null;
    }

    public function save(EntryType $type): EntryType
    {
        if ($type->id === 0) {
            $this->seed($type, $type->userId);
            return $this->rows[$this->nextId - 1]['type'];
        }
        $this->rows[$type->id]['type'] = $type;
        return $type;
    }

    public function deactivate(int $id, int $userId): bool
    {
        $row = $this->rows[$id] ?? null;
        if ($row === null || $row['userId'] !== $userId) return false;
        $this->rows[$id]['type'] = $row['type']->deactivate();
        return true;
    }

    public function delete(int $id, int $userId): bool
    {
        if (!isset($this->rows[$id]) || $this->rows[$id]['userId'] !== $userId) return false;
        unset($this->rows[$id]);
        return true;
    }

    public function slugExists(string $slug, int $excludeId, int $userId): bool
    {
        foreach ($this->rows as $id => $row) {
            if ($row['userId'] === $userId && $id !== $excludeId && $row['type']->slug === $slug) return true;
        }
        return false;
    }
}

final class MemoryEntryRepository implements JournalEntryRepository
{
    public function save(JournalEntry $entry): JournalEntry { return $entry; }
    public function update(JournalEntry $entry): JournalEntry { return $entry; }
    public function delete(int $id, int $userId): bool { return true; }
    public function byIdForUser(int $id, int $userId): ?JournalEntry { return null; }
    public function byPage(int $userId, EntryFilters $filters, int $limit, int $offset): array { return []; }
    public function countByUser(int $userId, EntryFilters $filters): int { return 0; }
    public function countByUserAndType(int $userId, int $typeId): int { return 0; }
    public function summaryForUser(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array { return ['total' => 0, 'average' => 0.0, 'min' => 0, 'max' => 0]; }
    public function breakdownByType(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array { return []; }
    public function trendForPeriod(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array { return []; }
    public function periodForComparison(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array { return ['total' => 0, 'average' => 0.0]; }
}

final class CountingEntryRepository implements JournalEntryRepository
{
    public function __construct(public int $count = 0) {}
    public function save(JournalEntry $entry): JournalEntry { return $entry; }
    public function update(JournalEntry $entry): JournalEntry { return $entry; }
    public function delete(int $id, int $userId): bool { return true; }
    public function byIdForUser(int $id, int $userId): ?JournalEntry { return null; }
    public function byPage(int $userId, EntryFilters $filters, int $limit, int $offset): array { return []; }
    public function countByUser(int $userId, EntryFilters $filters): int { return 0; }
    public function countByUserAndType(int $userId, int $typeId): int { return $this->count; }
    public function summaryForUser(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array { return ['total' => 0, 'average' => 0.0, 'min' => 0, 'max' => 0]; }
    public function breakdownByType(int $userId, ?DateTimeImmutable $from = null, ?DateTimeImmutable $to = null): array { return []; }
    public function trendForPeriod(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array { return []; }
    public function periodForComparison(int $userId, DateTimeImmutable $from, DateTimeImmutable $to): array { return ['total' => 0, 'average' => 0.0]; }
}

function expectInvalidType(callable $fn): void
{
    try {
        $fn();
        throw new RuntimeException('Se esperaba InvalidArgumentException.');
    } catch (InvalidArgumentException) {}
}

function expectConflict(callable $fn): void
{
    try {
        $fn();
        throw new RuntimeException('Se esperaba ConflictException.');
    } catch (ConflictException) {}
}

function expectTypeNotFound(callable $fn): void
{
    try {
        $fn();
        throw new RuntimeException('Se esperaba EntryNotFoundException.');
    } catch (EntryNotFoundException) {}
}

$types = new MemoryEntryTypeRepository();
$entries = new CountingEntryRepository();

// Crear tipo con campos dinámicos (camelCase -> snake_case)
$create = new CreateEntryType($types);
$created = $create->execute(1, [
    'name' => 'Comida',
    'slug' => 'comida',
    'icon' => 'comidas',
    'sortOrder' => 10,
    'fields' => [
        ['fieldKey' => 'sabor', 'label' => 'Sabor', 'inputType' => 'select', 'required' => true, 'options' => ['rico', 'ok', 'malo']],
        ['fieldKey' => 'cantidad', 'label' => 'Cantidad', 'inputType' => 'number'],
    ],
]);
assert($created['type']['id'] !== 0);
assert($created['type']['slug'] === 'comida');
assert($created['type']['active'] === true);
assert(count($created['type']['fields']) === 2);
assert($created['type']['fields'][0]['key'] === 'sabor');
assert($created['type']['fields'][0]['options'] === ['rico', 'ok', 'malo']);
assert($created['type']['fields'][0]['sortOrder'] === 10);

// Slug duplicado -> 409
expectConflict(fn () => $create->execute(1, ['name' => 'Otra comida', 'slug' => 'comida', 'icon' => 'hoy']));

// Slug autogenerado con acentos
$auto = $create->execute(1, ['name' => 'Estado ánimo', 'icon' => 'estado-animo']);
assert($auto['type']['slug'] === 'estado-animo');

// Name vacío -> 422
expectInvalidType(fn () => $create->execute(1, ['name' => '  ', 'slug' => 'x', 'icon' => 'hoy']));

// Icono fuera de whitelist -> 422
expectInvalidType(fn () => $create->execute(1, ['name' => 'X', 'slug' => 'x', 'icon' => 'dragones']));

// Slug inválido -> 422
expectInvalidType(fn () => $create->execute(1, ['name' => 'X', 'slug' => 'Mal Slug', 'icon' => 'hoy']));

// Campo duplicado dentro del tipo -> 422
expectInvalidType(fn () => $create->execute(1, ['name' => 'X', 'slug' => 'dup-campo', 'icon' => 'hoy', 'fields' => [
    ['fieldKey' => 'a', 'label' => 'A', 'inputType' => 'text'],
    ['fieldKey' => 'a', 'label' => 'B', 'inputType' => 'text'],
]]));

// Select sin opciones -> 422
expectInvalidType(fn () => $create->execute(1, ['name' => 'X', 'slug' => 'sin-opciones', 'icon' => 'hoy', 'fields' => [
    ['fieldKey' => 's', 'label' => 'S', 'inputType' => 'select', 'options' => []],
]]));

// Editar tipo (cambiar nombre, quitar un campo)
$update = new UpdateEntryType($types);
$updated = $update->execute(1, $created['type']['id'], [
    'name' => 'Comidas y bebidas',
    'slug' => 'comidas-bebidas',
    'icon' => 'comidas',
    'fields' => [
        ['fieldKey' => 'sabor', 'label' => 'Sabor', 'inputType' => 'select', 'required' => true, 'options' => ['rico', 'malo']],
    ],
]);
assert($updated['type']['name'] === 'Comidas y bebidas');
assert($updated['type']['slug'] === 'comidas-bebidas');
assert(count($updated['type']['fields']) === 1);
assert($updated['type']['fields'][0]['options'] === ['rico', 'malo']);

// Duplicar slug de otro tipo -> 409
expectConflict(fn () => $update->execute(1, $auto['type']['id'], ['name' => 'Otro', 'slug' => 'comidas-bebidas', 'icon' => 'hoy']));

// Reactivar / desactivar vía PATCH active
$toggled = $update->execute(1, $auto['type']['id'], ['active' => false]);
assert($toggled['type']['active'] === false);
$reenabled = $update->execute(1, $auto['type']['id'], ['active' => true]);
assert($reenabled['type']['active'] === true);

// Get por id -> 404 para inexistente y para otro usuario
$get = new GetEntryType($types);
assert($get->execute(1, $created['type']['id'])['type']['slug'] === 'comidas-bebidas');
expectTypeNotFound(fn () => $get->execute(1, 9999));
expectTypeNotFound(fn () => $get->execute(2, $created['type']['id'])); // ajeno -> 404

// Listado por defecto solo activos; includeInactive=true devuelve todos
$list = new ListEntryTypes($types);
assert(count($list->execute(1)) === 2);
assert($list->execute(1)[0]['active'] === true);

// Aislamiento por usuario: tipos del usuario 2 no deben verse por el usuario 1
$other = new MemoryEntryTypeRepository();
$createOther = new CreateEntryType($other);
$otherSeeded = $createOther->execute(2, ['name' => 'Privado', 'slug' => 'privado', 'icon' => 'hoy']);
$getOther = new GetEntryType($other);
expectTypeNotFound(fn () => $getOther->execute(1, $otherSeeded['type']['id'])); // user1 no ve tipos de user2
expectTypeNotFound(fn () => $get->execute(2, $created['type']['id'])); // user2 no ve tipos de user1

// Delete sin registros -> borrado físico
$bare = $create->execute(1, ['name' => 'Unused', 'slug' => 'unused', 'icon' => 'hoy']);
$delete = new DeleteEntryType($types, $entries);
$afterBare = $delete->execute(1, $bare['type']['id']);
assert($afterBare['deleted'] === true);
assert(!isset($afterBare['deactivated']));
expectTypeNotFound(fn () => $get->execute(1, $bare['type']['id']));

// Delete con registros -> desactiva (200), conserva el historial
$entries->count = 3;
$used = $create->execute(1, ['name' => 'En uso', 'slug' => 'en-uso', 'icon' => 'hoy']);
$afterUsed = $delete->execute(1, $used['type']['id']);
assert($afterUsed['deactivated'] === true);
assert($afterUsed['type']['active'] === false);
$stillVisible = $get->execute(1, $used['type']['id']);
assert($stillVisible['type']['slug'] === 'en-uso');
assert($stillVisible['type']['active'] === false);

expectTypeNotFound(fn () => $delete->execute(1, 9999));

// Delete ajeno -> 404 (user2 intenta borrar tipo de user1)
expectTypeNotFound(fn () => $delete->execute(2, $created['type']['id']));

echo "PersonalJournal entry type tests: OK\n";