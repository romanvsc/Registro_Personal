<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\Port;
interface TransactionManager { public function run(callable $operation): mixed; }
