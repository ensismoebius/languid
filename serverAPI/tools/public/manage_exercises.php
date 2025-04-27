<?php

require_once '../vendor/autoload.php';
require_once '../src/db.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new FilesystemLoader('../templates');
$twig = new Environment($loader);

// Fetch exercises
$stmt = $pdo->query("SELECT * FROM exercises");
$exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Filter and validate form data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING);

        if ($action === 'add') {
            $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
            $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);

            if ($name && $description) {
                // Handle file upload
                if (isset($_FILES['cpp_file']) && $_FILES['cpp_file']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = '../uploads/';
                    $fileName = basename($_FILES['cpp_file']['name']);
                    $filePath = $uploadDir . $fileName;

                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    if (move_uploaded_file($_FILES['cpp_file']['tmp_name'], $filePath)) {
                        $stmt = $pdo->prepare("INSERT INTO exercises (name, description, cpp_file) VALUES (?, ?, ?)");
                        $stmt->execute([$name, $description, $fileName]);
                    } else {
                        echo "Error uploading file.";
                    }
                } else {
                    $stmt = $pdo->prepare("INSERT INTO exercises (name, description) VALUES (?, ?)");
                    $stmt->execute([$name, $description]);
                }
            } else {
                echo "Invalid input.";
            }
        } elseif ($action === 'edit') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
            $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
            $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);

            if ($id && $name && $description) {
                // Handle file upload for edit
                if (isset($_FILES['cpp_file']) && $_FILES['cpp_file']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = '../uploads/';
                    $fileName = basename($_FILES['cpp_file']['name']);
                    $filePath = $uploadDir . $fileName;

                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    if (move_uploaded_file($_FILES['cpp_file']['tmp_name'], $filePath)) {
                        $stmt = $pdo->prepare("UPDATE exercises SET name = ?, description = ?, cpp_file = ? WHERE id = ?");
                        $stmt->execute([$name, $description, $fileName, $id]);
                    } else {
                        echo "Error uploading file.";
                    }
                } else {
                    $stmt = $pdo->prepare("UPDATE exercises SET name = ?, description = ? WHERE id = ?");
                    $stmt->execute([$name, $description, $id]);
                }
            } else {
                echo "Invalid input.";
            }
        } elseif ($action === 'delete') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM exercises WHERE id = ?");
                $stmt->execute([$id]);
            } else {
                echo "Invalid input.";
            }
        }

        // Redirect to avoid form resubmission
        header('Location: manage_exercises.php');
        exit;
    }
}

// Render the template
echo $twig->render('manage_exercises.html.twig', ['exercises' => $exercises]);

?>