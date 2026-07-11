<?php
// app/Http/Resources/Profile/ProfileShowResource.php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileShowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $profile = $this->resource;
        $user = $profile->user;

        return [
 
            'profile' => [
                'id' => $profile->user_id,
                'avatar' => $profile->avatar,
                'name' => $profile->name,
                'email' => $profile->email,
                'bio' => $profile->bio,
                'created_at' => $user?->created_at, 
                'updated_at' => $profile->updated_at,
            ],
            
            'is_blocked' => $this->when(isset($this->additional['is_blocked']), $this->additional['is_blocked']),
            'has_blocked_this_user' => $this->when(isset($this->additional['has_blocked_this_user']), $this->additional['has_blocked_this_user']),
        ];
    }
}