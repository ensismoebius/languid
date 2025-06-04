<?php
namespace Languid\Controller;

use GuzzleHttp\Psr7\Response;
use Languid\Lib\HttpHelper;
use Languid\Lib\Database;

class EditorController
{

    public static function open($request, $params)
    {
        // Render the editor HTML file using Twig and AssetExtension
        $viewDir = __DIR__ . '/../View';
        $templateFile = 'index.html';
        if (!file_exists($viewDir . '/' . $templateFile)) {
            return new Response(404, [], 'Editor not found');
        }

        // Twig setup
        $loader = new \Twig\Loader\FilesystemLoader($viewDir);
        $twig = new \Twig\Environment($loader);

        // Register AssetExtension (res() function)
        $assetBasePath = '/languid/serverAPI/src/View';
        // Try both namespaces for AssetExtension
        if (class_exists('Src\\Lib\\TwigPlugin\\AssetExtension')) {
            $twig->addExtension(new \Src\Lib\TwigPlugin\AssetExtension($assetBasePath));
        } elseif (class_exists('Languid\\Lib\\TwigPlugin\\AssetExtension')) {
            $twig->addExtension(new \Languid\Lib\TwigPlugin\AssetExtension($assetBasePath));
        }

        $html = $twig->render($templateFile);
        return new Response(200, ['Content-Type' => 'text/html'], $html);
    }

    // --- API logic from old editor.php ---
    public static function api($request, $params)
    {
        // Only allow authenticated admins
        self::verifyAdmin($request);

        $method = $request->getMethod();
        $path = $request->getUri()->getPath();
        $pathParts = explode('/', trim($path, '/'));
        $endpoint = end($pathParts);
        $id = is_numeric($endpoint) ? intval($endpoint) : null;

        switch ($method) {
            case 'GET':
                if ($id !== null) {
                    return self::getExercise($id);
                } else {
                    return self::getExercises();
                }
            case 'POST':
                return self::createExercise();
            case 'PUT':
                if ($id === null) {
                    return new Response(400, [], json_encode(["status" => "error", "message" => "Exercise ID is required"]));
                }
                return self::updateExercise($id);
            case 'DELETE':
                if ($id === null) {
                    return new Response(400, [], json_encode(["status" => "error", "message" => "Exercise ID is required"]));
                }
                return self::deleteExercise($id);
            default:
                return new Response(405, [], json_encode(["status" => "error", "message" => "Method not allowed"]));
        }
    }

