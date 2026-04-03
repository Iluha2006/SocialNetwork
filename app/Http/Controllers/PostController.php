<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\CreatePostRequest;
use App\Http\Resources\Post\PostCollection;
use App\Http\Resources\Post\PostResource;
use App\Services\Posts\PostService;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService
    ) {}

    public function getAllPosts()
    {
        $posts = $this->postService->getAllPosts();
        return (new PostCollection($posts))->response();
    }

    public function store(CreatePostRequest $request)
    {
        $post = $this->postService->store($request);
        return response()->json([
            'success' => true,
            'message' => $request->hasFile('video')
                ? 'Post created, media is being processed'
                : 'Post created successfully',
            'post' => new PostResource($post),
        ], 201);
    }

    public function getUserPosts($userId)
    {
        $posts = $this->postService->getUserPosts((int) $userId);
        return (new PostCollection($posts))->response();
    }
}