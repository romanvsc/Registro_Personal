<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\ProvisionInitialEntryTypes;

use InvalidArgumentException;

final readonly class ProvisionInitialEntryTypesCommand
{
    public function __construct(public int $userId)
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('El identificador del usuario debe ser positivo.');
        }
    }
}
