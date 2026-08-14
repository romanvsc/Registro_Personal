<?php
declare(strict_types=1);

namespace App\IdentityAccess\Application;

use App\IdentityAccess\Domain\User\Entity\User;
use RuntimeException;

final readonly class UserView
{
    /** @return array{id:int,name:string,email:string,avatarKey:?string,biography:string} */
    public static function from(User $user): array
    {
        if ($user->id === null) throw new RuntimeException('El usuario todavía no fue persistido.');
        return [
            'id' => $user->id,
            'name' => $user->name->value,
            'email' => $user->email->value,
            'avatarKey' => $user->avatarKey?->value,
            'biography' => $user->biography->value,
        ];
    }
}
