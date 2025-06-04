<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';

use Languid\Lib\Router;
use Languid\Controller\AuthController;
use Languid\Controller\ExerciseController;
use Languid\Controller\PDFController;
use GuzzleHttp\Psr7\ServerRequest;
use GuzzleHttp\Psr7\Response;

// Set CORS and content headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-API-KEY");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$router = new Router();

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