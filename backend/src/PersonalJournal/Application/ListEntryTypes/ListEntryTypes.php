<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\ListEntryTypes;

use App\PersonalJournal\Application\EntryTypeView;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;

final readonly class ListEntryTypes
{
    public function __construct(private EntryTypeRepository $types) {}

    public function execute(int $userId, bool $includeInactive = false): array
    {
        $types = $includeInactive ? $this->types->all($userId) : $this->types->active($userId);

        return array_map(static fn ($type) => EntryTypeView::from($type), $types);
    }
}