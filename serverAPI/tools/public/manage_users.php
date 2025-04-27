<?php

require_once '../vendor/autoload.php';
require_once '../src/db.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new FilesystemLoader('../templates');
$twig = new Environment($loader);

// Fetch users
$stmt = $pdo->query("SELECT * FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Add routes for managing users
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];

        if ($action === 'add') {
            $username = $_POST['username'];
            $email = $_POST['email'];
            $stmt = $pdo->prepare("INSERT INTO users (username, email) VALUES (?, ?)");
            $stmt->execute([$username, $email]);
        } elseif ($action === 'edit') {
            $id = $_POST['id'];
            $username = $_POST['username'];
            $email = $_POST['email'];
            $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
            $stmt->execute([$username, $email, $id]);
        } elseif ($action === 'delete') {
            $id = $_POST['id'];
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
        }

        // Redirect to avoid form resubmission
        header('Location: manage_users.php');
        exit;
    }
}

// Add support for importing users from a CSV file
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['import_csv'])) {
    if (isset($_FILES['csv_file']) && $_FILES['csv_file']['error'] === UPLOAD_ERR_OK) {
        $file = fopen($_FILES['csv_file']['tmp_name'], 'r');

        // Skip the header row
        fgetcsv($file);

        while (($data = fgetcsv($file)) !== false) {
            $username = filter_var($data[0], FILTER_SANITIZE_STRING);
            $email = filter_var($data[1], FILTER_VALIDATE_EMAIL);

            if ($username && $email) {
                $stmt = $pdo->prepare("INSERT INTO users (username, email) VALUES (?, ?)");
                $stmt->execute([$username, $email]);
            }
        }

        fclose($file);
        echo "Users imported successfully.";
    } else {
        echo "Error uploading file.";
    }
}

// Render the template
echo $twig->render('manage_users.html.twig', ['users' => $users]);

?>