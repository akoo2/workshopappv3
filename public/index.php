<?php

declare(strict_types=1);

// Disable display_errors in production; log to /storage/logs/error.log
ini_set('display_errors', '0');
ini_set('log_errors', '1');
$logDir = __DIR__ . '/../storage/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0750, true);
}
ini_set('error_log', $logDir . '/error.log');

require_once __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use App\Config\Database;
use App\Security\SessionHandler;
use App\Security\Csrf;
use App\Lang\Translator;
use App\Middleware\SecurityHeadersMiddleware;
use App\Middleware\CsrfMiddleware;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Controllers\AuthController;
use App\Controllers\StaffController;
use App\Controllers\DashboardController;

// Load .env
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (str_contains($line, '=')) {
            [$key, $val] = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($val, " \t\n\r\0\x0B\"'");
        }
    }
}

// Timezone convention: UTC stored internally
date_default_timezone_set('UTC');

// Custom MySQL/PDO session handler with secure cookie flags
$isHttps = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ||
           (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

session_set_cookie_params([
    'lifetime' => 30 * 86400, // 30 days absolute
    'path' => '/',
    'domain' => '',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Lax'
]);

$sessionHandler = new SessionHandler();
session_set_save_handler($sessionHandler, true);
session_start();

// Initialize Slim App
$app = AppFactory::create();

// Twig configuration
$twig = Twig::create(__DIR__ . '/../templates', ['cache' => false]);
$twig->getEnvironment()->addFunction(new \Twig\TwigFunction('trans', function (string $key, array $params = []) {
    return Translator::trans($key, $params);
}));
$twig->getEnvironment()->addGlobal('is_rtl', Translator::isRtl());
$twig->getEnvironment()->addGlobal('locale', Translator::getLocale());
$twig->getEnvironment()->addGlobal('user', $_SESSION['user_id'] ?? null ? [
    'id' => $_SESSION['user_id'],
    'name' => $_SESSION['name'] ?? '',
    'email' => $_SESSION['email'] ?? '',
    'role' => $_SESSION['role'] ?? '',
    'language' => $_SESSION['language'] ?? 'en'
] : null);

// Controllers
$authController = new AuthController($twig);
$staffController = new StaffController($twig);
$dashboardController = new DashboardController($twig);

// --- Public Routes ---
$app->get('/login', [$authController, 'showLogin']);
$app->post('/login', [$authController, 'login']);
$app->post('/logout', [$authController, 'logout']);

// Offline connection heartbeat ping (Rate-limited, unauthenticated/auth check)
$app->get('/api/heartbeat', [$authController, 'heartbeat'])->add(new AuthMiddleware(true));

// --- Authenticated Base Routes ---
$authenticated = new AuthMiddleware(false);

$app->get('/', [$dashboardController, 'index'])->add($authenticated);
$app->get('/dashboard', [$dashboardController, 'index'])->add($authenticated);

$app->get('/profile', [$authController, 'showProfile'])->add($authenticated);
$app->get('/profile/password', [$authController, 'showChangePassword'])->add($authenticated);
$app->post('/profile/password', [$authController, 'updatePassword'])->add($authenticated);
$app->post('/profile/language', [$authController, 'updateLanguage'])->add($authenticated);

// --- Staff Management Routes (OWNER only) ---
$ownerOnly = new RoleMiddleware(['OWNER']);

$app->get('/staff', [$staffController, 'index'])->add($ownerOnly)->add($authenticated);
$app->get('/staff/new', [$staffController, 'createForm'])->add($ownerOnly)->add($authenticated);
$app->post('/staff', [$staffController, 'create'])->add($ownerOnly)->add($authenticated);
$app->get('/staff/{id}', [$staffController, 'show'])->add($ownerOnly)->add($authenticated);
$app->post('/staff/{id}', [$staffController, 'update'])->add($ownerOnly)->add($authenticated);
$app->post('/staff/{id}/status', [$staffController, 'toggleStatus'])->add($ownerOnly)->add($authenticated);
$app->post('/staff/{id}/unlock', [$staffController, 'unlock'])->add($ownerOnly)->add($authenticated);
$app->post('/staff/{id}/reset-password', [$staffController, 'resetPassword'])->add($ownerOnly)->add($authenticated);
$app->post('/staff/{id}/sessions/revoke', [$staffController, 'revokeSessions'])->add($ownerOnly)->add($authenticated);
$app->post('/staff/{id}/notes', [$staffController, 'addNote'])->add($ownerOnly)->add($authenticated);

// --- Global Middlewares ---
$app->add(new CsrfMiddleware());
$app->add(TwigMiddleware::create($app, $twig));
$app->add(new SecurityHeadersMiddleware());

// Generic error handler (no stack trace or DB leaks to users)
$errorMiddleware = $app->addErrorMiddleware(false, true, true);
$errorMiddleware->setDefaultErrorHandler(function ($request, $exception, $displayErrorDetails, $logErrors, $logErrorDetails) use ($app, $twig) {
    error_log("Unhandled Exception: " . $exception->getMessage() . " in " . $exception->getFile() . ":" . $exception->getLine());
    $response = $app->getResponseFactory()->createResponse();
    
    $code = $exception->getCode();
    if ($code < 400 || $code > 599) {
        $code = 500;
    }

    $response->getBody()->write("
        <!DOCTYPE html>
        <html lang=\"en\">
        <head>
            <meta charset=\"UTF-8\">
            <title>Error</title>
            <script src=\"https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4\"></script>
        </head>
        <body class=\"bg-slate-50 text-slate-800 min-h-screen flex items-center justify-center p-4\">
            <div class=\"bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-md w-full text-center\">
                <h1 class=\"text-lg font-bold text-slate-900 mb-2\">An error occurred</h1>
                <p class=\"text-xs text-slate-500 mb-4\">The incident has been logged. Please try again or return to the main dashboard.</p>
                <a href=\"/\" class=\"inline-block py-2 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold\">Go to Dashboard</a>
            </div>
        </body>
        </html>
    ");
    return $response->withStatus($code)->withHeader('Content-Type', 'text/html; charset=UTF-8');
});

$app->run();
