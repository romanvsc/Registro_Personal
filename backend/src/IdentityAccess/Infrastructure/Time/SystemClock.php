<?php
declare(strict_types=1);
namespace App\IdentityAccess\Infrastructure\Time;
use App\IdentityAccess\Application\Port\Clock;
use DateTimeImmutable;
final class SystemClock implements Clock { public function now(): DateTimeImmutable { return new DateTimeImmutable('now'); } }
