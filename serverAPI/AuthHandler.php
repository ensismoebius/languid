<?php
require_once 'isolate_config.php';

class AuthHandler
{
    private $db;

    public function __construct()
    {
        $this->db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($this->db->connect_error) {
            die("Connection failed: " . $this->db->connect_error);
        }
    }

    public function authenticate($username, $password)
    {
        $stmt = $this->db->prepare("SELECT passwdHash FROM user WHERE email = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->bind_result($passwdHash);
        $stmt->fetch();
        $stmt->close();

        if (password_verify($password, $passwdHash)) {
            return $this->generateToken($username);
        }

        return null;
    }

    private function generateToken($username)
    {
        $payload = [
            'sub' => $username,
            'iat' => time(),
            'exp' => time() + (60 * 60) // Token valid for 1 hour
        ];

        $secretKey = 'your-secret-key';
        return $this->base64UrlEncode(json_encode($payload)) . '.' . $this->base64UrlEncode(hash_hmac('sha256', json_encode($payload), $secretKey, true));
    }

    private function base64UrlEncode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}