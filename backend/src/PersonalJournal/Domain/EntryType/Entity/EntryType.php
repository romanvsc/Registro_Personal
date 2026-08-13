<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\EntryType\Entity;

use InvalidArgumentException;

final readonly class EntryType
{
    /** Contrato de iconos soportados por la presentación (AppIcon + catálogo secundario). */
    public const ALLOWED_ICONS = [
        'hoy', 'comidas', 'entrenamientos', 'estado-animo', 'historial',
        'nuevo-registro', 'saludo',
        'agua', 'peso', 'objetivos', 'progreso', 'racha', 'record-personal',
        'sueno', 'exito', 'advertencia', 'error',
    ];

    public const ALLOWED_INPUT_TYPES = ['text', 'textarea', 'number', 'date', 'time', 'select', 'checkbox'];

    public function __construct(
        public int $id,
        public string $slug,
        public string $name,
        public string $icon,
        public array $fields,
        public bool $isActive = true,
        public int $sortOrder = 0,
        public int $userId = 1,
    ) {}

    public static function create(int $userId, string $slug, string $name, string $icon, array $fields = [], bool $isActive = true, int $sortOrder = 0): self
    {
        $name = self::validateName($name);
        $slug = self::validateSlug($slug);
        self::validateIcon($icon);
        self::validateSortOrder($sortOrder);
        return new self(0, $slug, $name, $icon, $fields, $isActive, $sortOrder, $userId);
    }

    public function deactivate(): self
    {
        return new self($this->id, $this->slug, $this->name, $this->icon, $this->fields, false, $this->sortOrder, $this->userId);
    }

    public function withActive(bool $active): self
    {
        return new self($this->id, $this->slug, $this->name, $this->icon, $this->fields, $active, $this->sortOrder, $this->userId);
    }

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

    /**
     * Normaliza la definición de campos enviada por el cliente (camelCase) a filas de persistencia (snake_case),
     * aplicando todas las reglas de dominio de los campos dinámicos.
     *
     * @param array<int, array<string, mixed>> $fields
     * @return array<int, array<string, mixed>>
     */
    public static function normalizeFields(array $fields): array
    {
        $seenKeys = [];
        $rows = [];
        foreach ($fields as $index => $field) {
            $key = (string) ($field['fieldKey'] ?? '');
            $label = (string) ($field['label'] ?? '');
            $inputType = (string) ($field['inputType'] ?? '');
            $required = (bool) ($field['required'] ?? false);
            $sortOrder = (int) ($field['sortOrder'] ?? ($index + 1) * 10);

            self::validateFieldKey($key);
            if (isset($seenKeys[$key])) {
                throw new InvalidArgumentException("El campo \"{$key}\" está duplicado dentro del tipo.");
            }
            $seenKeys[$key] = true;

            $label = trim($label);
            if ($label === '') {
                throw new InvalidArgumentException('El label del campo es obligatorio.');
            }
            if (mb_strlen($label) > 120) {
                throw new InvalidArgumentException('El label del campo no puede superar los 120 caracteres.');
            }

            if (!in_array($inputType, self::ALLOWED_INPUT_TYPES, true)) {
                throw new InvalidArgumentException("El campo \"{$key}\" tiene un tipo no soportado.");
            }

            $options = null;
            if ($inputType === 'select') {
                $options = self::normalizeOptions($key, is_array($field['options'] ?? null) ? $field['options'] : []);
            }

            self::validateSortOrder($sortOrder);

            $rows[] = [
                'field_key' => $key,
                'label' => $label,
                'input_type' => $inputType,
                'is_required' => $required ? 1 : 0,
                'options_json' => $options !== null ? json_encode($options, JSON_UNESCAPED_UNICODE) : null,
                'sort_order' => $sortOrder,
            ];
        }
        return $rows;
    }

    public static function slugify(string $name): string
    {
        $normalized = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', trim($name)) ?? '';
        $slug = preg_replace('/[^a-z0-9]+/', '-', strtolower($normalized)) ?? '';
        return trim($slug, '-');
    }

    public static function validateName(string $name): string
    {
        $name = trim($name);
        if ($name === '') {
            throw new InvalidArgumentException('El nombre del tipo es obligatorio.');
        }
        if (mb_strlen($name) > 120) {
            throw new InvalidArgumentException('El nombre del tipo no puede superar los 120 caracteres.');
        }
        return $name;
    }

    public static function validateSlug(string $slug): string
    {
        $slug = trim($slug);
        if ($slug === '') {
            throw new InvalidArgumentException('El slug del tipo es obligatorio.');
        }
        if (!preg_match('/^[a-z0-9][a-z0-9_-]*$/', $slug)) {
            throw new InvalidArgumentException('El slug solo puede contener minúsculas, números, guiones y guiones bajos.');
        }
        if (mb_strlen($slug) > 80) {
            throw new InvalidArgumentException('El slug no puede superar los 80 caracteres.');
        }
        return $slug;
    }

    public static function validateIcon(string $icon): void
    {
        if (!in_array($icon, self::ALLOWED_ICONS, true)) {
            throw new InvalidArgumentException('El icono del tipo no es válido.');
        }
    }

    public static function validateSortOrder(int $sortOrder): void
    {
        if ($sortOrder < 0 || $sortOrder > 2147483647) {
            throw new InvalidArgumentException('El orden debe ser un número entero no negativo.');
        }
    }

    private static function validateFieldKey(string $key): void
    {
        if ($key === '') {
            throw new InvalidArgumentException('El fieldKey del campo es obligatorio.');
        }
        if (!preg_match('/^[a-z0-9][a-z0-9_]*$/', $key)) {
            throw new InvalidArgumentException('El fieldKey solo puede contener minúsculas, números y guiones bajos.');
        }
    }

    /**
     * @return array<int, string>
     */
    private static function normalizeOptions(string $key, array $options): array
    {
        $normalized = [];
        foreach ($options as $option) {
            $option = trim((string) $option);
            if ($option === '') {
                continue;
            }
            $normalized[$option] = $option;
        }
        $normalized = array_values($normalized);
        if ($normalized === []) {
            throw new InvalidArgumentException("El campo \"{$key}\" de tipo select necesita al menos una opción.");
        }
        return $normalized;
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
