<?php
namespace Languid\Lib;

class Database
{
    private static $instance = null;
    private $conn;

    private function __construct()
    {
        require_once __DIR__ . '/../../config.php';
        $this->conn = new \mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($this->conn->connect_error) {
            throw new \Exception('Database connection failed: ' . $this->conn->connect_error);
        }
        $this->conn->set_charset('utf8mb4');
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): \mysqli
    {
        return $this->conn;
    }

    public function query(string $sql)
    {
        return $this->conn->query($sql);
    }

    public function prepare(string $sql)
    {
        return $this->conn->prepare($sql);
    }

    public function close()
    {
        $this->conn->close();
        self::$instance = null;
    }
}
