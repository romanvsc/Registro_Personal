<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\Insights\GetComparison;

use App\PersonalJournal\Application\Insights\GetSummary\DateRange;
use App\PersonalJournal\Domain\JournalEntry\Repository\JournalEntryRepository;
use DateInterval;
use InvalidArgumentException;

final readonly class GetComparison
{
    public function __construct(private JournalEntryRepository $entries) {}

    public function execute(int $userId, ?string $from = null, ?string $to = null, ?string $period = null): array
    {
        if ($from !== null || $to !== null) {
            [$fromDate, $toDate] = DateRange::parseRange($from, $to);
            $fromDate ??= (new \DateTimeImmutable('today'))->modify('-29 days');
            $toDate ??= new \DateTimeImmutable('today');
        } else {
            $interval = match ($period) {
                'week' => new DateInterval('P7D'),
                'month', null => new DateInterval('P30D'),
                default => throw new InvalidArgumentException('El parámetro period debe ser week o month.'),
            };
            $toDate = new \DateTimeImmutable('today');
            $fromDate = $toDate->sub($interval)->modify('+1 day');
        }

        $span = $fromDate->diff($toDate);
        $prevTo = $fromDate->modify('-1 day');
        $prevFrom = $prevTo->sub($span);

        $current = $this->toComparisonShape($this->entries->periodForComparison($userId, $fromDate, $toDate));
        $previous = $this->toComparisonShape($this->entries->periodForComparison($userId, $prevFrom, $prevTo));

        $difference = null;
        if ($current['averageScore'] > 0 && $previous['averageScore'] > 0) {
            $percentage = round(($current['averageScore'] - $previous['averageScore']) / $previous['averageScore'] * 100, 2);
            $difference = [
                'averageScore' => round($current['averageScore'] - $previous['averageScore'], 1),
                'percentage' => $percentage,
            ];
        } elseif ($current['averageScore'] > 0 && $previous['averageScore'] === 0) {
            $difference = ['averageScore' => $current['averageScore'], 'percentage' => null];
        }

        return [
            'current' => $current,
            'previous' => $previous,
            'difference' => $difference,
        ];
    }

    private function toComparisonShape(array $period): array
    {
        return [
            'averageScore' => $period['average'],
            'entries' => $period['total'],
        ];
    }
}