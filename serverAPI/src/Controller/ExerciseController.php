<?php
namespace Languid\Controller;

use GuzzleHttp\Psr7\Response;

class ExerciseController
{
    public static function list($request, $params)
    {
        // TODO: Implement real DB logic
        $exercises = [
            ['id' => 1, 'title' => 'Ex 1', 'instructions' => 'Do something', 'done' => true],
            ['id' => 2, 'title' => 'Ex 2', 'instructions' => 'Do something else', 'done' => false],
        ];
        return new Response(200, [], json_encode(['status' => 'success', 'exercises' => $exercises]));
    }

    public static function submit($request, $params)
    {
        $input = json_decode((string)$request->getBody(), true);
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
