<?php
declare(strict_types=1);

namespace App\IdentityAccess\Infrastructure\Session;

use App\IdentityAccess\Application\Port\SessionStore;

final class NativePhpSessionStore implements SessionStore
{
    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_name('registro_session');
            session_set_cookie_params([
                'lifetime' => 0, 'path' => '/', 'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
                'httponly' => true, 'samesite' => 'Lax',
            ]);
            session_start();
        }
    }
    public function authenticate(int $userId): void
    {
        session_regenerate_id(true);
        $_SESSION['identity_user_id'] = $userId;
    }
    public function authenticatedUserId(): ?int
    {
        $id = $_SESSION['identity_user_id'] ?? null;
        return is_int($id) || ctype_digit((string)$id) ? (int)$id : null;
    }
    public function clear(): void
    {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
    }
}
