<?php
// filepath: /home/ensismoebius/workspaces/react-workspace/languid/serverAPI/src/Lib/Router.php

namespace Languid\Lib;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use \GuzzleHttp\Psr7\Response;

class Router
{
    private $routes = [];

    public function add(string $method, string $path, callable $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch(ServerRequestInterface $request): ResponseInterface
    {
        $requestPath = $request->getUri()->getPath();
        $requestMethod = strtoupper($request->getMethod());
        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && $this->match($route['path'], $requestPath, $params)) {
                return call_user_func($route['handler'], $request, $params);
            }
        }
        // 404 Response
        $response = new Response(404);
        $response->getBody()->write(json_encode(['status' => 'error', 'message' => 'Not Found']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    private function match(string $routePath, string $requestPath, &$params): bool
    {
        $params = [];
        // Simple path matching with {param} support
        $routePattern = preg_replace('#\{([^/]+)\}#', '(?P<$1>[^/]+)', $routePath);
        $routePattern = '#^' . $routePattern . '$#';
        if (preg_match($routePattern, $requestPath, $matches)) {
            foreach ($matches as $key => $value) {
                if (!is_int($key)) {
                    $params[$key] = $value;
                }
            }
            return true;
        }
        return false;
    }
}
