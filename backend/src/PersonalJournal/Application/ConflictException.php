<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application;

use RuntimeException;

/**
 * Indica un conflicto de estado o unicidad (por ejemplo, slug duplicado).
 * Se traduce siempre a HTTP 409.
 */
final class ConflictException extends RuntimeException
{
}
