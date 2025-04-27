<?php

namespace ExerciseManager;

use PDO;
use PDOException;

// Load configuration
$config = require __DIR__ . '/../src/config.php';

// Database connection
$dbConfig = $config['db'];
try {
    $pdo = new PDO("mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']}", $dbConfig['username'], $dbConfig['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}