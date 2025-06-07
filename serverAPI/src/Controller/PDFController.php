<?php
namespace Languid\Controller;

use Languid\Lib\Response;
use Languid\Lib\ExportUserExercisesPDF;

class PDFController
{
    public static function userExercisesPDF($request, $params)
    {
        $userId = $params['userId'] ?? null;
        if (!$userId) {
            return new Response(400, [], 'Missing userId');
        }
        // Generate PDF and output as application/pdf
        ob_start();
        ExportUserExercisesPDF::generatePDF($userId);
        $pdfContent = ob_get_clean();
        return new Response(200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="user_' . $userId . '_exercises.pdf"'
        ], $pdfContent);
    }
}
