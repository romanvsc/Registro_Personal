<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\EntryTypes;

use App\PersonalJournal\Application\EntryNotFoundException;
use App\PersonalJournal\Application\EntryTypeView;
use App\PersonalJournal\Domain\EntryType\Repository\EntryTypeRepository;

final readonly class GetEntryType
{
    public function __construct(private EntryTypeRepository $types) {}

    public function execute(int $userId, int $id): array
    {
        $type = $this->types->byId($id, $userId);
        if ($type === null) {
            throw new EntryNotFoundException('Tipo de registro no encontrado.');
        }

        return ['type' => EntryTypeView::from($type)];
    }
}