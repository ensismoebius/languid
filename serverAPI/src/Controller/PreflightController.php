<?php
namespace Languid\Controller;

use GuzzleHttp\Psr7\Response;

class PreflightController
{
    public static function handle()
    {
        return new Response(200, [], json_encode(['status' => 'ok', 'message' => 'CORS preflight']));
    }
}
