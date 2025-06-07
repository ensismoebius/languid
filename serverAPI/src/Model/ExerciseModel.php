<?php
namespace Languid\Model;

use Languid\Lib\Database;
class ExerciseModel
{
    public static function getExercisesForUser($loginId)
    {
        $db = Database::getInstance();
        $conn = $db->getConnection();
        $sql = "SELECT E.id, E.title, E.testFileName, E.instructions, E.groupId, COALESCE(UE.done, 0) as done, UE.code FROM exercise as E LEFT JOIN user_exercise as UE ON E.id = UE.exerciseId AND UE.loginId = ? WHERE E.groupId = (SELECT groupId FROM user WHERE id = ? LIMIT 1)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            return [false, 'Failed to prepare statement'];
        }
        $stmt->bind_param('ii', $loginId, $loginId);
        $stmt->execute();
        $result = $stmt->get_result();
        $exercises = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $exercises[] = $row;
            }
        }
        $stmt->close();
        return [true, $exercises];
    }
}
