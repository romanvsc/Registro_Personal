<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\EntryType\Repository;

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;

interface EntryTypeRepository
{
    /** @return EntryType[] */
    public function active(): array;
    public function bySlug(string $slug): ?EntryType;
    public function byId(int $id): ?EntryType;
}
