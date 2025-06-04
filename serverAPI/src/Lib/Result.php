<?php
namespace Languid\Lib;

class Result {
    public bool $success;
    public mixed $value;

    public function __construct(bool $success, mixed $value) {
        $this->success = $success;
        $this->value = $value;
    }
}
