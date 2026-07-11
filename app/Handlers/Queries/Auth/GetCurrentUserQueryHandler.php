<?php

namespace App\Handlers\Queries\Auth;

use App\Queries\Auth\GetCurrentUserQuery;

class GetCurrentUserQueryHandler
{
    public function handle(GetCurrentUserQuery $query): array
    {
        $user = $query->request->user();

        if (!$user) {
            throw new \RuntimeException('User not authenticated', 401);
        }

        $user->load('profile');

        return [
            'success' => true,
            'data' => $user,
        ];
    }
}
