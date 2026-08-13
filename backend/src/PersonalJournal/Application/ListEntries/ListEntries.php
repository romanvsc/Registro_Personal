<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\ListEntries;

use App\PersonalJournal\Application\JournalEntryView;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use App\PersonalJournal\Domain\JournalEntry\ValueObject\EntryFilters;
use DateTimeImmutable;
use InvalidArgumentException;

final readonly class ListEntries
{
    public function __construct(
        private JournalEntryRepository $entries,
        private EntryTypeRepository $types,
        private int $defaultLimit = 30,
        private int $maxLimit = 100,
    ) {}

    public function execute(int $userId, int $page = 1, ?int $limit = null, array $query = []): array
    {
        if ($page < 1) {
            throw new InvalidArgumentException('La página debe ser mayor o igual a 1.');
        }
        $limit = $limit ?? $this->defaultLimit;
        if ($limit < 1 || $limit > $this->maxLimit) {
            throw new InvalidArgumentException("El límite debe estar entre 1 y {$this->maxLimit}.");
        }

        $filters = $this->filtersFromQuery($userId, $query);

        $types = [];
        foreach ($this->types->all($userId) as $type) $types[$type->id] = $type;

        $total = $this->entries->countByUser($userId, $filters);
        $offset = ($page - 1) * $limit;

        $items = array_map(static fn ($entry) => JournalEntryView::from($entry, $types[$entry->typeId] ?? null), $this->entries->byPage($userId, $filters, $limit, $offset));

        return [
            'items' => $items,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => $total > 0 ? (int) ceil($total / $limit) : 0,
            ],
        ];
    }

    private function filtersFromQuery(int $userId, array $query): EntryFilters
    {
        $slug = $this->normalizeType($userId, $query['type'] ?? null);
        $from = $this->parseDate($query['from'] ?? null, 'desde');
        $to = $this->parseDate($query['to'] ?? null, 'hasta');
        if ($from !== null && $to !== null && $from > $to) {
            throw new InvalidArgumentException('La fecha "desde" no puede ser mayor que "hasta".');
        }

        $minScore = $this->parseScore($query['minScore'] ?? null, 'mínima');
        $maxScore = $this->parseScore($query['maxScore'] ?? null, 'máxima');
        if ($minScore !== null && $maxScore !== null && $minScore > $maxScore) {
            throw new InvalidArgumentException('La sensación mínima no puede ser mayor que la máxima.');
        }

        return new EntryFilters(
            $slug,
            $from,
            $to,
            $minScore,
            $maxScore,
            $this->normalizeSearch($query['search'] ?? null),
        );
    }

    private function normalizeType(int $userId, mixed $value): ?string
    {
        if ($value === null || $value === '') return null;
        $candidate = trim((string) $value);
        $known = [];
        foreach ($this->types->active($userId) as $type) $known[$type->slug] = true;
        if (!isset($known[$candidate])) {
            throw new InvalidArgumentException('El tipo de registro no es válido o está inactivo.');
        }
        return $candidate;
    }

    private function parseDate(mixed $value, string $label): ?DateTimeImmutable
    {
        if ($value === null || $value === '') return null;
        $candidate = trim((string) $value);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $candidate)) {
            throw new InvalidArgumentException("La fecha {$label} debe tener el formato AAAA-MM-DD.");
        }
        try {
            $date = new DateTimeImmutable($candidate);
        } catch (\Throwable) {
            throw new InvalidArgumentException("La fecha {$label} no es válida.");
        }
        if ($date->format('Y-m-d') !== $candidate) {
            throw new InvalidArgumentException("La fecha {$label} no es válida.");
        }
        return $date;
    }

    private function parseScore(mixed $value, string $label): ?int
    {
        if ($value === null || $value === '') return null;
        if (!is_numeric($value)) {
            throw new InvalidArgumentException("La sensación {$label} debe ser un número.");
        }
        $score = (int) $value;
        if ($score < 1 || $score > 10) {
            throw new InvalidArgumentException("La sensación {$label} debe estar entre 1 y 10.");
        }
        return $score;
    }

    private function normalizeSearch(mixed $value): ?string
    {
        if ($value === null || $value === '') return null;
        $trimmed = trim((string) $value);
        if ($trimmed === '') return null;
        if (mb_strlen($trimmed) > 120) {
            throw new InvalidArgumentException('La búsqueda no puede superar los 120 caracteres.');
        }
        return $trimmed;
    }
}