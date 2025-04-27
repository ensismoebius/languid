<?php
require_once('CodeTester.php');
require_once('AuthHandler.php'); // Include the new AuthHandler class

class APIExercisesHandler
{
    const API_KEY = "re98wr6ew8r6rew76r89e6rwer6w98r6ywe9r6r6w87e9wr6ew06r7";

    public function handleRequest()
    {
        $this->setHeaders();

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        if (!$this->validateAPIKey()) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Forbidden: Invalid API Key"]);
            exit;
        }

        switch ($_SERVER['REQUEST_METHOD']) {
            case 'POST':
                $this->handlePostRequest();
                break;
            default:
                http_response_code(405);
                echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
                exit;
        }
    }

    private function setHeaders()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-API-KEY");
        header("Content-Type: application/json");
    }

    private function validateAPIKey()
    {
        $headers = getallheaders();
        $receivedKey = $headers['X-API-KEY'] ?? $headers['x-api-key'] ?? '';
        return $receivedKey === self::API_KEY;
    }

    private function handlePostRequest()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input) {
            echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
            exit;
        }

        if (isset($input['username']) && isset($input['password'])) {
            $this->handleLogin($input['username'], $input['password']);
            return;
        }

        $code = $input["code"] ?? "";
        $exercise = $input["exercise"] ?? "-1";

        $tester = new CodeTester();
        $tester->setCodeAndExercise($code, $exercise);
        $testResult = $tester->runTests();

        $response = [
            "message" => $testResult,
            "status" => "success"
        ];
        echo json_encode($response);
        exit;
    }

    private function handleLogin($username, $password)
    {
        $authHandler = new AuthHandler();
        $token = $authHandler->authenticate($username, $password);

        if ($token) {
            echo json_encode(["status" => "success", "token" => $token]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
        }
        exit;
    }
}

// Instantiate and handle the request
$apiExercisesHandler = new APIExercisesHandler();
$apiExercisesHandler->handleRequest();

