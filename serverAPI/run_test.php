<?php
require_once('isolate_config.php');

// Sanitize nome de arquivo
$studentFile = basename($_FILES['code']['name']);
$uploadPath = UPLOADS_DIR . $studentFile;
move_uploaded_file($_FILES['code']['tmp_name'], $uploadPath);

$exercise = preg_replace('/[^a-zA-Z0-9_]/', '', $_POST['exercise']);
$testFile = EXERCISE_DIR . "{$exercise}_test.cpp";

$execPath = BIN_DIR . "exec_$exercise";
$cmd = "g++ -std=c++20 -I/usr/include/gtest -lgtest -lpthread $uploadPath $testFile -o $execPath 2>&1";
$compileOutput = shell_exec($cmd);

if (!file_exists($execPath)) {
    echo "<pre>Erro de compilação:\n$compileOutput</pre>";
    exit;
}

// Executa dentro da sandbox
$sandboxId = 0;
$boxDir = "/var/local/lib/isolate/$sandboxId/box";
shell_exec("isolate --cleanup --box-id=$sandboxId");

copy($execPath, "$boxDir/test_exec");
chmod("$boxDir/test_exec", 0700);

// Executa com limites de tempo/memória
$runCmd = "isolate --run --box-id=$sandboxId --time=2 --mem=50000 --fsize=10000 -- ./test_exec 2>&1";
$testOutput = shell_exec($runCmd);

echo "<pre>$testOutput</pre>"; 
