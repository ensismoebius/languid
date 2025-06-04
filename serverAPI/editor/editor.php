<?php
// Include the necessary files
require_once '../isolate_config.php';
require_once '../AuthHandler.php';

// Set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-API-KEY");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if the user is authenticated as admin
function verifyAdmin()
{
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!preg_match('/Bearer\s(.*)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Authorization required"]);
        exit;
    }
    $token = $matches[1];
    $authHandler = new AuthHandler();
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
    $conn = connectDB();
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

// Connect to the database
function connectDB()
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// Get all exercise groups
function getExerciseGroups()
{
    $conn = connectDB();
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

// Get all exercises
function getExercises()
{
    $conn = connectDB();
    $sql = "SELECT id, title, instructions, testFileName, groupId FROM exercise ORDER BY id ASC";
    $result = $conn->query($sql);

    $exercises = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $exercises[] = $row;
        }
    }

    $conn->close();
    // Also return groups for the form
    $groups = getExerciseGroups();
    echo json_encode(["status" => "success", "exercises" => $exercises, "groups" => $groups]);
}

// Get specific exercise
function getExercise($id)
{
    $conn = connectDB();
    $stmt = $conn->prepare("SELECT id, title, instructions, testFileName, groupId FROM exercise WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Exercise not found"]);
        exit;
    }

    $exercise = $result->fetch_assoc();

    // Get the test file content
    $testFilePath = "../exercises/" . $exercise['testFileName'];
    if (file_exists($testFilePath)) {
        $exercise['testFileContent'] = file_get_contents($testFilePath);
    } else {
        $exercise['testFileContent'] = '';
    }

    $conn->close();
    // Also return groups for the form
    $groups = getExerciseGroups();
    echo json_encode(["status" => "success", "exercise" => $exercise, "groups" => $groups]);
}

// Create a new exercise
function createExercise()
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['title']) || !isset($data['instructions']) || !isset($data['testFileContent']) || !isset($data['groupId'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    $conn = connectDB();

    // Get the next available ID for the test file name
    $result = $conn->query("SELECT MAX(id) as max_id FROM exercise");
    $row = $result->fetch_assoc();
    $nextId = ($row['max_id'] ?? 0) + 1;
    $testFileName = $nextId . "_test.cpp";

    // Insert the new exercise
    $stmt = $conn->prepare("INSERT INTO exercise (title, instructions, testFileName, groupId) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $data['title'], $data['instructions'], $testFileName, $data['groupId']);

    if (!$stmt->execute()) {
        $conn->close();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to create exercise: " . $stmt->error]);
        exit;
    }

    $exerciseId = $conn->insert_id;

    // Save the test file
    $testFilePath = "../exercises/" . $testFileName;
    if (file_put_contents($testFilePath, $data['testFileContent']) === false) {
        // If file save fails, try to delete the exercise
        $conn->query("DELETE FROM exercise WHERE id = " . $exerciseId);
        $conn->close();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to save test file"]);
        exit;
    }

    $conn->close();
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Exercise created successfully",
        "exerciseId" => $exerciseId,
        "testFileName" => $testFileName
    ]);
}

// Update an existing exercise
function updateExercise($id)
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['title']) || !isset($data['instructions']) || !isset($data['testFileContent']) || !isset($data['groupId'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    $conn = connectDB();

    // Get the current test file name
    $stmt = $conn->prepare("SELECT testFileName FROM exercise WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Exercise not found"]);
        exit;
    }

    $exercise = $result->fetch_assoc();
    $testFileName = $exercise['testFileName'];

    // Update the exercise
    $stmt = $conn->prepare("UPDATE exercise SET title = ?, instructions = ?, groupId = ? WHERE id = ?");
    $stmt->bind_param("ssii", $data['title'], $data['instructions'], $data['groupId'], $id);

    if (!$stmt->execute()) {
        $conn->close();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to update exercise: " . $stmt->error]);
        exit;
    }

    // Save the test file
    $testFilePath = "../exercises/" . $testFileName;
    if (file_put_contents($testFilePath, $data['testFileContent']) === false) {
        $conn->close();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to save test file"]);
        exit;
    }

    $conn->close();
    echo json_encode([
        "status" => "success",
        "message" => "Exercise updated successfully"
    ]);
}

// Delete an exercise
function deleteExercise($id)
{
    $conn = connectDB();

    // Get the test file name
    $stmt = $conn->prepare("SELECT testFileName FROM exercise WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Exercise not found"]);
        exit;
    }

    $exercise = $result->fetch_assoc();
    $testFileName = $exercise['testFileName'];

    // Delete the exercise from the database
    $stmt = $conn->prepare("DELETE FROM exercise WHERE id = ?");
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        $conn->close();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to delete exercise: " . $stmt->error]);
        exit;
    }

    // Delete related user_exercise records
    $stmt = $conn->prepare("DELETE FROM user_exercise WHERE exerciseId = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    // Delete the test file
    $testFilePath = "../exercises/" . $testFileName;
    if (file_exists($testFilePath)) {
        if (!unlink($testFilePath)) {
            // Non-critical failure - we can still consider the exercise deleted
            error_log("Failed to delete test file: " . $testFilePath);
        }
    }

    $conn->close();
    echo json_encode([
        "status" => "success",
        "message" => "Exercise deleted successfully"
    ]);
}

// Main request handler
verifyAdmin(); // Verify admin status for all requests

$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', $path);
$endpoint = end($pathParts);

// Check if the endpoint contains an ID
$id = null;
if (is_numeric($endpoint)) {
    $id = intval($endpoint);
}

switch ($requestMethod) {
    case 'GET':
        if ($id !== null) {
            getExercise($id);
        } else {
            getExercises();
        }
        break;
    case 'POST':
        createExercise();
        break;
    case 'PUT':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Exercise ID is required"]);
            exit;
        }
        updateExercise($id);
        break;
    case 'DELETE':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Exercise ID is required"]);
            exit;
        }
        deleteExercise($id);
        break;
    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}