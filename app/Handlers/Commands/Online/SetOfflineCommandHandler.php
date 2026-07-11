<?php

namespace App\Handlers\Commands\Online;

use App\Commands\Online\SetOfflineCommand;
use App\Events\OnlineUser;

class SetOfflineCommandHandler
{
    public function handle(SetOfflineCommand $command): array
    {
        $user = $command->request->user();

        if (!$user) {
            throw new \RuntimeException('Unauthorized');
        }

        $user->setOffline();
        broadcast(new OnlineUser($user));

        return [
            'message' => 'User is now offline',
            'user' => $command->request->only(['id', 'name', 'online_status', 'last_seen']),
        ];
    }
}
