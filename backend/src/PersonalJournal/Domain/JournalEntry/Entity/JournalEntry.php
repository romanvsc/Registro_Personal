<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\JournalEntry\Entity;

use App\PersonalJournal\Domain\JournalEntry\ValueObject\FeelingScore;
use DateTimeImmutable;
use InvalidArgumentException;

final readonly class JournalEntry
{
    private function __construct(
        public ?int $id,
        public int $userId,
        public int $typeId,
        public string $title,
        public ?string $notes,
        public FeelingScore $feelingScore,
        public array $values,
        public DateTimeImmutable $occurredAt,
    ) {}

    public static function create(int $userId, int $typeId, string $title, ?string $notes, int $score, array $values, ?DateTimeImmutable $occurredAt = null): self
    {
        $title = trim($title);
        if ($userId < 1 || $typeId < 1) throw new InvalidArgumentException('Usuario y tipo son obligatorios.');
        if ($title === '') throw new InvalidArgumentException('El título es obligatorio.');

        return new self(null, $userId, $typeId, $title, self::cleanText($notes), new FeelingScore($score), $values, $occurredAt ?? new DateTimeImmutable());
    }

    public static function reconstitute(int $id, int $userId, int $typeId, string $title, ?string $notes, int $score, array $values, DateTimeImmutable $occurredAt): self
    {
        return new self($id, $userId, $typeId, $title, $notes, new FeelingScore($score), $values, $occurredAt);
    }

    private static function cleanText(?string $value): ?string
    {
        $clean = trim((string) $value);
        return $clean === '' ? null : $clean;
    }
}
