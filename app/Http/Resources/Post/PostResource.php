<?php

namespace App\Http\Resources\Post;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'images' => $this->images,
            'videos' => $this->videos,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'profile' => $this->user->profile ? [
                    'id' => $this->user->profile->id,
                    'avatar' => $this->user->profile->avatar,
                    'name' => $this->user->profile->name,
                ] : null,
            ]),
        ];
    }
}
