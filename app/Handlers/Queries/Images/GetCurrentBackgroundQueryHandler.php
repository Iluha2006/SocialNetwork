<?php

namespace App\Handlers\Queries\Images;

use App\Models\ImagesBacround;
use App\Queries\Images\GetCurrentBackgroundQuery;

class GetCurrentBackgroundQueryHandler
{
    public function handle(GetCurrentBackgroundQuery $query): array
    {
        $background = ImagesBacround::where('user_id', $query->userId)->first();

        return [
            'success' => true,
            'background' => $background ? $background->path_image : null,
        ];
    }
}
