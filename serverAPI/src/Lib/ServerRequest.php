<?php
namespace Languid\Lib;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\UriInterface;
use Psr\Http\Message\StreamInterface;

class ServerRequest implements ServerRequestInterface
{
    protected $method;
    protected $uri;
    protected $headers;
    protected $body;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $this->uri = $_SERVER['REQUEST_URI'] ?? '/';
        $this->headers = function_exists('getallheaders') ? getallheaders() : [];
        $this->body = $this->createStream(file_get_contents('php://input'));
    }

    public static function fromGlobals()
    {
        return new self();
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function getUri(): UriInterface
    {
        // Minimal UriInterface implementation with correct type signatures
        return new class($this->uri) implements UriInterface {
            private $uri;
            public function __construct($uri) { $this->uri = $uri; }
            public function getScheme(): string { return ''; }
            public function getAuthority(): string { return ''; }
            public function getUserInfo(): string { return ''; }
            public function getHost(): string { return ''; }
            public function getPort(): int|null { return null; }
            public function getPath(): string { return parse_url($this->uri, PHP_URL_PATH) ?? '/'; }
            public function getQuery(): string { return parse_url($this->uri, PHP_URL_QUERY) ?? ''; }
            public function getFragment(): string { return ''; }
            public function withScheme(string $scheme): UriInterface { return $this; }
            public function withUserInfo(string $user, ?string $password = null): UriInterface { return $this; }
            public function withHost(string $host): UriInterface { return $this; }
            public function withPort(?int $port): UriInterface { return $this; }
            public function withPath(string $path): UriInterface { return $this; }
            public function withQuery(string $query): UriInterface { return $this; }
            public function withFragment(string $fragment): UriInterface { return $this; }
            public function __toString(): string { return $this->uri; }
        };
    }
    // --- Additional required methods for PSR-7 compliance ---
    public function getRequestTarget(): string { return $this->uri; }
    public function withRequestTarget(string $requestTarget): RequestInterface { return $this; }

    public function getHeaders(): array
    {
        // PSR-7 expects headers as array of arrays
        $out = [];
        foreach ($this->headers as $k => $v) {
            $out[$k] = is_array($v) ? $v : [$v];
        }
        return $out;
    }

    public function getBody(): StreamInterface
    {
        return $this->body;
    }

    // --- Minimal stubs for required interface methods ---
    public function getServerParams(): array { return $_SERVER; }
    public function getCookieParams(): array { return $_COOKIE; }
    public function withCookieParams(array $cookies): ServerRequestInterface { return $this; }
    public function getQueryParams(): array { return $_GET; }
    public function withQueryParams(array $query): ServerRequestInterface { return $this; }
    public function getUploadedFiles(): array { return $_FILES; }
    public function withUploadedFiles(array $uploadedFiles): ServerRequestInterface { return $this; }
    public function getParsedBody() { return $_POST; }
    public function withParsedBody($data): ServerRequestInterface { return $this; }
    public function getAttributes(): array { return []; }
    public function getAttribute($name, $default = null) { return $default; }
    public function withAttribute(string $name, $value): ServerRequestInterface { return $this; }
    public function withoutAttribute(string $name): ServerRequestInterface { return $this; }
    public function getProtocolVersion(): string { return '1.1'; }
    public function withProtocolVersion(string $version): RequestInterface { return $this; }
    public function hasHeader(string $name): bool { return isset($this->headers[$name]); }
    public function getHeader(string $name): array { return isset($this->headers[$name]) ? (array)$this->headers[$name] : []; }
    public function getHeaderLine(string $name): string { return isset($this->headers[$name]) ? (is_array($this->headers[$name]) ? implode(', ', $this->headers[$name]) : $this->headers[$name]) : ''; }
    public function withHeader(string $name, $value): RequestInterface { return $this; }
    public function withAddedHeader(string $name, $value): RequestInterface { return $this; }
    public function withoutHeader(string $name): RequestInterface { return $this; }
    public function withBody(StreamInterface $body): RequestInterface { return $this; }
    public function withMethod(string $method): RequestInterface { return $this; }
    public function withUri(UriInterface $uri, $preserveHost = false): RequestInterface { return $this; }
    // Helper to create a minimal StreamInterface
    private function createStream(string $content): StreamInterface
    {
        return new class($content) implements StreamInterface {
            private string $content;
            public function __construct(string $content) { $this->content = $content; }
            public function __toString(): string { return $this->content; }
            public function close(): void {}
            public function detach() { return null; }
            public function getSize(): ?int { return strlen($this->content); }
            public function tell(): int { return 0; }
            public function eof(): bool { return true; }
            public function isSeekable(): bool { return false; }
            public function seek(int $offset, int $whence = SEEK_SET): void {}
            public function rewind(): void {}
            public function isWritable(): bool { return false; }
            public function write(string $string): int { return 0; }
            public function isReadable(): bool { return true; }
            public function read(int $length): string { return substr($this->content, 0, $length); }
            public function getContents(): string { return $this->content; }
            public function getMetadata($key = null) { return null; }
        };
    }
}
