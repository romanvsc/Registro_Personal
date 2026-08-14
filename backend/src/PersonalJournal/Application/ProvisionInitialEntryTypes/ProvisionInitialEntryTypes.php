<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\ProvisionInitialEntryTypes;

use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\EntryType\Service\InitialEntryTypes;

final readonly class ProvisionInitialEntryTypes
{
    public function __construct(private EntryTypeRepository $types) {}

    public function execute(ProvisionInitialEntryTypesCommand $command): void
    {
        foreach (InitialEntryTypes::forUser($command->userId) as $type) {
            $this->types->save($type);
        }
    }
}
