<?php
namespace Languid\Controller;

use GuzzleHttp\Psr7\Response;
use Languid\Lib\HttpHelper;
use Languid\Lib\Database;

class ExerciseController
{
    public static function list($request, $params)
    {
        // Auth: get token and payload
        $token = HttpHelper::getBearerToken($request);
        if (!$token) {
            return new Response(401, [], json_encode(['status' => 'error', 'message' => 'Missing or invalid Authorization header']));
        }
        $payload = HttpHelper::decodeTokenPayload($token);
        if (!$payload || !isset($payload['sub'])) {
            return new Response(401, [], json_encode(['status' => 'error', 'message' => 'Invalid token payload']));
        }
        $loginId = intval($payload['sub']);

        // DB connection (singleton)
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
        } catch (\Exception $e) {
            return new Response(500, [], json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]));
        }

        $sql = "SELECT E.id, E.title, E.testfilename, E.instructions, E.groupId, COALESCE(UE.done, 0) as done, UE.code FROM exercise as E LEFT JOIN user_exercise as UE ON E.id = UE.exerciseid AND UE.loginid = $loginId WHERE E.groupId = ( SELECT groupId FROM user  WHERE id = $loginId LIMIT 1 )";
        $result = $conn->query($sql);
        $exercises = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $exercises[] = $row;
            }
        }
        $db->close();
        return new Response(200, [], json_encode(['status' => 'success', 'exercises' => $exercises]));
    }

    public static function submit($request, $params)
    {
        $input = json_decode((string) $request->getBody(), true);
        if (!isset($input['code'], $input['exercise'])) {
            return new Response(400, [], json_encode(['status' => 'error', 'message' => 'Missing code or exercise']));
        }

        // Use CodeTester
        $tester = new \Languid\Lib\CodeTester();
        $tester->setCodeAndExercise($input['code'], $input['exercise']);
        $testResult = $tester->runTests();

        if (!$testResult->success) {
            return new Response(200, [], json_encode(['status' => 'fail', 'message' => $testResult->value]));
        }

        // Try to decode the test output as JSON
        $output = json_decode($testResult->value, true);
        if ($output === null) {
            // Not JSON, return raw output
            return new Response(200, [], json_encode(['status' => 'success', 'output' => $testResult->value]));
        }

        return new Response(200, [], json_encode(['status' => 'success', 'output' => $output]));
    }
}
