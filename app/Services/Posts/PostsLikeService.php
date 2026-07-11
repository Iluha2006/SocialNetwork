<?php

namespace App\Services\Posts;

use App\Contracts\Posts\LikePost;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class PostsLikeService   implements LikePost { 
    public function likePost(int $postId): array
    {
        $user = $this->resolveCurrentUser();
        if (!$user) {
            throw new \Illuminate\Auth\AuthenticationException('Unauthenticated.');
        }
        
        $post = Post::findOrFail($postId);


        $like = $post->likes()->where('user_id', $user->id)->first();

        if ($like) {
           
            $like->delete();
            $post->decrement('likes_count');
            return ['liked' => false, 'total_likes' => $post->likes_count];
        }

    
        $post->likes()->create([
            'user_id' => $user->id,
            'post_id' => $postId
        ]);
        $post->increment('likes_count');

        return ['liked' => true, 'total_likes' => $post->likes_count];
    }

    public function deleteLike(int $postId): bool
    {
        $user = $this->resolveCurrentUser();
        if (!$user) {
            throw new \Illuminate\Auth\AuthenticationException('Unauthenticated.');
        }

        $post = Post::findOrFail($postId);
        
        $deleted = $post->likes()
                        ->where('user_id', $user->id)
                        ->delete();

        if ($deleted) {
            $post->decrement('likes_count');
        }

        return (bool) $deleted;
    }

    public function getCountLike(int $postId): array 
    {
        $post = Post::findOrFail($postId);
        $user = $this->resolveCurrentUser();
        
        $liked = $user 
            ? $post->likes()->where('user_id', $user->id)->exists() 
            : false;
        
        return [
            'count' => $post->likes_count,
            'liked' => $liked,
        ];
    }


    public function historyLikePost(int $postId)
    {
        return Post::findOrFail($postId)
                   ->likes()
                   ->with('user')
                   ->latest()
                   ->get();
    }

    protected function resolveCurrentUser()
    {
        return Auth::guard('api')->user() 
            ?? Auth::guard('web')->user() 
            ?? Auth::user();
    }
}