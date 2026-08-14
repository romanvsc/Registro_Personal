<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\Port;
interface TokenGenerator { public function generate(): string; }
