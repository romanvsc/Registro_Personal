<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\EntryType\Entity;

use InvalidArgumentException;

final readonly class EntryType
{
    public function __construct(
        public int $id,
        public string $slug,
        public string $name,
        public string $icon,
        public array $fields,
    ) {}

    /**
     * Valida y normaliza los valores según la definición de campos del tipo.
     *
     * @return array<string, mixed>
     */
    public function validateValues(array $values): array
    {
        $knownKeys = [];
        $validated = [];
        foreach ($this->fields as $field) {
            $key = (string) $field['field_key'];
            $knownKeys[$key] = true;
            $label = (string) $field['label'];
            $value = array_key_exists($key, $values) ? $values[$key] : null;

            if ((bool) $field['is_required'] && $this->isEmpty($value)) {
                throw new InvalidArgumentException("El campo {$label} es obligatorio.");
            }
            if ($this->isEmpty($value)) {
                continue;
            }

            $validated[$key] = $this->normalize($field, $value);
        }

        foreach (array_keys($values) as $key) {
            if (!isset($knownKeys[$key])) {
                throw new InvalidArgumentException("El campo \"{$key}\" no está definido para {$this->slug}.");
            }
        }

        return $validated;
    }

    private function isEmpty(mixed $value): bool
    {
        return $value === null || $value === '';
    }

    private function normalize(array $field, mixed $value): mixed
    {
        $label = (string) $field['label'];

        return match ($field['input_type']) {
            'text' => $this->validateText($value, $label),
            'textarea' => $this->validateTextarea($value, $label),
            'number' => $this->validateNumber($value, $label),
            'date' => $this->validateDate($value, $label),
            'time' => $this->validateTime($value, $label),
            'select' => $this->validateSelect($field, $value, $label),
            'checkbox' => $this->normalizeCheckbox($value, $label),
            default => throw new InvalidArgumentException("El campo {$label} tiene un tipo no soportado."),
        };
    }

    private function validateText(mixed $value, string $label): string
    {
        if (!is_string($value)) {
            throw new InvalidArgumentException("El campo {$label} debe ser un texto.");
        }
        $trimmed = trim($value);
        if ($trimmed === '') {
            throw new InvalidArgumentException("El campo {$label} no puede quedar vacío.");
        }
        return $trimmed;
    }

    private function validateTextarea(mixed $value, string $label): string
    {
        if (!is_string($value)) {
            throw new InvalidArgumentException("El campo {$label} debe ser un texto.");
        }
        return trim($value);
    }

    private function validateNumber(mixed $value, string $label): int|float
    {
        $normalized = $value;
        if (is_string($normalized)) {
            $normalized = trim($normalized);
        }
        if (!is_numeric($normalized)) {
            throw new InvalidArgumentException("{$label} debe ser un número válido.");
        }
        $number = $normalized + 0;

        return is_float($number) && floor($number) === $number ? (int) $number : $number;
    }

    private function validateDate(mixed $value, string $label): string
    {
        if (!is_string($value) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', trim($value))) {
            throw new InvalidArgumentException("{$label} contiene una fecha inválida.");
        }
        [$year, $month, $day] = array_map('intval', explode('-', trim($value)));
        if (!checkdate($month, $day, $year)) {
            throw new InvalidArgumentException("{$label} contiene una fecha inválida.");
        }
        return trim($value);
    }

    private function validateTime(mixed $value, string $label): string
    {
        if (!is_string($value) || !preg_match('/^(\d{1,2}):([0-5]\d)$/', trim($value), $matches)) {
            throw new InvalidArgumentException("{$label} debe tener el formato HH:MM válido.");
        }
        $hour = (int) $matches[1];
        if ($hour > 23) {
            throw new InvalidArgumentException("{$label} debe tener el formato HH:MM válido.");
        }
        return trim($value);
    }

    private function validateSelect(array $field, mixed $value, string $label): string
    {
        $options = is_string($field['options_json'] ?? null)
            ? json_decode($field['options_json'], true)
            : ($field['options_json'] ?? []);
        $options = is_array($options) ? array_map('strval', $options) : [];
        $candidate = is_string($value) ? trim($value) : $value;

        if (!in_array((string) $candidate, $options, true)) {
            throw new InvalidArgumentException("La opción seleccionada para {$label} no es válida.");
        }
        return (string) $candidate;
    }

    private function normalizeCheckbox(mixed $value, string $label): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        $normalized = is_string($value) ? strtolower(trim($value)) : $value;
        if (in_array($normalized, ['1', 'true', 'on', 'yes'], true)) {
            return true;
        }
        if (in_array($normalized, ['0', 'false', 'off', 'no', ''], true)) {
            return false;
        }
        throw new InvalidArgumentException("El campo {$label} debe ser verdadero o falso.");
    }
}