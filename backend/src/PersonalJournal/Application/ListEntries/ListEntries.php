<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\ListEntries;

use App\PersonalJournal\Application\JournalEntryView;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use InvalidArgumentException;

final readonly class ListEntries
{
    public function __construct(
        private JournalEntryRepository $entries,
        private EntryTypeRepository $types,
        private int $defaultLimit = 30,
        private int $maxLimit = 100,
    ) {}

    public function execute(int $userId, int $page = 1, ?int $limit = null): array
    {
        if ($page < 1) {
            throw new InvalidArgumentException('La página debe ser mayor o igual a 1.');
        }
        $limit = $limit ?? $this->defaultLimit;
        if ($limit < 1 || $limit > $this->maxLimit) {
            throw new InvalidArgumentException("El límite debe estar entre 1 y {$this->maxLimit}.");
        }

        $types = [];
        foreach ($this->types->active() as $type) $types[$type->id] = $type;

        $total = $this->entries->countByUser($userId);
        $offset = ($page - 1) * $limit;

        $items = array_map(static fn ($entry) => JournalEntryView::from($entry, $types[$entry->typeId] ?? null), $this->entries->byPage($userId, $limit, $offset));

        return [
            'items' => $items,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => $total > 0 ? (int) ceil($total / $limit) : 0,
            ],
        ];
    }
}