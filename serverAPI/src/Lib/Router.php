<?php
// filepath: /home/ensismoebius/workspaces/react-workspace/languid/serverAPI/src/Lib/Router.php

namespace Languid\Lib;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Languid\Lib\Response;


class Router
{
    private $routes = [];
    private $webRoot;

    /**
     * @param string $webRoot The website root path (e.g. "/serverAPI" or "/api"). Must start with "/" and not end with "/" (except for "/").
     */
    public function __construct(string $webRoot)
    {
        if ($webRoot === '' || $webRoot[0] !== '/') {
            throw new \InvalidArgumentException('Router: webRoot must start with "/".');
        }
        $this->webRoot = rtrim($webRoot, '/') ?: '/';
    }

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

        // Remove the website root from the path
        $webRoot = $this->webRoot;
        if ($webRoot !== '/' && strpos($requestPath, $webRoot) === 0) {
            $requestPath = substr($requestPath, strlen($webRoot));
            if ($requestPath === false) $requestPath = '/';
        }
        $requestPath = '/' . ltrim($requestPath, '/');

        foreach ($this->routes as $route) {
            if (
                $route['method'] === $requestMethod &&
                $this->match($route['path'], $requestPath, $params)
            ) {
                return call_user_func($route['handler'], $request, $params);
            }
        }

        // 404 Response
        $response = new Response(404, ['Content-Type' => 'application/json'], json_encode(['status' => 'error', 'message' => 'Not Found']));
        return $response;
    }

    private function match(string $routePath, string $requestPath, &$params): bool
    {
        $params = [];
        // Simple path matching with {param} support
        $routePattern = preg_replace('#\{([^/]+)\}#', '(?P<$1>[^/]+)', $routePath);
        $routePattern = '#^' . $routePattern . '/?$#';
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
