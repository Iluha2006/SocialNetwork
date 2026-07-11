<?php

namespace App\Services\Posts;

use App\Contracts\Cache\CacheServiceInterface;
use App\Http\Requests\Post\CreatePostRequest;
use App\Jobs\Media\ProcessPostMediaJob;
use App\Models\LikesPost;
use App\Models\Post;

class PostService
{
    
    private const POSTS_ALL_TTL = 3600;      
    private const POSTS_USER_TTL = 1800;     

    private const KEY_ALL_POSTS = 'posts:all';
    private const KEY_USER_POSTS = 'posts:user';

    public function __construct(
        private readonly CacheServiceInterface $cache
    ) {}

   
    public function getAllPosts()
    {
        $posts = $this->cache->remember(
            key: self::KEY_ALL_POSTS,
            ttl: self::POSTS_ALL_TTL,
            callback: fn () => Post::select(['id', 'title', 'content', 'images', 'videos', 'user_id', 'likes_count', 'created_at'])
                ->with('user.profile:user_id,name,avatar,bio,id')
                ->latest('created_at')
                ->limit(50)
                ->get()
        );

        $this->loadIsLiked($posts);

        return $posts;
    }

   
    public function getUserPosts(int $userId)
    {
        $key = self::KEY_USER_POSTS . ":{$userId}";
        
        $posts = $this->cache->remember(
            key: $key,
            ttl: self::POSTS_USER_TTL,
            callback: fn () => Post::select(['id', 'title', 'content', 'images', 'videos', 'user_id', 'likes_count', 'created_at'])
                ->with('user.profile:user_id,name,avatar,bio,id')
                ->where('user_id', $userId)
                ->latest('created_at')
                ->limit(50)
                ->get()
        );

        $this->loadIsLiked($posts);

        return $posts;
    }

  
    public function store(CreatePostRequest $request): Post
    {
        $user = $request->user();
        $imageTempPath = $videoTempPath = $imageFileName = $videoFileName = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageFileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $imageTempPath = $image->storeAs('temp/post', $imageFileName, 's3');
        }

        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoFileName = time() . '_' . uniqid() . '.' . $video->getClientOriginalExtension();
            $videoTempPath = $video->storeAs('temp/post', $videoFileName, 's3');
        }

        $post = Post::create([
            'title'   => $request->title,
            'content' => $request->content,
            'images'  => null,
            'videos'  => null,
            'user_id' => $user->id,
        ]);

        if ($imageTempPath || $videoTempPath) {
            ProcessPostMediaJob::dispatch(
                postId: $post->id,
                imageTempPath: $imageTempPath,
                videoTempPath: $videoTempPath,
                imageFileName: $imageFileName,
                videoFileName: $videoFileName
            );
        }

    
        $this->invalidateCache($post->user_id);

        return $post->load('user.profile:user_id,name,avatar,bio,id');
    }

   
    private function invalidateCache(int $userId): void
    {
    
        $this->cache->forget(self::KEY_ALL_POSTS);
        
        
        $this->cache->forget(self::KEY_USER_POSTS . ":{$userId}");
    }

    
    public function clearAllPostsCache(): void
    {
        $this->cache->forget(self::KEY_ALL_POSTS);
    }

    
    public function clearUserPostsCache(int $userId): void
    {
        $this->cache->forget(self::KEY_USER_POSTS . ":{$userId}");
    }

    private function loadIsLiked(iterable $posts): void
    {
        $userId = auth()->id();
        if (!$userId || $posts instanceof \Illuminate\Database\Eloquent\Model) {
            return;
        }

        $postIds = collect($posts)->pluck('id')->filter()->toArray();
        if (empty($postIds)) {
            return;
        }

        $likedIds = LikesPost::whereIn('post_id', $postIds)
            ->where('user_id', $userId)
            ->pluck('post_id')
            ->toArray();

        foreach ($posts as $post) {
            $post->is_liked = in_array($post->id, $likedIds);
        }
    }
}