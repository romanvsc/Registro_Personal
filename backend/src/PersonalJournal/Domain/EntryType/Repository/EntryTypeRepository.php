<?php
declare(strict_types=1);

namespace App\PersonalJournal\Domain\EntryType\Repository;

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;

interface EntryTypeRepository
{
    /** @return EntryType[] */
    public function active(int $userId): array;

    /** @return EntryType[] Todos los tipos del usuario, activos e inactivos, por sort_order. */
    public function all(int $userId): array;

    public function bySlug(string $slug, int $userId): ?EntryType;

    public function byId(int $id, int $userId): ?EntryType;

    public function save(EntryType $type): EntryType;

    public function deactivate(int $id, int $userId): bool;

    public function delete(int $id, int $userId): bool;

    public function slugExists(string $slug, int $excludeId, int $userId): bool;
}