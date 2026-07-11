<?php

namespace App\Handlers\Queries\Audio;

use App\Queries\Audio\GetAudioMessagesQuery;
use App\Services\AudioMessageService;

class GetAudioMessagesQueryHandler
{
    public function __construct(
        private readonly AudioMessageService $audioService,
    ) {}

    public function handle(GetAudioMessagesQuery $query): array
    {
        $messages = $this->audioService->getUserAudioMessages($query->userId);

        return ['data' => $messages];
    }
}
