<?php
require_once 'CodeTester.php';
require_once 'AuthHandler.php';
require_once 'isolate_config.php';

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
            case 'GET':
                $this->handleGetRequest();
                break;
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

    private function sanitizeInput($input)
    {
        if (is_array($input)) {
            foreach ($input as $key => $value) {
                if ($key === 'code') {
                    continue; // Skip sanitizing the code field 
                }
                $input[$key] = $this->sanitizeInput($value);
            }
        } else {
            $input = htmlspecialchars(strip_tags($input));
        }
        return $input;
    }

    private function handlePostRequest()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input) {
            echo json_encode(
                [
                    "status" => "error",
                    "message" => "Invalid JSON data"
                ]
            );
            exit;
        }

        $input = $this->sanitizeInput($input);

        if (isset($input['username']) && isset($input['password'])) {
            $result = $this->handleLogin($input['username'], $input['password']);
            echo json_encode($result);
            exit;
        }

        $code = $input["code"] ?? "";
        $exercise = $input["exercise"] ?? "-1";

        $tester = new CodeTester();
        $tester->setCodeAndExercise($code, $exercise);
        $testResult = $tester->runTests();

        $response = [
            "message" => $testResult ?? "No output",
            "status" => is_null($testResult) ? "fail" : "success"
        ];

        echo json_encode($response);
        exit;
    }

    private function handleGetRequest()
    {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
            exit;
        }

        $sql = "SELECT id, title, instructions, testFileName FROM exercise";
        $result = $conn->query($sql);
        $exercises = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $exercises[] = $row;
            }
        }
        $conn->close();
        echo json_encode(["status" => "success", "exercises" => $exercises]);
        exit;
    }

    private function handleLogin($username, $password)
    {
        $authHandler = new AuthHandler();
        $connectionMessage = $authHandler->connect();

        if ($connectionMessage !== "Connected successfully") {
            http_response_code(500);
            return json_encode(
                [
                    "status" => "error",
                    "message" => $connectionMessage
                ]
            );
        }

        $token = $authHandler->authenticate($username, $password);

        if ($token) {
            return json_encode(
                [
                    "status" => "success",
                    "token" => $token
                ]
            );
        } else {
            http_response_code(401);
            return json_encode(
                [
                    "status" => "error",
                    "message" => "Invalid credentials"
                ]
            );
        }
    }
}

// Instantiate and handle the request
$apiExercisesHandler = new APIExercisesHandler();
$apiExercisesHandler->handleRequest();