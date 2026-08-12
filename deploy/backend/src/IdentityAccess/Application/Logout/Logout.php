<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\Logout;

use App\IdentityAccess\Application\Port\SessionStore;

final readonly class Logout
{
    public function __construct(private SessionStore $sessions) {}
    public function execute(): void { $this->sessions->clear(); }
}
