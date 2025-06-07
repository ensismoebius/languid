<?php
namespace Languid\Controller;

use Languid\Lib\Response;
use Languid\Lib\AuthHandler;

class AuthController
{
    public static function login($request, $params)
    {
        $input = json_decode((string) $request->getBody(), true);
        if (!is_array($input) || !isset($input['username'], $input['password'])) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => 'Missing credentials']));
        }
        $authHandler = new AuthHandler();
        $connectionMessage = $authHandler->connect();
        if ($connectionMessage !== "Connected successfully") {
            return new Response(500, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => $connectionMessage]));
        }
        $passwdHash = md5($input['password']);
        $token = $authHandler->authenticate($input['username'], $passwdHash);
        if ($token) {
            return new Response(200, ['Content-Type' => 'application/json'], json_encode(['status' => 'success', 'token' => $token]));
        } else {
            return new Response(401, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => 'Invalid credentials']));
        }
    }
}
