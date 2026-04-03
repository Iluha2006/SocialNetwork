<?php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $profile = $this->resource;
        $user = $profile->user;

        return [
            'user_id' => $profile->user_id,
            'avatar' => $profile->avatar,
            'name' => $profile->name,
            'email' => $profile->email,
            'created_at' => $profile->created_at?->toIso8601String(),
            'bio' => $profile->bio,
            'is_blocked' => $this->when(isset($this->additional['is_blocked']), $this->additional['is_blocked']),
            'has_blocked_this_user' => $this->when(isset($this->additional['has_blocked_this_user']), $this->additional['has_blocked_this_user']),
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ] : null,
        ];
    }
}
