<?php
declare(strict_types=1);
namespace App\IdentityAccess\Infrastructure\Persistence;
use App\IdentityAccess\Application\Port\TransactionManager;
use PDO;
use Throwable;
final readonly class PdoTransactionManager implements TransactionManager
{
    public function __construct(private PDO $pdo) {}
    public function run(callable $operation): mixed
    {
        $ownsTransaction = !$this->pdo->inTransaction();
        if ($ownsTransaction) $this->pdo->beginTransaction();
        try {
            $result = $operation();
            if ($ownsTransaction) $this->pdo->commit();
            return $result;
        } catch (Throwable $error) {
            if ($ownsTransaction && $this->pdo->inTransaction()) $this->pdo->rollBack();
            throw $error;
        }
    }
}
