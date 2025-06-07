<?php
namespace Languid\Lib;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;

class Response implements ResponseInterface
{
    private int $statusCode;
    private array $headers;
    private StreamInterface $body;
    private string $reasonPhrase;

    public function __construct(int $status = 200, array $headers = [], $body = '', string $reasonPhrase = '')
    {
        $this->statusCode = $status;
        $this->headers = $headers;
        $this->body = $body instanceof StreamInterface ? $body : $this->createStream((string)$body);
        $this->reasonPhrase = $reasonPhrase;
    }

    public function getStatusCode(): int { return $this->statusCode; }
    public function withStatus($code, $reasonPhrase = ''): ResponseInterface {
        $clone = clone $this;
        $clone->statusCode = $code;
        $clone->reasonPhrase = $reasonPhrase;
        return $clone;
    }
    public function getReasonPhrase(): string { return $this->reasonPhrase; }
    public function getProtocolVersion(): string { return '1.1'; }
    public function withProtocolVersion($version): ResponseInterface { $clone = clone $this; return $clone; }
    public function getHeaders(): array { return $this->headers; }
    public function hasHeader($name): bool { return isset($this->headers[$name]); }
    public function getHeader($name): array { return isset($this->headers[$name]) ? (array)$this->headers[$name] : []; }
    public function getHeaderLine($name): string {
        return isset($this->headers[$name]) ? (is_array($this->headers[$name]) ? implode(', ', $this->headers[$name]) : $this->headers[$name]) : '';
    }
    public function withHeader($name, $value): ResponseInterface {
        $clone = clone $this;
        $clone->headers[$name] = is_array($value) ? $value : [$value];
        return $clone;
    }
    public function withAddedHeader($name, $value): ResponseInterface {
        $clone = clone $this;
        if (!isset($clone->headers[$name])) {
            $clone->headers[$name] = [];
        }
        $clone->headers[$name] = array_merge((array)$clone->headers[$name], (array)$value);
        return $clone;
    }
    public function withoutHeader($name): ResponseInterface {
        $clone = clone $this;
        unset($clone->headers[$name]);
        return $clone;
    }
    public function getBody(): StreamInterface { return $this->body; }
    public function withBody(StreamInterface $body): ResponseInterface {
        $clone = clone $this;
        $clone->body = $body;
        return $clone;
    }
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
