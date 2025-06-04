<?php

namespace Languid\Lib;


use Mpdf\Mpdf;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class ExportUserExercisesPDF
{
    private static function connectDB(): \mysqli
    {
        $conn = new \mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            die('Database connection failed: ' . $conn->connect_error);
        }
        $conn->set_charset('utf8mb4');
        return $conn;
    }

    private static function getUserExercisesWithAnswers($userId): array
    {
        $conn = connectDB();
        $sql = "SELECT E.id, E.title, E.instructions, E.groupId, UE.code, UE.done
            FROM exercise E
            JOIN user_exercise UE ON E.id = UE.exerciseId
            WHERE UE.loginId = ? AND UE.done = 1
            ORDER BY E.id ASC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $exercises = [];
        while ($row = $result->fetch_assoc()) {
            $exercises[] = $row;
        }
        $stmt->close();
        $conn->close();

        return $exercises;
    }

    private static function getUserInfo($userId): array
    {
        $conn = connectDB();
        $stmt = $conn->prepare('SELECT email, groupId FROM user WHERE id = ?');
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $info = $result->fetch_assoc();
        $stmt->close();
        $conn->close();
        return $info;
    }

    public static function generatePDF($userId, $template = null)
    {
        $user = self::getUserInfo($userId);
        $exercises = self::getUserExercisesWithAnswers($userId);
        $mpdf = new Mpdf();

        // Setup Twig
        $loader = new FilesystemLoader(__DIR__ . '/../View');
        $twig = new Environment($loader);

        // Default template if none provided
        $templateFile = $template ?: 'user_exercises_pdf.html.twig';

        // Render HTML with Twig/../../templates
        $html = $twig->render($templateFile, [
            'user' => $user,
            'exercises' => $exercises,
            'date' => date('d/m/Y H:i')
        ]);

        $filename = 'user_' . $userId . '_exercises_' . date('Ymd_His') . '.pdf';
        $mpdf->WriteHTML($html);
        $mpdf->Output($filename, \Mpdf\Output\Destination::INLINE);
    }
}