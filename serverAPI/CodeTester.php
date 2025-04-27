<?php
require_once('isolate_config.php');

class CodeTester
{
    private $code;
    private $exercise;

    public function setCodeAndExercise($code, $exercise)
    {
        $this->code = $code;
        $this->exercise = preg_replace('/[^a-zA-Z0-9_]/', '', $exercise);
    }

    public function runTests()
    {
        if (!$this->code || !$this->exercise) {
            return "Error: Code or exercise not set.";
        }

        $tempCppFileName = uniqid() . ".cpp";
        $tempExecutableName = uniqid();

        $uploadPath = UPLOADS_DIR . $tempCppFileName;
        file_put_contents($uploadPath, $this->code);

        $testFile = EXERCISE_DIR . "{$this->exercise}_test.cpp";
        $execPath = BIN_DIR . $tempExecutableName;
        // $cmd = "g++ -std=c++20 -I/usr/include/gtest $uploadPath $testFile -lgtest -lgtest_main -lpthread -o $execPath 2>&1";

        // $compileOutput = shell_exec($cmd);

        // if (!file_exists($execPath)) {
        //     shell_exec("rm $uploadPath");
        //     shell_exec("rm $execPath");
        //     return $compileOutput;
        // }

        // Check if the sandbox image exists
        $checkImageCmd = "docker images -q sandbox";
        $imageExists = shell_exec($checkImageCmd);

        if (empty($imageExists)) {
            return "Error: Sandbox Docker image not found. Contact the administrator.";
        }

        $containerName = "sandbox" . uniqid();
        $dockerCmd = "docker run --rm --name $containerName -v $uploadPath:/tmp/code.cpp:ro -v $testFile:/tmp/test.cpp:ro sandbox bash -c 'g++ -std=c++20 /tmp/code.cpp /tmp/test.cpp -lgtest -lgtest_main -lpthread -o /tmp/sandbox_exec && /tmp/sandbox_exec > /tmp/test_results.txt 2>&1 && cat /tmp/test_results.txt'";

        $testOutput = shell_exec($dockerCmd);

        if ($testOutput === null) {
            $testOutput = "Error: Test execution failed. Check server logs for details.";
        }

        // Cleanup
        shell_exec("rm $uploadPath");
        shell_exec("rm $execPath");

        return $testOutput;
    }
}

// Example usage:
// $tester = new CodeTester();
// $tester->setCodeAndExercise($codeString, $exerciseName);
// echo $tester->runTests();
