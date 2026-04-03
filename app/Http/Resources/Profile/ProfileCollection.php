<?php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProfileCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => ProfileResource::collection($this->collection),
        ];
    }
}
