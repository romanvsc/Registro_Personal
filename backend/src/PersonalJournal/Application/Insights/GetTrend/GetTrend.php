<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\Insights\GetTrend;

use App\PersonalJournal\Application\Insights\GetSummary\DateRange;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;

final readonly class GetTrend
{
    public function __construct(private JournalEntryRepository $entries) {}

    public function execute(int $userId, ?string $from = null, ?string $to = null, ?int $days = null): array
    {
        $windowDays = $days ?? 30;
        if ($windowDays < 1 || $windowDays > 365) {
            throw new \InvalidArgumentException('El parámetro days debe estar entre 1 y 365.');
        }
        [$fromDate, $toDate] = DateRange::resolveWindow($from, $to, $windowDays);

        return [
            'items' => $this->entries->trendForPeriod($userId, $fromDate, $toDate),
        ];
    }
}