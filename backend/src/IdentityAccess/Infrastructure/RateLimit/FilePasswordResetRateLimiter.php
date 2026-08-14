<?php
declare(strict_types=1);
namespace App\IdentityAccess\Infrastructure\RateLimit;
use App\IdentityAccess\Application\ForgotPassword\RateLimitExceeded;
use App\IdentityAccess\Application\Port\PasswordResetRateLimiter;
final readonly class FilePasswordResetRateLimiter implements PasswordResetRateLimiter
{
    public function __construct(private string $directory, private int $maxAttempts = 5, private int $windowSeconds = 900) {}
    public function consume(string $clientIp, string $normalizedEmail): void
    {
        if (!is_dir($this->directory) && !mkdir($this->directory, 0700, true) && !is_dir($this->directory)) throw new \RuntimeException('No se pudo preparar el rate limit.');
        $path = $this->directory . DIRECTORY_SEPARATOR . hash('sha256', $clientIp . '|' . $normalizedEmail) . '.json';
        $handle = fopen($path, 'c+');
        if ($handle === false) throw new \RuntimeException('No se pudo comprobar el rate limit.');
        try {
            if (!flock($handle, LOCK_EX)) throw new \RuntimeException('No se pudo bloquear el rate limit.');
            $raw = stream_get_contents($handle);
            $timestamps = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
            $now = time();
            $windowStart = $now - $this->windowSeconds;
            $timestamps = array_values(array_filter(is_array($timestamps) ? $timestamps : [], static fn($time) => is_int($time) && $time > $windowStart));
            if (count($timestamps) >= $this->maxAttempts) throw new RateLimitExceeded('Demasiadas solicitudes. Intentá nuevamente más tarde.');
            $timestamps[] = $now;
            ftruncate($handle, 0); rewind($handle); fwrite($handle, json_encode($timestamps)); fflush($handle);
        } finally { flock($handle, LOCK_UN); fclose($handle); }
    }
}
