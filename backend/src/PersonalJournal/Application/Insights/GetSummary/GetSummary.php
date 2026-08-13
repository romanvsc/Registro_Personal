<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\Insights\GetSummary;

use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use InvalidArgumentException;

final readonly class GetSummary
{
    public function __construct(private JournalEntryRepository $entries) {}

    public function execute(int $userId, ?string $from = null, ?string $to = null): array
    {
        [$fromDate, $toDate] = DateRange::parseRange($from, $to);

        $summary = $this->entries->summaryForUser($userId, $fromDate, $toDate);
        $byType = $this->entries->breakdownByType($userId, $fromDate, $toDate);

        return [
            'period' => [
                'from' => $fromDate?->format('Y-m-d'),
                'to' => $toDate?->format('Y-m-d'),
            ],
            'totalEntries' => $summary['total'],
            'averageScore' => $summary['average'],
            'highestScore' => $summary['max'],
            'lowestScore' => $summary['min'],
            'byType' => $byType,
        ];
    }
}