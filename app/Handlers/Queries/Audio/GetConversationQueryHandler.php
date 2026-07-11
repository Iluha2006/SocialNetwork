<?php

namespace App\Handlers\Queries\Audio;

use App\Queries\Audio\GetConversationQuery;
use App\Services\AudioMessageService;

class GetConversationQueryHandler
{
    public function __construct(
        private readonly AudioMessageService $audioService,
    ) {}

    public function handle(GetConversationQuery $query): array
    {
        $messages = $this->audioService->getConversation($query->userId, $query->otherUserId);

        return ['data' => $messages];
    }
}
