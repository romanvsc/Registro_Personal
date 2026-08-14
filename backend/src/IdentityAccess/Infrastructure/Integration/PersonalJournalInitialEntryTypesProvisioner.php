<?php
declare(strict_types=1);

namespace App\IdentityAccess\Infrastructure\Integration;

use App\IdentityAccess\Application\Port\InitialEntryTypesProvisioner;
use App\PersonalJournal\Application\ProvisionInitialEntryTypes\ProvisionInitialEntryTypes;
use App\PersonalJournal\Application\ProvisionInitialEntryTypes\ProvisionInitialEntryTypesCommand;

final readonly class PersonalJournalInitialEntryTypesProvisioner implements InitialEntryTypesProvisioner
{
    public function __construct(private ProvisionInitialEntryTypes $provisionInitialEntryTypes) {}

    public function provisionFor(int $userId): void
    {
        $this->provisionInitialEntryTypes->execute(new ProvisionInitialEntryTypesCommand($userId));
    }
}
