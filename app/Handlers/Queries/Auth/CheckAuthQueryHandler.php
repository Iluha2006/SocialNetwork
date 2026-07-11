<?php

namespace App\Handlers\Queries\Auth;

use App\Queries\Auth\CheckAuthQuery;

class CheckAuthQueryHandler
{
    public function handle(CheckAuthQuery $query): array
    {
        return [
            'authenticated' => $query->request->user() ? true : false,
            'user' => $query->request->user(),
        ];
    }
}
