<?php

require_once '../vendor/autoload.php';
require_once '../src/db.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Doctrine\ORM\ORMSetup;
use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\DriverManager;
use ExerciseManager\Entities\Exercise;

// Load configuration
$config = require __DIR__ . '/../src/config.php';
$uploadDir = $config['upload_paths']['exercises'];

// Doctrine setup
$doctrineConfig = $config['doctrine'];
$config = ORMSetup::createAttributeMetadataConfiguration($doctrineConfig['entities_path'], $doctrineConfig['is_dev_mode']);

$conn = DriverManager::getConnection([
    'dbname' => $doctrineConfig['dbname'],
    'user' => $doctrineConfig['user'],
    'password' => $doctrineConfig['password'],
    'host' => $doctrineConfig['host'],
    'driver' => $doctrineConfig['driver'],
]);

$entityManager = EntityManager::create($conn, $config);

$loader = new FilesystemLoader('../templates');
$twig = new Environment($loader);

// Fetch exercises using Doctrine ORM
$exerciseRepository = $entityManager->getRepository(Exercise::class);
$exercises = $exerciseRepository->findAll();

// Filter and validate form data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING);

        if ($action === 'add') {
            $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
            $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);

            if ($name && $description) {
                $exercise = new Exercise();
                $exercise->setName($name);
                $exercise->setDescription($description);

                if (isset($_FILES['cpp_file']) && $_FILES['cpp_file']['error'] === UPLOAD_ERR_OK) {
                    $fileName = basename($_FILES['cpp_file']['name']);
                    $filePath = $uploadDir . $fileName;

                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    if (move_uploaded_file($_FILES['cpp_file']['tmp_name'], $filePath)) {
                        $exercise->setCppFile($fileName);
                    } else {
                        echo "Error uploading file.";
                    }
                }

                $entityManager->persist($exercise);
                $entityManager->flush();
            } else {
                echo "Invalid input.";
            }
        } elseif ($action === 'edit') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
            $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
            $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);

            if ($id && $name && $description) {
                $exercise = $exerciseRepository->find($id);
                if ($exercise) {
                    $exercise->setName($name);
                    $exercise->setDescription($description);

                    if (isset($_FILES['cpp_file']) && $_FILES['cpp_file']['error'] === UPLOAD_ERR_OK) {
                        $fileName = basename($_FILES['cpp_file']['name']);
                        $filePath = $uploadDir . $fileName;

                        if (!is_dir($uploadDir)) {
                            mkdir($uploadDir, 0777, true);
                        }

                        if (move_uploaded_file($_FILES['cpp_file']['tmp_name'], $filePath)) {
                            $exercise->setCppFile($fileName);
                        } else {
                            echo "Error uploading file.";
                        }
                    }

                    $entityManager->flush();
                }
            } else {
                echo "Invalid input.";
            }
        } elseif ($action === 'delete') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

            if ($id) {
                $exercise = $exerciseRepository->find($id);
                if ($exercise) {
                    $entityManager->remove($exercise);
                    $entityManager->flush();
                }
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