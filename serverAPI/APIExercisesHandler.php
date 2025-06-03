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

    // Helper: send error response and exit
    private function sendError($message, $statusCode = 400, $status = "error")
    {
        http_response_code($statusCode);
        echo json_encode(["status" => $status, "message" => $message]);
        exit;
    }

    // Helper: send success response and exit
    private function sendSuccess($data)
    {
        echo json_encode(["status" => "success"] + $data);
        exit;
    }

    // Helper: get DB connection or send error
    private function getDbConnection()
    {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            $this->sendError("Database connection failed: " . $conn->connect_error, 500);
        }
        return $conn;
    }

    // Helper: decode JWT payload from token
    private function getPayloadFromToken($token)
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            $this->sendError("Invalid token format", 401);
        }
        list($encodedPayload, $encodedSignature) = $parts;
        $payloadJson = base64_decode(strtr($encodedPayload, '-_', '+/'));
        $payload = json_decode($payloadJson, true);
        if (!$payload) {
            $this->sendError("Invalid token payload", 401);
        }
        return $payload;
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

    private function getBearerToken()
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (preg_match('/Bearer\s(.*)/', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function requireValidToken()
    {
        $token = $this->getBearerToken();
        if (!$token) {
            $this->sendError("Missing or invalid Authorization header", 401);
        }
        $authHandler = new AuthHandler();
        $authHandler->connect();
        if (!$authHandler->verifyToken($token)) {
            $this->sendError("Token expired or invalid", 401, "expired");
        }
    }

    private function handlePostRequest()
    {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) {
            $this->sendError("Invalid JSON data");
        }
        $input = $this->sanitizeInput($input);
        if (isset($input['username']) && isset($input['password'])) {
            $result = $this->handleLogin($input['username'], $input['password']);
            echo $result;
            exit;
        }
        $this->requireValidToken();

        $code = $input["code"] ?? "";
        $exercise = $input["exercise"] ?? "";
        $exerciseId = $input["exerciseId"] ?? "0";
        $token = $this->getBearerToken();
        $payload = $this->getPayloadFromToken($token);
        $loginId = $payload['sub'] ?? null;

        $tester = new CodeTester();
        $tester->setCodeAndExercise($code, $exercise);
        $testResult = $tester->runTests();

        // Checks if the tests were executed successfully
        // If not, we return the error message
        if (!$testResult->success) {
            $this->sendError($testResult->value, 200, "fail");
        }

        // If the code has been executed but returned an error
        // message,then we return the error message
        $codeExecutionResult = json_decode($testResult->value);
        if (is_null($codeExecutionResult)) {
            $this->sendError($testResult->value, 200, "fail");
        }

        // If the code has been executed successfully and
        // the tests have passed, we handle the exercise done
        // and return the result of the code execution
        if (
            $codeExecutionResult->failures == 0 &&
            $loginId !== null &&
            $exerciseId !== "0"
        ) {
            $this->handleExerciseDone($loginId, $exerciseId, $code);
        }

        // Return the result of the code execution
        // If the code gets to here, it means that the code
        // has been executed successfully, but the tests has
        // failed. We still want to return the result of the
        // code execution, so we return the value of the test
        // result, which is the output of the code execution.
        $this->sendSuccess(["message" => $testResult->value]);
    }

    private function handleExerciseDone($loginId, $exerciseId, $code)
    {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            return;
        }
        $loginId = intval($loginId);
        $exerciseId = intval($exerciseId);
        $stmt = $conn->prepare("INSERT INTO user_exercise (loginId, exerciseId, done, code) VALUES (?, ?, 1, ?) ON DUPLICATE KEY UPDATE done=1, code=VALUES(code)");
        if ($stmt) {
            $stmt->bind_param("iis", $loginId, $exerciseId, $code);
            $stmt->execute();
            $stmt->close();
        }
        $conn->close();
    }

    private function handleGetRequest()
    {
        $conn = $this->getDbConnection();
        $payload = $this->getPayloadFromToken($this->getBearerToken());
        $loginId = intval($payload['sub'] ?? 0);

        // $sql = "SELECT E.id, E.title, E.testfilename, E.instructions, E.groupId, COALESCE(UE.done, 0) as done, UE.code FROM exercise as E LEFT JOIN user_exercise as UE ON E.id = UE.exerciseid AND UE.loginid = $loginId";

        $sql = "SELECT E.id, E.title, E.testfilename, E.instructions, E.groupId, COALESCE(UE.done, 0) as done, UE.code FROM exercise as E LEFT JOIN user_exercise as UE ON E.id = UE.exerciseid AND UE.loginid = $loginId WHERE E.groupId = ( SELECT groupId FROM user  WHERE id = $loginId LIMIT 1 )";

        $result = $conn->query($sql);
        $exercises = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $exercises[] = $row;
            }
        }
        $conn->close();
        $this->sendSuccess(["exercises" => $exercises]);
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