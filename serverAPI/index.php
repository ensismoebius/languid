<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';

use Languid\Lib\Router;
use Languid\Lib\HttpHelper;
use Languid\Controller\PDFController;
use Languid\Controller\AuthController;
use Languid\Controller\EditorController;
use Languid\Controller\ExerciseController;
use Languid\Controller\PreflightController;

use Languid\Lib\ServerRequest;

// Set CORS and content headers using HttpHelper
HttpHelper::setDefaultHeaders();

$router = new Router(WEBSITE_ROOT_PATH);

// Register a catch-all OPTIONS handler for CORS preflight
$router->add('OPTIONS', '/{any}', [PreflightController::class, 'handle']);

// Auth routes
$router->add('POST', '/login', [AuthController::class, 'login']);

// Editor route (serves the HTML editor UI)
$router->add('GET', '/editor', [EditorController::class, 'open']);

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