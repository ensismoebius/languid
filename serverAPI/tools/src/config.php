<?php

return [
    'db' => [
        'host' => '127.0.0.1',
        'dbname' => 'languid',
        'username' => 'andre',
        'password' => '1234',
        'driver' => 'pdo_mysql',
    ],
    'uploads' => [
        'directory' => __DIR__ . '/../uploads/',
    ],
    'doctrine' => [
        'entities_path' => [__DIR__ . '/../src/Entities'],
        'is_dev_mode' => true,
    ],
    'upload_paths' => [
        'exercises' => '/home/ensismoebius/workspaces/react-workspace/languid/serverAPI/exercises',
    ],
];