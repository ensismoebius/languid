<?php

namespace ExerciseManager;

require_once 'db.php';

// Filter and validate form data
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_user'])) {
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

    if ($username && $email) {
        $stmt = $pdo->prepare("INSERT INTO users (username, email) VALUES (?, ?)");
        $stmt->execute([$username, $email]);
        echo "User added successfully.";
    } else {
        echo "Invalid input.";
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_user'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

    if ($id && $username && $email) {
        $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
        $stmt->execute([$username, $email, $id]);
        echo "User updated successfully.";
    } else {
        echo "Invalid input.";
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['remove_user'])) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        echo "User removed successfully.";
    } else {
        echo "Invalid input.";
    }
}

?>