<?php
require_once 'isolate_config.php';

class AuthHandler
{
    private $db;

    public function connect()
    {
        try {
            $this->db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        } catch (Exception $e) {
            return "Connection failed: " . $e->getMessage();
        }

        // Check connection
        $this->db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($this->db->connect_error) {
            return "Connection failed: " . $this->db->connect_error;
        }

        return "Connected successfully";
    }

    public function authenticate($username, $passwdHash)
    {
        $stmt = $this->db->prepare("SELECT id FROM user WHERE email = ? and passwdHash = ?");
        $stmt->bind_param("ss", $username, $passwdHash);
        $stmt->execute();
        $stmt->bind_result($id);
        $stmt->fetch();
        $stmt->close();

        return $this->generateToken($id);
    }

    private function generateToken($id)
    {
        if (empty($id)) {
            return null;
        }

        $payload = [
            'sub' => $id,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24 * 30) // Token valid for 1 hour
        ];

        $secretKey = 'your-secret-key';
        return $this->base64UrlEncode(json_encode($payload)) . '.' . $this->base64UrlEncode(hash_hmac('sha256', json_encode($payload), $secretKey, true));
    }

    private function base64UrlEncode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}