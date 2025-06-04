<?php
namespace Languid\Controller;

use GuzzleHttp\Psr7\Response;
use Languid\Lib\HttpHelper;
use Languid\Model\ExerciseModel;

class ExerciseController
{
    /**
     * Helper to extract and validate user id from token, returns [int $loginId, Response|null $errorResponse]
     */
    private static function getLoginIdFromRequest($request)
    {
        $token = HttpHelper::getBearerToken($request);
        if (!$token) {
            return [null, new Response(401, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => 'Missing or invalid Authorization header']))];
        }
        $payload = HttpHelper::decodeTokenPayload($token);
        if (!is_array($payload) || !isset($payload['sub'])) {
            return [null, new Response(401, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => 'Invalid token payload']))];
        }
        return [(int) $payload['sub'], null];
    }

    public static function list($request, $params)
    {
        list($loginId, $errorResponse) = self::getLoginIdFromRequest($request);
        if ($errorResponse)
            return $errorResponse;

        list($ok, $result) = ExerciseModel::getExercisesForUser($loginId);
        if (!$ok) {
            return new Response(500, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => $result]));
        }
        return new Response(200, ['Content-Type' => 'application/json'], json_encode(['status' => 'success', 'exercises' => $result]));
    }

    public static function submit($request, $params)
    {
        list($loginId, $errorResponse) = self::getLoginIdFromRequest($request);
        if ($errorResponse)
            return $errorResponse;

        $input = json_decode((string) $request->getBody(), true);
        if (!is_array($input) || !isset($input['code'], $input['exercise'])) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => 'Missing code or exercise']));
        }
        // Validate types
        if (!is_string($input['code']) || (!is_int($input['exercise']) && !ctype_digit((string) $input['exercise']))) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => 'Invalid code or exercise type']));
        }

        $tester = new \Languid\Lib\CodeTester();
        $tester->setCodeAndExercise($input['code'], (int) $input['exercise']);
        $testResult = $tester->runTests();

        if (!$testResult->success) {
            // Use 422 for failed test submissions
            return new Response(422, ['Content-Type' => 'application/json'], json_encode(['status' => 'fail', 'message' => $testResult->value]));
        }

        $output = json_decode($testResult->value, true);
        if (!is_array($output)) {
            return new Response(200, ['Content-Type' => 'application/json'], json_encode(['status' => 'success', 'output' => $testResult->value]));
        }

        return new Response(200, ['Content-Type' => 'application/json'], json_encode(['status' => 'success', 'output' => $output]));
    }
}
