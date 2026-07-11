<?php

namespace App\Handlers\Queries\Messages;

use App\Queries\Messages\GetChatFilesQuery;
use App\Services\MessageChatService;

class GetChatFilesQueryHandler
{
    public function __construct(
        private readonly MessageChatService $messageService,
    ) {}

    public function handle(GetChatFilesQuery $query): array
    {
        return [
            'success' => true,
            'files' => $this->messageService->getChatFiles(
                $query->currentUserId,
                $query->otherUserId,
            ),
        ];
    }
}
