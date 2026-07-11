<?php

namespace App\Handlers\Queries\Online;

use App\Models\User;
use App\Queries\Online\GetOnlineUsersQuery;

class GetOnlineUsersQueryHandler
{
    public function handle(GetOnlineUsersQuery $query): array
    {
        $onlineUsers = User::where('online_status', 'online')
            ->get(['id', 'name', 'last_seen']);

        return ['online_users' => $onlineUsers];
    }
}
