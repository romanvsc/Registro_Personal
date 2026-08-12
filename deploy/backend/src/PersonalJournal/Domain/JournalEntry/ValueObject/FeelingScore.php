<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\JournalEntry\ValueObject;

use InvalidArgumentException;

final readonly class FeelingScore
{
    public function __construct(public int $value)
    {
        if ($value < 1 || $value > 10) {
            throw new InvalidArgumentException('La sensación debe estar entre 1 y 10.');
        }
    }
}
