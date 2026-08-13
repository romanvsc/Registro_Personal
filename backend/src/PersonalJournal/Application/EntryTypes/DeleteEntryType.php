<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\EntryTypes;

use App\PersonalJournal\Application\EntryNotFoundException;
use App\PersonalJournal\Application\EntryTypeView;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;

final readonly class DeleteEntryType
{
    public function __construct(
        private EntryTypeRepository $types,
        private JournalEntryRepository $entries,
    ) {}

    public function execute(int $userId, int $id): array
    {
        $type = $this->types->byId($id, $userId);
        if ($type === null) {
            throw new EntryNotFoundException('Tipo de registro no encontrado.');
        }

        if ($this->entries->countByUserAndType($userId, $id) > 0) {
            $deactivated = $this->types->save($type->deactivate());
            return ['type' => EntryTypeView::from($deactivated), 'deactivated' => true];
        }

        $this->types->delete($id, $userId);
        return ['type' => EntryTypeView::from($type), 'deleted' => true];
    }
}