<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\JournalEntry\ValueObject;

use DateTimeImmutable;

/**
 * Criterios de consulta del historial. Se mantiene libre de paginación y SQL:
 * page/limit y la construcción de consultas viven en la capa de aplicación e infraestructura.
 */
final readonly class EntryFilters
{
    public function __construct(
        public ?string $type,
        public ?DateTimeImmutable $from,
        public ?DateTimeImmutable $to,
        public ?int $minScore,
        public ?int $maxScore,
        public ?string $search,
    ) {}

    public static function none(): self
    {
        return new self(null, null, null, null, null, null);
    }
}