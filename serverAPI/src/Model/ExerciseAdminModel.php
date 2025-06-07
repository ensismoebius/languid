<?php
namespace Languid\Model;

use Languid\Lib\Response;
use Languid\Lib\Database;

class ExerciseAdminModel
{
    public static function getExerciseGroups()
    {
        $conn = Database::getInstance()->getConnection();
        $sql = "SELECT id, name, description FROM exerciseGroup ORDER BY id ASC";
        $result = $conn->query($sql);
        $groups = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $groups[] = $row;
            }
        }
        $conn->close();
        return $groups;
    }

    public static function getExercises()
    {
        $conn = Database::getInstance()->getConnection();
        $sql = "SELECT id, title, instructions, testFileName, groupId FROM exercise ORDER BY id ASC";
        $result = $conn->query($sql);
        $exercises = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $exercises[] = $row;
            }
        }
        $conn->close();
        $groups = self::getExerciseGroups();
        return new Response(200, [], json_encode(["status" => "success", "exercises" => $exercises, "groups" => $groups]));
    }

    public static function getExercise($id)
    {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT id, title, instructions, testFileName, groupId FROM exercise WHERE id = ?");

        $stmt->bind_param("i", $id);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $conn->close();
            return new Response(404, [], json_encode(["status" => "error", "message" => "Exercise not found"]));
        }

        $exercise = $result->fetch_assoc();

        $testFilePath = EXERCISES_TESTS_PATH . $exercise['testFileName'];

        if (file_exists($testFilePath)) {
            $exercise['testFileContent'] = file_get_contents($testFilePath);
        } else {
            $exercise['testFileContent'] = '';
        }

        $conn->close();

        $groups = self::getExerciseGroups();

        return new Response(
            200,
            [],
            json_encode([
                "status" => "success",
                "exercise" => $exercise,
                "groups" => $groups
            ])
        );
    }

    public static function createExercise($data)
    {
        if (
            !isset($data['title']) ||
            !isset($data['instructions']) ||
            !isset($data['testFileContent']) ||
            !isset($data['groupId'])
        ) {
            return new Response(
                400,
                [],
                json_encode([
                    "status" => "error",
                    "message" => "Missing required fields"
                ])
            );
        }


        $conn = Database::getInstance()->getConnection();
        $result = $conn->query("SELECT MAX(id) as max_id FROM exercise");
        $row = $result->fetch_assoc();

        $nextId = ($row['max_id'] ?? 0) + 1;
        $testFileName = $nextId . "_test.cpp";

        $stmt = $conn->prepare("INSERT INTO exercise (title, instructions, testFileName, groupId) VALUES (?, ?, ?, ?)");

        $stmt->bind_param("sssi", $data['title'], $data['instructions'], $testFileName, $data['groupId']);

        if (!$stmt->execute()) {
            $conn->close();
            return new Response(
                500,
                [],
                json_encode([
                    "status" => "error",
                    "message" => "Failed to create exercise: " . $stmt->error
                ])
            );
        }

        $exerciseId = $conn->insert_id;
        $testFilePath = EXERCISES_TESTS_PATH . $testFileName;

        if (file_put_contents($testFilePath, $data['testFileContent']) === false) {
            $conn->query("DELETE FROM exercise WHERE id = " . $exerciseId);
            $conn->close();
            return new Response(
                500,
                [],
                json_encode([
                    "status" => "error",
                    "message" => "Failed to save test file"
                ])
            );
        }
        $conn->close();

        return new Response(
            201,
            [],
            json_encode([
                "status" => "success",
                "message" => "Exercise created successfully",
                "exerciseId" => $exerciseId,
                "testFileName" => $testFileName
            ])
        );
    }

    public static function updateExercise($id, $data)
    {
        if (!isset($data['title']) || !isset($data['instructions']) || !isset($data['testFileContent']) || !isset($data['groupId'])) {
            return new Response(
                400,
                [],
                json_encode([
                    "status" => "error",
                    "message" => "Missing required fields"
                ])
            );
        }
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT testFileName FROM exercise WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            $conn->close();
            return new Response(
                404,
                [],
                json_encode([
                    "status" => "error",
                    "message" => "Exercise not found"
                ])
            );
        }
        $exercise = $result->fetch_assoc();
        $testFileName = $exercise['testFileName'];
        $stmt = $conn->prepare("UPDATE exercise SET title = ?, instructions = ?, groupId = ? WHERE id = ?");
        $stmt->bind_param("ssii", $data['title'], $data['instructions'], $data['groupId'], $id);
        if (!$stmt->execute()) {
            $conn->close();
            return new Response(500, [], json_encode(["status" => "error", "message" => "Failed to update exercise: " . $stmt->error]));
        }

        $testFilePath = EXERCISES_TESTS_PATH . $testFileName;
        if (file_put_contents($testFilePath, $data['testFileContent']) === false) {
            $conn->close();
            return new Response(
                500,
                [],
                json_encode([
                    "status" => "error",
                    "message" => "Failed to save test file"
                ])
            );
        }
        $conn->close();
        return new Response(200, [], json_encode([
            "status" => "success",
            "message" => "Exercise updated successfully"
        ]));
    }

    public static function deleteExercise($id)
    {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT testFileName FROM exercise WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            $conn->close();
            return new Response(
                404,
                [],
                json_encode([
                    "status" => "error",
                    "message" => "Exercise not found"
                ])
            );
        }
        $exercise = $result->fetch_assoc();
        $testFileName = $exercise['testFileName'];
        $stmt = $conn->prepare("DELETE FROM exercise WHERE id = ?");
        $stmt->bind_param("i", $id);
        if (!$stmt->execute()) {
            $conn->close();
            return new Response(
                500,
                [],
                json_encode([
                    "status" => "error",
                    "message" => "Failed to delete exercise: " . $stmt->error
                ])
            );
        }
        $stmt = $conn->prepare("DELETE FROM user_exercise WHERE exerciseId = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $testFilePath = EXERCISES_TESTS_PATH . $testFileName;
        if (file_exists($testFilePath)) {
            if (!unlink($testFilePath)) {
                error_log("Failed to delete test file: " . $testFilePath);
            }
        }
        $conn->close();
        return new Response(200, [], json_encode([
            "status" => "success",
            "message" => "Exercise deleted successfully"
        ]));
    }
}
