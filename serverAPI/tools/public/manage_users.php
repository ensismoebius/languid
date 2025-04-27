<?php

require_once '../vendor/autoload.php';
require_once '../src/db.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityRepository;

// Load configuration
$config = require __DIR__ . '/../src/config.php';

// Doctrine setup
$doctrineConfig = $config['doctrine'];
$config = Setup::createAnnotationMetadataConfiguration($doctrineConfig['entities_path'], $doctrineConfig['is_dev_mode']);
$conn = $config['db'];

$entityManager = EntityManager::create($conn, $config);

$loader = new FilesystemLoader('../templates');
$twig = new Environment($loader);

// Fetch users using Doctrine ORM
$userRepository = $entityManager->getRepository('Entities\\User');
$users = $userRepository->findAll();

// Add routes for managing users
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];

        if ($action === 'add') {
            $username = $_POST['username'];
            $email = $_POST['email'];

            $user = new \Entities\User();
            $user->setUsername($username);
            $user->setEmail($email);
            $entityManager->persist($user);
            $entityManager->flush();
        } elseif ($action === 'edit') {
            $id = $_POST['id'];
            $username = $_POST['username'];
            $email = $_POST['email'];

            $user = $userRepository->find($id);
            if ($user) {
                $user->setUsername($username);
                $user->setEmail($email);
                $entityManager->flush();
            }
        } elseif ($action === 'delete') {
            $id = $_POST['id'];

            $user = $userRepository->find($id);
            if ($user) {
                $entityManager->remove($user);
                $entityManager->flush();
            }
        }

        // Redirect to avoid form resubmission
        header('Location: manage_users.php');
        exit;
    }
}

// Render the template
echo $twig->render('manage_users.html.twig', ['users' => $users]);

?>