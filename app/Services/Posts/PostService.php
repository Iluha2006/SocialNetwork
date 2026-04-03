<?php

namespace App\Services\Posts;

use App\Http\Requests\Post\CreatePostRequest;
use App\Jobs\Media\ProcessPostMediaJob;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostService
{


    public function getAllPosts()
    {
        return Post::with(['user' => fn ($q) => $q->with('profile')])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getUserPosts(int $userId)
    {
        return Post::with(['user' => fn ($q) => $q->with('profile')])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }


    public function store(CreatePostRequest $request): Post
    {

        $user = $request->user();
        $imageUrl = null;
    $videoUrl = null;

    $useQueue = $request->hasFile('video');
    $imageTempPath = null;
    $videoTempPath = null;
    $imageFileName = null;
    $videoFileName = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageFileName = time() . '_' . $image->getClientOriginalName();
            if ($useQueue) {
                $imageTempPath = $image->store('temp/post');
            } else {
                $path = "user_media/{$user->id}/images/{$imageFileName}";
                Storage::disk('s3')->put($path, file_get_contents($image), 'public');
                $imageUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $path;
            }
        }

        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoFileName = time() . '_' . $video->getClientOriginalName();
            $videoTempPath = $video->store('temp/post');
        }

        $post = Post::create([
            'title' => $request->title,
            'content' =>$request->content ?? null,
            'images' => $imageUrl,
            'videos' => $videoUrl,
            'user_id' => $user->id,
        ]);

        if ($useQueue && ($imageTempPath || $videoTempPath)) {
            ProcessPostMediaJob::dispatch(
                $post->id,
                $imageTempPath,
                $videoTempPath,
                $imageFileName,
                $videoFileName
            );
        }

        return $post->load(['user' => fn ($q) => $q->with('profile')]);
    }
}
