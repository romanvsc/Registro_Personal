<?php
declare(strict_types=1);

namespace App\PersonalJournal\Infrastructure\Persistence;

use App\PersonalJournal\Domain\EntryType\Entity\EntryType;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use PDO;

final readonly class PdoEntryTypeRepository implements EntryTypeRepository
{
    public function __construct(private PDO $pdo) {}

    public function active(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_types WHERE user_id = ? AND is_active = 1 ORDER BY sort_order, name');
        $stmt->execute([$userId]);
        return $this->hydrateAll($stmt->fetchAll());
    }

    public function all(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_types WHERE user_id = ? ORDER BY sort_order, name');
        $stmt->execute([$userId]);
        return $this->hydrateAll($stmt->fetchAll());
    }

    public function bySlug(string $slug, int $userId): ?EntryType
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_types WHERE user_id = ? AND slug = ? AND is_active = 1');
        $stmt->execute([$userId, $slug]);
        $row = $stmt->fetch();
        return $row ? $this->hydrateAll([$row])[0] : null;
    }

    public function byId(int $id, int $userId): ?EntryType
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entry_types WHERE user_id = ? AND id = ?');
        $stmt->execute([$userId, $id]);
        $row = $stmt->fetch();
        return $row ? $this->hydrateAll([$row])[0] : null;
    }

    public function save(EntryType $type): EntryType
    {
        $this->pdo->beginTransaction();

        try {
            $typeId = $this->upsertType($type);
            $this->rewriteFields($typeId, $type->fields);
            $this->pdo->commit();
        } catch (\Throwable $error) {
            $this->pdo->rollBack();
            throw $error;
        }

        return $this->byId($typeId, $type->userId) ?? $type;
    }

    public function deactivate(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare('UPDATE entry_types SET is_active = 0 WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM entry_types WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        return $stmt->rowCount() > 0;
    }

    public function slugExists(string $slug, int $excludeId, int $userId): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM entry_types WHERE user_id = ? AND slug = ? AND id <> ?');
        $stmt->execute([$userId, $slug, $excludeId]);
        return (int) $stmt->fetchColumn() > 0;
    }

    private function upsertType(EntryType $type): int
    {
        if ($type->id === 0) {
            $stmt = $this->pdo->prepare(
                'INSERT INTO entry_types (user_id, slug, name, icon, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $type->userId,
                $type->slug,
                $type->name,
                $type->icon,
                $type->isActive ? 1 : 0,
                $type->sortOrder,
            ]);
            return (int) $this->pdo->lastInsertId();
        }

        $stmt = $this->pdo->prepare(
            'UPDATE entry_types SET slug = ?, name = ?, icon = ?, is_active = ?, sort_order = ? WHERE id = ? AND user_id = ?'
        );
        $stmt->execute([
            $type->slug,
            $type->name,
            $type->icon,
            $type->isActive ? 1 : 0,
            $type->sortOrder,
            $type->id,
            $type->userId,
        ]);
        return $type->id;
    }

    private function rewriteFields(int $typeId, array $fields): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM entry_type_fields WHERE entry_type_id = ?');
        $stmt->execute([$typeId]);

        if ($fields === []) {
            return;
        }

        $insert = $this->pdo->prepare(
            'INSERT INTO entry_type_fields (entry_type_id, field_key, label, input_type, is_required, options_json, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($fields as $field) {
            $insert->execute([
                $typeId,
                $field['field_key'],
                $field['label'],
                $field['input_type'],
                $field['is_required'],
                $field['options_json'],
                $field['sort_order'],
            ]);
        }
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
        if ($rows === []) {
            return [];
        }

        $ids = array_map(static fn (array $row) => (int) $row['id'], $rows);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->pdo->prepare("SELECT * FROM entry_type_fields WHERE entry_type_id IN ($placeholders) ORDER BY sort_order, id");
        $stmt->execute($ids);

        $fieldsByType = [];
        foreach ($stmt->fetchAll() as $field) {
            $fieldsByType[(int) $field['entry_type_id']][] = $field;
        }

        return array_map(static fn (array $row) => new EntryType(
            (int) $row['id'],
            $row['slug'],
            $row['name'],
            $row['icon'],
            $fieldsByType[(int) $row['id']] ?? [],
            (bool) $row['is_active'],
            (int) $row['sort_order'],
            (int) $row['user_id'],
        ), $rows);
    }
}