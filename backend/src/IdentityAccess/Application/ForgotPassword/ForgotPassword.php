<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\ForgotPassword;
use App\IdentityAccess\Application\Port\Clock;
use App\IdentityAccess\Application\Port\PasswordResetMailer;
use App\IdentityAccess\Application\Port\PasswordResetRateLimiter;
use App\IdentityAccess\Application\Port\TokenGenerator;
use App\IdentityAccess\Application\Port\TransactionManager;
use App\IdentityAccess\Domain\PasswordReset\Repository\PasswordResetTokenRepository;
use App\IdentityAccess\Domain\User\Repository\UserRepository;
use App\IdentityAccess\Domain\User\ValueObject\Email;
use DateInterval;
use InvalidArgumentException;
use Throwable;

final readonly class ForgotPassword
{
    public const MESSAGE = 'Si existe una cuenta asociada a ese correo, te enviaremos instrucciones para restablecer tu contraseña.';

    public function __construct(
        private UserRepository $users,
        private PasswordResetTokenRepository $tokens,
        private TokenGenerator $tokenGenerator,
        private PasswordResetMailer $mailer,
        private PasswordResetRateLimiter $rateLimiter,
        private Clock $clock,
        private TransactionManager $transactions,
        private string $appUrl,
    ) {}

    public function execute(string $rawEmail, string $clientIp): string
    {
        try { $email = new Email($rawEmail); }
        catch (InvalidArgumentException) { $email = null; }
        $rateKey = $email?->value ?? strtolower(trim($rawEmail));
        $this->rateLimiter->consume($clientIp, hash('sha256', $rateKey));
        if ($email === null || ($user = $this->users->findByEmail($email)) === null || $user->id === null) return self::MESSAGE;

        $plainToken = $this->tokenGenerator->generate();
        $now = $this->clock->now();
        $this->transactions->run(function () use ($user, $plainToken, $now): void {
            $this->tokens->invalidateForUser($user->id, $now);
            $this->tokens->create($user->id, hash('sha256', $plainToken), $now->add(new DateInterval('PT60M')));
        });
        $url = rtrim($this->appUrl, '/') . '/restablecer-contrasena?token=' . rawurlencode($plainToken);
        try { $this->mailer->send($user->email->value, $user->name, $url); }
        catch (Throwable) { return self::MESSAGE; }
        return self::MESSAGE;
    }
}
