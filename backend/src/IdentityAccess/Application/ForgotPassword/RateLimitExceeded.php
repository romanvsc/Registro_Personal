<?php
declare(strict_types=1);
namespace App\IdentityAccess\Application\ForgotPassword;
use RuntimeException;
final class RateLimitExceeded extends RuntimeException {}
