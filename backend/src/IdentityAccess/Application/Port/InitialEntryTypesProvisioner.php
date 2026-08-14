<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\Port;
interface InitialEntryTypesProvisioner { public function provisionFor(int $userId): void; }
