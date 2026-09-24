<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Entity/EntryType.php';
require_once __DIR__ . '/../src/PersonalJournal/Domain/EntryType/Repository/EntryTypeRepository.php';
require_once __DIR__ . '/../src/PersonalJournal/Infrastructure/Persistence/PdoEntryTypeRepository.php';

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;

$text = "Caf\u{00e9} \u{00f1} \u{00bf}\u{00f3}";
$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec('CREATE TABLE journal_utf8_probe (value TEXT NOT NULL)');
$insert = $pdo->prepare('INSERT INTO journal_utf8_probe (value) VALUES (?)');
$insert->execute([$text]);

assert($pdo->query('SELECT value FROM journal_utf8_probe')->fetchColumn() === $text);

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
    UNIQUE (entry_type_id, field_key)
)');

$type = EntryType::create(
    1,
    'cafeteria',
    $text,
    'comidas',
    EntryType::normalizeFields([[
        'fieldKey' => 'detalle',
        'label' => $text,
        'inputType' => 'textarea',
    ]]),
);

assert($type->name === $text);
assert($type->fields[0]['label'] === $text);

$repository = new App\PersonalJournal\Infrastructure\Persistence\PdoEntryTypeRepository($pdo);
$saved = $repository->save($type);
$roundTrip = $repository->byId($saved->id, 1);
assert($roundTrip !== null);
assert($roundTrip->name === $text);
assert($roundTrip->fields[0]['label'] === $text);
echo "PersonalJournal UTF-8 tests: OK\n";
