<?php
require_once('isolate_config.php');

class CodeTester
{
    private $code;
    private $exercise;

    public function setCodeAndExercise($code, $exercise)
    {
        $this->code = $code;
        $this->exercise = $exercise;
    }

    public function runTests()
    {
        if (!$this->code || !$this->exercise) {
            return "Error: Code or exercise not set.";
        }

        $tempCppFileName = uniqid() . ".cpp";
        $tempExecutableName = uniqid();

        $uploadPath = UPLOADS_DIR . $tempCppFileName;
        // file_put_contents($uploadPath, $this->code);
        file_put_contents($uploadPath, mb_convert_encoding($this->code, 'UTF-8'));

        $testFile = EXERCISE_DIR . $this->exercise;
        $execPath = BIN_DIR . $tempExecutableName;

        // Check if the sandbox image exists
        $checkImageCmd = "docker images -q sandbox";
        $imageExists = shell_exec($checkImageCmd);

        if (empty($imageExists)) {
            return "Error: Sandbox Docker image not found. Contact the administrator.";
        }

        $containerName = "sandbox" . uniqid();

        $dockerCmd = "docker run --rm --name $containerName -v $uploadPath:/tmp/code.cpp:ro -v $testFile:/tmp/test.cpp:ro sandbox bash -c '
export LANG=en_US.UTF-8;
if ! g++ -std=c++20 /tmp/code.cpp -o /tmp/code_exec 2> /tmp/res.json; then cat /dev/null; fi;
if ! g++ -std=c++20 /tmp/test.cpp -o /tmp/test_exec -lgtest -lgtest_main -pthread 2>> /tmp/res.json; then cat /tmp/res.json; exit; fi;
/tmp/test_exec --gtest_output=json:/tmp/res.json > /dev/null 2>&1;
cat /tmp/res.json'";


        $temp = "docker run -it --rm --name $containerName -v $uploadPath:/tmp/code.cpp:ro -v $testFile:/tmp/test.cpp:ro sandbox bash";

        $temp2 = "g++ -std=c++20 /tmp/code.cpp -o /tmp/code_exec 2>/dev/null ; g++ -std=c++20 /tmp/test.cpp -o /tmp/test_exec -lgtest -lgtest_main -pthread && /tmp/test_exec --gtest_output=json:res.json > /dev/null 2>&1; cat res.json";

        $testOutput = shell_exec($dockerCmd);

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
