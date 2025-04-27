<?php

namespace ExerciseManager;

require_once 'db.php';

// Filter and validate form data
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_exercise'])) {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);

    if ($name && $description) {
        $stmt = $pdo->prepare("INSERT INTO exercises (name, description) VALUES (?, ?)");
        $stmt->execute([$name, $description]);
        echo "Exercise added successfully.";
    } else {
        echo "Invalid input.";
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_exercise'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);

    if ($id && $name && $description) {
        $stmt = $pdo->prepare("UPDATE exercises SET name = ?, description = ? WHERE id = ?");
        $stmt->execute([$name, $description, $id]);
        echo "Exercise updated successfully.";
    } else {
        echo "Invalid input.";
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['remove_exercise'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM exercises WHERE id = ?");
        $stmt->execute([$id]);
        echo "Exercise removed successfully.";
    } else {
        echo "Invalid input.";
    }
}

?>