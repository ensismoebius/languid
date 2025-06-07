<?php
namespace Languid\Model;

use Languid\Lib\Database;

class AdminModel
{
    public static function isAdmin($userId)
    {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT admin FROM user WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            $conn->close();
            return [false, 'User not found'];
        }
        $user = $result->fetch_assoc();
        $conn->close();
        if ($user['admin'] != 1) {
            return [false, 'Administrator access required'];
        }
        return [true, null];
    }
}
