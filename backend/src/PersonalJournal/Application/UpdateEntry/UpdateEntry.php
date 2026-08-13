<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\UpdateEntry;

use App\PersonalJournal\Application\EntryNotFoundException;
use App\PersonalJournal\Application\JournalEntryView;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use DateTimeImmutable;
use InvalidArgumentException;

final readonly class UpdateEntry
{
    public function __construct(
        private JournalEntryRepository $entries,
        private EntryTypeRepository $types,
    ) {}

    public function execute(int $userId, int $id, array $input): array
    {
        $current = $this->entries->byIdForUser($id, $userId);
        if ($current === null) {
            throw new EntryNotFoundException('Registro no encontrado.');
        }

        $type = $this->types->bySlug((string) ($input['type'] ?? ''), $userId);
        if ($type === null) {
            throw new InvalidArgumentException('El tipo de registro no existe o está inactivo.');
        }

        $values = $type->validateValues(is_array($input['values'] ?? null) ? $input['values'] : []);
        $occurredAt = $this->resolveOccurredAt($current->occurredAt, $input);

        $updated = $current->edit(
            $type->id,
            (string) ($input['title'] ?? $type->name),
            isset($input['notes']) ? (string) $input['notes'] : null,
            (int) ($input['score'] ?? 0),
            $values,
            $occurredAt,
        );

        $this->entries->update($updated);
        return ['entry' => JournalEntryView::from($updated, $type)];
    }

    private function resolveOccurredAt(DateTimeImmutable $current, array $input): DateTimeImmutable
    {
        if (!isset($input['occurredAt']) || !is_string($input['occurredAt']) || trim($input['occurredAt']) === '') {
            return $current;
        }
        try {
            return new DateTimeImmutable($input['occurredAt']);
        } catch (\Throwable) {
            throw new InvalidArgumentException('La fecha y hora del registro no es válida.');
        }
    }
}