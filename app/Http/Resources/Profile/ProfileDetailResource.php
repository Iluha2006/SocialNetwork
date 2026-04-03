<?php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->user_id,
            'avatar' => $this->avatar,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at,
            'bio' => $this->bio,
            'is_blocked' => $this->resource->is_blocked ?? false,
            'has_blocked_this_user' => $this->resource->has_blocked_this_user ?? false,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ],
        ];
    }
}
