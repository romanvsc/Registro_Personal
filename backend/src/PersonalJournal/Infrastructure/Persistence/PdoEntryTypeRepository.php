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
        return $this->hydrateAll($this->pdo->query('SELECT * FROM entry_types WHERE is_active = 1 ORDER BY sort_order, name')->fetchAll());
    }

    public function bySlug(string $slug): ?EntryType
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_types WHERE slug = ? AND is_active = 1');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ? $this->hydrateAll([$row])[0] : null;
    }

    public function byId(int $id): ?EntryType
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_types WHERE id = ? AND is_active = 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->hydrateAll([$row])[0] : null;
    }

    /**
     * Construye los agregados con una única consulta adicional de campos,
     * eliminando el patrón N+1.
     *
     * @param array<int, array<string, mixed>> $rows
     * @return EntryType[]
     */
    private function hydrateAll(array $rows): array
    {
        if ($rows === []) return [];

        $ids = array_map(static fn (array $row) => (int) $row['id'], $rows);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->pdo->prepare("SELECT * FROM entry_type_fields WHERE entry_type_id IN ($placeholders) ORDER BY sort_order, id");
        $stmt->execute($ids);

        $fieldsByType = [];
        foreach ($stmt->fetchAll() as $field) {
            $fieldsByType[(int) $field['entry_type_id']][] = $field;
        }

        return array_map(static fn (array $row) => new EntryType(
            (int) $row['id'], $row['slug'], $row['name'], $row['icon'],
            $fieldsByType[(int) $row['id']] ?? [],
        ), $rows);
    }
}