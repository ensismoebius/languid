<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';

use Languid\Lib\Router;
use Languid\Controller\AuthController;
use Languid\Controller\ExerciseController;
use Languid\Controller\PDFController;
use Languid\Controller\PreflightController;
use GuzzleHttp\Psr7\ServerRequest;
use GuzzleHttp\Psr7\Response;
use Languid\Lib\HttpHelper;

// Set CORS and content headers using HttpHelper
HttpHelper::setDefaultHeaders();

$router = new Router();

// Register a catch-all OPTIONS handler for CORS preflight
$router->add('OPTIONS', '/{any}', [PreflightController::class, 'handle']);

// Auth routes
$router->add('POST', '/login', [AuthController::class, 'login']);

// Exercise routes
$router->add('GET', '/exercises', [ExerciseController::class, 'list']);
$router->add('POST', '/exercises/submit', [ExerciseController::class, 'submit']);

// PDF export route
$router->add('GET', '/pdf/user/{userId}', [PDFController::class, 'userExercisesPDF']);

// Dispatch
$request = ServerRequest::fromGlobals();
$response = $router->dispatch($request);

// Output response
http_response_code($response->getStatusCode());

foreach ($response->getHeaders() as $name => $values) {
    foreach ($values as $value) {
        header(sprintf('%s: %s', $name, $value), false);
    }
}

echo $response->getBody();