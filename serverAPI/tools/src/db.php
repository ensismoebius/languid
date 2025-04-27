<?php

namespace ExerciseManager;

use PDO;
use PDOException;

$host = 'localhost';
$dbname = 'exercise_manager';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Add a new column for storing C++ file names
ALTER TABLE exercises ADD COLUMN cpp_file VARCHAR(255) DEFAULT NULL;

?>