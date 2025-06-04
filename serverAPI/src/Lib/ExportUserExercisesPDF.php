<?php

namespace Languid\Lib;

use Mpdf\Mpdf;

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

    function generatePDF($userId, $template = null)
    {
        $user = self::getUserInfo($userId);
        $exercises = self::getUserExercisesWithAnswers($userId);
        $mpdf = new Mpdf();
        $html = '<h1>Exercícios Realizados</h1>';
        $html .= '<p><b>Usuário:</b> ' . htmlspecialchars($user['email']) . ' | <b>Grupo:</b> ' . htmlspecialchars($user['groupId']) . '</p>';
        foreach ($exercises as $ex) {
            $html .= '<div style="margin-bottom:30px;">';
            $html .= '<h2>Exercício #' . $ex['id'] . ': ' . htmlspecialchars($ex['title']) . '</h2>';
            $html .= '<p><b>Enunciado:</b><br>' . nl2br(htmlspecialchars($ex['instructions'])) . '</p>';
            $html .= '<p><b>Resposta do usuário:</b><br><pre style="background:#f4f4f4;padding:10px;border-radius:4px;">' . htmlspecialchars($ex['code']) . '</pre></p>';
            $html .= '</div>';
        }
        if ($template) {
            // Optionally wrap in a template
            $html = str_replace('{{content}}', $html, $template);
        }
        $mpdf->WriteHTML($html);
        $filename = 'user_' . $userId . '_exercises_' . date('Ymd_His') . '.pdf';
        $mpdf->Output($filename, \Mpdf\Output\Destination::INLINE);
    }
}