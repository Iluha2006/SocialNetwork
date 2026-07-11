<?php

namespace App\Handlers\Queries\Carer;

use App\Models\Carer;
use App\Queries\Carer\GetCarersQuery;

class GetCarersQueryHandler
{
    public function handle(GetCarersQuery $query): array
    {
        $carers = Carer::where('user_id', $query->userId)->get();

        return $carers->toArray();
    }
}
