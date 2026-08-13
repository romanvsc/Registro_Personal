<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application\Insights\GetSummary;

use DateTimeImmutable;
use InvalidArgumentException;

final readonly class DateRange
{
    /**
     * @return array{0: ?DateTimeImmutable, 1: ?DateTimeImmutable}
     */
    public static function parseRange(?string $from, ?string $to): array
    {
        $fromDate = $from !== null && $from !== '' ? self::parseDay($from, 'desde') : null;
        $toDate = $to !== null && $to !== '' ? self::parseDay($to, 'hasta') : null;

        if ($fromDate !== null && $toDate !== null && $fromDate > $toDate) {
            throw new InvalidArgumentException('La fecha "desde" no puede ser mayor que "hasta".');
        }

        return [$fromDate, $toDate];
    }

    /**
     * @return array{0: DateTimeImmutable, 1: DateTimeImmutable}
     */
    public static function resolveWindow(?string $from, ?string $to, int $days = 30): array
    {
        $fromDate = $from !== null && $from !== '' ? self::parseDay($from, 'desde') : null;
        $toDate = $to !== null && $to !== '' ? self::parseDay($to, 'hasta') : new DateTimeImmutable('today');

        if ($fromDate === null) {
            $fromDate = $toDate->modify('-' . ($days - 1) . ' days');
        }
        if ($fromDate > $toDate) {
            throw new InvalidArgumentException('La fecha "desde" no puede ser mayor que "hasta".');
        }

        return [$fromDate, $toDate];
    }

    private static function parseDay(string $value, string $label): DateTimeImmutable
    {
        $candidate = trim($value);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $candidate)) {
            throw new InvalidArgumentException("La fecha {$label} debe tener el formato AAAA-MM-DD.");
        }
        try {
            $date = new DateTimeImmutable($candidate);
        } catch (\Throwable) {
            throw new InvalidArgumentException("La fecha {$label} no es válida.");
        }
        if ($date->format('Y-m-d') !== $candidate) {
            throw new InvalidArgumentException("La fecha {$label} no es válida.");
        }
        return $date;
    }
}