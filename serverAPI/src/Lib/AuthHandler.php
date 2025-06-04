<?php
namespace Languid\Lib;

class AuthHandler
{
    private $db;
    private $secretKey = API_KEY; // Use a constant or environment variable for the secret key

    public function connect()
    {
        try {
            $this->db = new \mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        } catch (\Exception $e) {
            return "Connection failed: " . $e->getMessage();
        }

        // Check connection
        $this->db = new \mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
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

        return $this->base64UrlEncode(json_encode($payload)) . '.' . $this->base64UrlEncode(hash_hmac('sha256', json_encode($payload), $this->secretKey, true));
    }

    private function base64UrlEncode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    public function verifyToken($token)
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return false; // Invalid token format
        }

        list($encodedPayload, $encodedSignature) = $parts;

        // Decode payload
        $payloadJson = base64_decode(strtr($encodedPayload, '-_', '+/'));
        $payload = json_decode($payloadJson, true);
        if (!isset($payload['exp'])) {
            return false; // No expiration in token
        }

        // Recompute signature
        $expectedSignature = $this->base64UrlEncode(hash_hmac('sha256', $payloadJson, $this->secretKey, true));

        // Compare signatures
        if (!hash_equals($expectedSignature, $encodedSignature)) {
            return false; // Signature does not match
        }

        // Check expiration
        return ($payload['exp'] > time()); // true if not expired and signature matches
    }
}