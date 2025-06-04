<?php
namespace Languid\Controller;


use GuzzleHttp\Psr7\Response;
use Languid\Lib\AuthHandler;

class AuthController
{
    public static function login($request, $params)
    {
        // Expects JSON {"username":..., "password":...}
        $input = json_decode((string) $request->getBody(), true);
        if (!isset($input['username'], $input['password'])) {
            return new Response(400, [], json_encode(['status' => 'error', 'message' => 'Missing credentials']));
        }

        $authHandler = new AuthHandler();
        $connectionMessage = $authHandler->connect();
        if ($connectionMessage !== "Connected successfully") {
            return new Response(500, [], json_encode(['status' => 'error', 'message' => $connectionMessage]));
        }

        // Password is expected to be plain, hash it as in your DB (MD5)
        $passwdHash = md5($input['password']);
        $token = $authHandler->authenticate($input['username'], $passwdHash);

        if ($token) {
            return new Response(200, [], json_encode(['status' => 'success', 'token' => $token]));
        } else {
            return new Response(401, [], json_encode(['status' => 'error', 'message' => 'Invalid credentials']));
        }
    }
}
