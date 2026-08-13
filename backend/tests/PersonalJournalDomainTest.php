<?php
declare(strict_types=1);

require dirname(__DIR__) . '/src/PersonalJournal/Domain/JournalEntry/ValueObject/FeelingScore.php';
require dirname(__DIR__) . '/src/PersonalJournal/Domain/JournalEntry/Entity/JournalEntry.php';
require dirname(__DIR__) . '/src/PersonalJournal/Domain/EntryType/Entity/EntryType.php';
require dirname(__DIR__) . '/src/PersonalJournal/Application/JournalEntryView.php';

use App\PersonalJournal\Application\JournalEntryView;
use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;

function field(string $key, string $label, string $type, int $required = 0, $options = null): array
{
    return [
        'field_key' => $key,
        'label' => $label,
        'input_type' => $type,
        'is_required' => $required,
        'options_json' => $options,
    ];
}

function expectFailure(callable $fn): void
{
    try {
        $fn();
        throw new RuntimeException('Se esperaba InvalidArgumentException.');
    } catch (InvalidArgumentException) {}
}

// FeelingScore válido y límites
$entry = JournalEntry::create(1, 2, 'Caminata', null, 8, ['duracion' => 30]);
assert($entry->feelingScore->value === 8);
assert($entry->values['duracion'] === 30);
expectFailure(fn () => JournalEntry::create(1, 2, 'Inválido', null, 0, []));
expectFailure(fn () => JournalEntry::create(1, 2, 'Inválido', null, 11, []));

// Campo requerido
$requiredType = new EntryType(1, 'prueba', 'Prueba', 'icono', [field('texto', 'Texto', 'text', 1)]);
expectFailure(fn () => $requiredType->validateValues([]));
expectFailure(fn () => $requiredType->validateValues(['texto' => '']));

// number válido / inválido
$numberType = new EntryType(2, 'entrenamiento', 'Entrenamiento', 'entrenamientos', [field('duracion', 'Duración', 'number')]);
assert($numberType->validateValues(['duracion' => 45]) === ['duracion' => 45]);
assert($numberType->validateValues(['duracion' => '45']) === ['duracion' => 45]);
assert($numberType->validateValues(['duracion' => 45.5]) === ['duracion' => 45.5]);
expectFailure(fn () => $numberType->validateValues(['duracion' => 'abc']));
expectFailure(fn () => $numberType->validateValues(['duracion' => [1]]));

// text / textarea
$textType = new EntryType(3, 'texto', 'Texto', 'icono', [field('texto', 'Texto', 'text')]);
assert($textType->validateValues(['texto' => '  hola  ']) === ['texto' => 'hola']);
expectFailure(fn () => $textType->validateValues(['texto' => ['array']]));

$areaType = new EntryType(4, 'area', 'Área', 'icono', [field('detalle', 'Detalle', 'textarea')]);
assert($areaType->validateValues(['detalle' => '  multilínea\ncon salto  ']) === ['detalle' => 'multilínea\ncon salto']);

// date válida / inválida
$dateType = new EntryType(5, 'fecha', 'Fecha', 'icono', [field('fecha', 'Fecha', 'date')]);
assert($dateType->validateValues(['fecha' => '2026-08-12']) === ['fecha' => '2026-08-12']);
expectFailure(fn () => $dateType->validateValues(['fecha' => '2026-13-01']));
expectFailure(fn () => $dateType->validateValues(['fecha' => '12/08/2026']));
expectFailure(fn () => $dateType->validateValues(['fecha' => 'no-es-fecha']));

// time válida / inválida
$timeType = new EntryType(6, 'hora', 'Hora', 'icono', [field('hora', 'Hora', 'time')]);
assert($timeType->validateValues(['hora' => '23:59']) === ['hora' => '23:59']);
assert($timeType->validateValues(['hora' => '9:05']) === ['hora' => '9:05']);
expectFailure(fn () => $timeType->validateValues(['hora' => '24:00']));
expectFailure(fn () => $timeType->validateValues(['hora' => '12:60']));
expectFailure(fn () => $timeType->validateValues(['hora' => 'doce']));

// select válido / fuera de opciones
$selectType = new EntryType(7, 'intensidad', 'Intensidad', 'icono', [
    field('intensidad', 'Intensidad', 'select', 1, json_encode(['baja', 'media', 'alta'])),
]);
assert($selectType->validateValues(['intensidad' => 'media']) === ['intensidad' => 'media']);
expectFailure(fn () => $selectType->validateValues(['intensidad' => 'extrema']));

// checkbox
$checkboxType = new EntryType(8, 'check', 'Check', 'icono', [field('ok', '¿OK?', 'checkbox')]);
assert($checkboxType->validateValues(['ok' => true]) === ['ok' => true]);
assert($checkboxType->validateValues(['ok' => '1']) === ['ok' => true]);
assert($checkboxType->validateValues(['ok' => 'false']) === ['ok' => false]);
expectFailure(fn () => $checkboxType->validateValues(['ok' => 'quizas']));

// claves desconocidas rechazadas
expectFailure(fn () => $numberType->validateValues(['duracion' => 45, 'campo_inventado' => 'x']));

// JournalEntryView conserva la forma esperada
$view = JournalEntryView::from($entry, $numberType);
assert($view['type'] === 'entrenamiento');
assert($view['score'] === 8);
assert($view['detail'] === null);

echo "PersonalJournal domain tests: OK\n";