<?php

namespace App\Commands\Messages;

use Illuminate\Http\UploadedFile;

class SendMessageCommand
{
    public function __construct(
        public readonly array $data,
        public readonly int $receiverId,
        public readonly ?UploadedFile $image = null,
        public readonly ?UploadedFile $file = null,
    ) {}
}
