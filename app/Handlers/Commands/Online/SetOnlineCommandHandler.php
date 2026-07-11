<?php

namespace App\Handlers\Commands\Online;

use App\Commands\Online\SetOnlineCommand;
use App\Events\OnlineUser;

class SetOnlineCommandHandler
{
    public function handle(SetOnlineCommand $command): array
    {
        $user = $command->request->user();

        if (!$user) {
            throw new \RuntimeException('Unauthorized');
        }

        $user->setOnline();
        broadcast(new OnlineUser($user));

        return [
            'message' => 'User is now online',
            'user' => $command->request->only(['id', 'name', 'online_status', 'last_seen']),
        ];
    }
}
