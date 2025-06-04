<?php
namespace Languid\Lib;

class HttpHelper
{

    /**
     * Set default CORS and content headers for all responses
     */
    public static function setDefaultHeaders(): void
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-API-KEY");
        header("Content-Type: application/json");
    }

    /**
     * Get all HTTP headers as an associative array (case-insensitive keys)
     */
    public static function getHeaders(): array
    {
        // Use getallheaders if available, otherwise fallback
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
        } else {
            $headers = [];
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $key = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                    $headers[$key] = $value;
                }
            }
        }
        // Normalize keys to lowercase for easier access
        $normalized = [];
        foreach ($headers as $k => $v) {
            $normalized[strtolower($k)] = $v;
        }
        return $normalized;
    }

    /**
     * Extract Bearer token from headers (array or PSR-7 request)
     */
    public static function getBearerToken($headersOrRequest): ?string
    {
        $authHeader = null;
        if (is_array($headersOrRequest)) {
            $authHeader = $headersOrRequest['authorization'] ?? $headersOrRequest['Authorization'] ?? null;
        } elseif (is_object($headersOrRequest) && method_exists($headersOrRequest, 'getHeaders')) {
            $headers = $headersOrRequest->getHeaders();
            $authHeader = $headers['Authorization'][0] ?? $headers['authorization'][0] ?? null;
        }
        if ($authHeader && preg_match('/Bearer\s(.+)/i', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Decode JWT-like payload from a token (returns array or null)
     */
    public static function decodeTokenPayload(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return null;
        }
        list($encodedPayload, $encodedSignature) = $parts;
        $payloadJson = base64_decode(strtr($encodedPayload, '-_', '+/'));
        $payload = json_decode($payloadJson, true);
        return $payload ?: null;
    }
}
