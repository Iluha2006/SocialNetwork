<?php

namespace App\Handlers\Queries\Images;

use App\Models\ImageProfile;
use App\Queries\Images\GetUserImagesQuery;

class GetUserImagesQueryHandler
{
    public function handle(GetUserImagesQuery $query): array
    {
        $images = ImageProfile::where('user_id', $query->userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $images->toArray();
    }
}