    // --- Helper methods (migrated from editor.php) ---
    private static function verifyAdmin($request)
    {
        $token = HttpHelper::getBearerToken($request);
        if (!$token) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Authorization required"]);
            exit;
        }
        $authHandler = new \Languid\Lib\AuthHandler();
        $authHandler->connect();
        if (!$authHandler->verifyToken($token)) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Unauthorized"]);
            exit;
        }
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid token format"]);
            exit;
        }
        list($encodedPayload, $encodedSignature) = $parts;
        $payloadJson = base64_decode(strtr($encodedPayload, '-_', '+/'));
        $payload = json_decode($payloadJson, true);
        $userId = $payload['sub'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid token content"]);
            exit;
        }
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT admin FROM user WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            $conn->close();
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "User not found"]);
            exit;
        }
        $user = $result->fetch_assoc();
        $conn->close();
        if ($user['admin'] != 1) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Administrator access required"]);
            exit;
        }
        return true;
    }

    private static function connectDB()
    {
        return Database::getInstance()->getConnection();
    }

    private static function getExerciseGroups()
    {
        $conn = self::connectDB();
        $sql = "SELECT id, name, description FROM exerciseGroup ORDER BY id ASC";
        $result = $conn->query($sql);
        $groups = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $groups[] = $row;
            }
        }
        $conn->close();
        return $groups;
    }

    private static function getExercises()
    {
        $conn = self::connectDB();
        $sql = "SELECT id, title, instructions, testFileName, groupId FROM exercise ORDER BY id ASC";
        $result = $conn->query($sql);
        $exercises = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $exercises[] = $row;
            }
        }
        $conn->close();
        $groups = self::getExerciseGroups();
        return new Response(200, [], json_encode(["status" => "success", "exercises" => $exercises, "groups" => $groups]));
    }

    private static function getExercise($id)
    {
        $conn = self::connectDB();
        $stmt = $conn->prepare("SELECT id, title, instructions, testFileName, groupId FROM exercise WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            $conn->close();
            return new Response(404, [], json_encode(["status" => "error", "message" => "Exercise not found"]));
        }
        $exercise = $result->fetch_assoc();
        $testFilePath = __DIR__ . '/../../../exercises/' . $exercise['testFileName'];
        if (file_exists($testFilePath)) {
            $exercise['testFileContent'] = file_get_contents($testFilePath);
        } else {
            $exercise['testFileContent'] = '';
        }
        $conn->close();
        $groups = self::getExerciseGroups();
        return new Response(200, [], json_encode(["status" => "success", "exercise" => $exercise, "groups" => $groups]));
    }

    private static function createExercise()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['title']) || !isset($data['instructions']) || !isset($data['testFileContent']) || !isset($data['groupId'])) {
            return new Response(400, [], json_encode(["status" => "error", "message" => "Missing required fields"]));
        }
        $conn = self::connectDB();
        $result = $conn->query("SELECT MAX(id) as max_id FROM exercise");
        $row = $result->fetch_assoc();
        $nextId = ($row['max_id'] ?? 0) + 1;
        $testFileName = $nextId . "_test.cpp";
        $stmt = $conn->prepare("INSERT INTO exercise (title, instructions, testFileName, groupId) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $data['title'], $data['instructions'], $testFileName, $data['groupId']);
        if (!$stmt->execute()) {
            $conn->close();
            return new Response(500, [], json_encode(["status" => "error", "message" => "Failed to create exercise: " . $stmt->error]));
        }
        $exerciseId = $conn->insert_id;
        $testFilePath = __DIR__ . '/../../../exercises/' . $testFileName;
        if (file_put_contents($testFilePath, $data['testFileContent']) === false) {
            $conn->query("DELETE FROM exercise WHERE id = " . $exerciseId);
            $conn->close();
            return new Response(500, [], json_encode(["status" => "error", "message" => "Failed to save test file"]));
        }
        $conn->close();
        return new Response(201, [], json_encode([
            "status" => "success",
            "message" => "Exercise created successfully",
            "exerciseId" => $exerciseId,
            "testFileName" => $testFileName
        ]));
    }

    private static function updateExercise($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['title']) || !isset($data['instructions']) || !isset($data['testFileContent']) || !isset($data['groupId'])) {
            return new Response(400, [], json_encode(["status" => "error", "message" => "Missing required fields"]));
        }
        $conn = self::connectDB();
        $stmt = $conn->prepare("SELECT testFileName FROM exercise WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            $conn->close();
            return new Response(404, [], json_encode(["status" => "error", "message" => "Exercise not found"]));
        }
        $exercise = $result->fetch_assoc();
        $testFileName = $exercise['testFileName'];
        $stmt = $conn->prepare("UPDATE exercise SET title = ?, instructions = ?, groupId = ? WHERE id = ?");
        $stmt->bind_param("ssii", $data['title'], $data['instructions'], $data['groupId'], $id);
        if (!$stmt->execute()) {
            $conn->close();
            return new Response(500, [], json_encode(["status" => "error", "message" => "Failed to update exercise: " . $stmt->error]));
        }
        $testFilePath = __DIR__ . '/../../../exercises/' . $testFileName;
        if (file_put_contents($testFilePath, $data['testFileContent']) === false) {
            $conn->close();
            return new Response(500, [], json_encode(["status" => "error", "message" => "Failed to save test file"]));
        }
        $conn->close();
        return new Response(200, [], json_encode([
            "status" => "success",
            "message" => "Exercise updated successfully"
        ]));
    }

    private static function deleteExercise($id)
    {
        $conn = self::connectDB();
        $stmt = $conn->prepare("SELECT testFileName FROM exercise WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            $conn->close();
            return new Response(404, [], json_encode(["status" => "error", "message" => "Exercise not found"]));
        }
        $exercise = $result->fetch_assoc();
        $testFileName = $exercise['testFileName'];
        $stmt = $conn->prepare("DELETE FROM exercise WHERE id = ?");
        $stmt->bind_param("i", $id);
        if (!$stmt->execute()) {
            $conn->close();
            return new Response(500, [], json_encode(["status" => "error", "message" => "Failed to delete exercise: " . $stmt->error]));
        }
        $stmt = $conn->prepare("DELETE FROM user_exercise WHERE exerciseId = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $testFilePath = __DIR__ . '/../../../exercises/' . $testFileName;
        if (file_exists($testFilePath)) {
            if (!unlink($testFilePath)) {
                error_log("Failed to delete test file: " . $testFilePath);
            }
        }
        $conn->close();
        return new Response(200, [], json_encode([
            "status" => "success",
            "message" => "Exercise deleted successfully"
        ]));
    }

    // You can add more methods here for API endpoints (CRUD) if needed
}
