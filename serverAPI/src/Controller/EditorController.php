use Languid\Model\ExerciseAdminModel;
<?php
namespace Languid\Controller;

use GuzzleHttp\Psr7\Response;
use Languid\Lib\HttpHelper;
use Languid\Model\AdminModel;
use Languid\Model\ExerciseAdminModel;
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
                    return ExerciseAdminModel::getExercise($id);
                } else {
                    return ExerciseAdminModel::getExercises();
                }
            case 'POST':
                $data = json_decode(file_get_contents("php://input"), true);
                return ExerciseAdminModel::createExercise($data);
            case 'PUT':
                if ($id === null) {
                    return new Response(400, [], json_encode(["status" => "error", "message" => "Exercise ID is required"]));
                }
                $data = json_decode(file_get_contents("php://input"), true);
                return ExerciseAdminModel::updateExercise($id, $data);
            case 'DELETE':
                if ($id === null) {
                    return new Response(400, [], json_encode(["status" => "error", "message" => "Exercise ID is required"]));
                }
                return ExerciseAdminModel::deleteExercise($id);
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
        list($isAdmin, $errMsg) = AdminModel::isAdmin($userId);
        if (!$isAdmin) {
            http_response_code($errMsg === 'User not found' ? 401 : 403);
            echo json_encode(["status" => "error", "message" => $errMsg]);
            exit;
        }
        return true;
    }

    // All DB logic for exercises and groups has been moved to the Model folder.

    // You can add more methods here for API endpoints (CRUD) if needed
}
