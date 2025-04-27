<?php

// Ensure Doctrine ORM is properly autoloaded and configured
require_once '../vendor/autoload.php';

use Doctrine\ORM\ORMSetup;
use Doctrine\ORM\EntityManager;

// Doctrine setup
$config = ORMSetup::createAnnotationMetadataConfiguration([__DIR__ . '/../src/Entities'], true);
$conn = [
    'dbname' => 'languid',
    'user' => 'andre',
    'password' => '1234',
    'host' => '127.0.0.1',
    'driver' => 'pdo_mysql',
];

// Create the EntityManager
$entityManager = EntityManager::createEntityManager($conn, $config);