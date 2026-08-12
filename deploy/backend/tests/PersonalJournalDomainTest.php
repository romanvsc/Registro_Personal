<?php
declare(strict_types=1);

require dirname(__DIR__) . '/src/PersonalJournal/Domain/JournalEntry/ValueObject/FeelingScore.php';
require dirname(__DIR__) . '/src/PersonalJournal/Domain/JournalEntry/Entity/JournalEntry.php';
require dirname(__DIR__) . '/src/PersonalJournal/Domain/EntryType/Entity/EntryType.php';

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;

$entry = JournalEntry::create(1, 2, 'Caminata', null, 8, ['duracion' => 30]);
assert($entry->feelingScore->value === 8);
assert($entry->values['duracion'] === 30);

$type = new EntryType(2, 'entrenamiento', 'Entrenamiento', 'entrenamientos', [[
    'field_key' => 'duracion', 'label' => 'Duración', 'input_type' => 'number', 'is_required' => 1, 'options_json' => null,
]]);
assert($type->validateValues(['duracion' => 45]) === ['duracion' => 45]);

try { JournalEntry::create(1, 2, 'Inválido', null, 11, []); assert(false); } catch (InvalidArgumentException) {}
try { $type->validateValues([]); assert(false); } catch (InvalidArgumentException) {}

echo "PersonalJournal domain tests: OK\n";
