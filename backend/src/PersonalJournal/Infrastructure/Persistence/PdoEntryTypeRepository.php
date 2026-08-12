<?php
declare(strict_types=1);

namespace App\PersonalJournal\Infrastructure\Persistence;

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use PDO;

final readonly class PdoEntryTypeRepository implements EntryTypeRepository
{
    public function __construct(private PDO $pdo) {}

    public function active(): array
    {
        $rows = $this->pdo->query('SELECT * FROM entry_types WHERE is_active = 1 ORDER BY sort_order, name')->fetchAll();
        return array_map(fn (array $row) => $this->hydrate($row), $rows);
    }

    public function bySlug(string $slug): ?EntryType
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_types WHERE slug = ? AND is_active = 1');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ? $this->hydrate($row) : null;
    }

    public function byId(int $id): ?EntryType
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_types WHERE id = ? AND is_active = 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->hydrate($row) : null;
    }

    private function hydrate(array $row): EntryType
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_type_fields WHERE entry_type_id = ? ORDER BY sort_order, id');
        $stmt->execute([(int) $row['id']]);
        return new EntryType((int) $row['id'], $row['slug'], $row['name'], $row['icon'], $stmt->fetchAll());
    }
}
