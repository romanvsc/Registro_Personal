<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\CreateEntry;

use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Entity\JournalEntry;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use DateTimeImmutable;
use InvalidArgumentException;

final readonly class CreateEntry
{
    public function __construct(private JournalEntryRepository $entries, private EntryTypeRepository $types) {}

    public function execute(int $userId, array $input): JournalEntry
    {
        $type = $this->types->bySlug((string) ($input['type'] ?? ''), $userId);
        if ($type === null) throw new InvalidArgumentException('El tipo de registro no existe o está inactivo.');
        $values = $type->validateValues(is_array($input['values'] ?? null) ? $input['values'] : []);
        $occurredAt = isset($input['occurredAt']) ? new DateTimeImmutable((string) $input['occurredAt']) : null;

        return $this->entries->save(JournalEntry::create(
            $userId,
            $type->id,
            (string) ($input['title'] ?? $type->name),
            isset($input['notes']) ? (string) $input['notes'] : null,
            (int) ($input['score'] ?? 0),
            $values,
            $occurredAt,
        ));
    }
}
