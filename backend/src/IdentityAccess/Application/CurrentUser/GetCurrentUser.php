<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application\CurrentUser;

use App\IdentityAccess\Application\Port\SessionStore;
use App\IdentityAccess\Domain\User\Repository\UserRepository;

final readonly class GetCurrentUser
{
    public function __construct(private UserRepository $users, private SessionStore $sessions) {}

    /** @return array{id:int,name:string,email:string}|null */
    public function execute(): ?array
    {
        $id = $this->sessions->authenticatedUserId();
        if ($id === null || ($user = $this->users->findById($id)) === null) return null;
        try { $user->ensureCanAuthenticate(); } catch (\DomainException) { $this->sessions->clear(); return null; }
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email->value];
    }
}
