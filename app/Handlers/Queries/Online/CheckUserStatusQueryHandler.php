<?php

namespace App\Handlers\Queries\Online;

use App\Models\User;
use App\Queries\Online\CheckUserStatusQuery;

class CheckUserStatusQueryHandler
{
    public function handle(CheckUserStatusQuery $query): array
    {
        $user = User::findOrFail($query->userId);

        return [
            'user_id' => $user->id,
            'name' => $user->name,
            'is_online' => $user->isOnline(),
            'last_seen' => $user->last_seen,
            'online_status' => $user->online_status,
        ];
    }
}
