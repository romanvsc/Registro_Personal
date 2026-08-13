<?php
declare(strict_types=1);

namespace App\PersonalJournal\Application;

use RuntimeException;

/**
 * Indica que el registro no existe o no pertenece al usuario autenticado.
 * Se traduce siempre a HTTP 404 para no revelar la existencia de registros ajenos.
 */
final class EntryNotFoundException extends RuntimeException
{
}