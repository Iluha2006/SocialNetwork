<?php


namespace App\Http\Resources\Post;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        $profile = $this->user?->profile;
        
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'images' => $this->images ,
            'videos' => $this->videos ,
            'user_id' => $this->user_id,
            'likes_count' => $this->likes_count,
            'created_at' => $this->created_at,
            'profile' => $profile ? [
                'id' => $profile->id,
                'user_id' => $profile->user_id,
                'name' => $profile->name,
                'avatar' => $profile->avatar,
                'bio' => $profile->bio,
            ] : null,
        ];
    }
}