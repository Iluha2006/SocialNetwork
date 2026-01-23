<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(Post::all());
    }

    public function getAllPosts()
    {
        $posts = Post::with(['user' => function($query) {
                $query->with('profile');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'video' => 'nullable|file|mimes:mp4,mov,avi,wmv,mkv,webm|max:102400',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $user = $request->user();
        $imageUrl = null;
        $videoUrl = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '_' . $image->getClientOriginalName();
            $path = "user_media/{$user->id}/images/{$filename}";


            Storage::disk('s3')->put($path, file_get_contents($image), 'public');



             $imageUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $path;
        }

        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $filename = time() . '_' . $video->getClientOriginalName();
            $path = "user_media/{$user->id}/videos/{$filename}";


            Storage::disk('s3')->put($path, file_get_contents($video), 'public');



             $videoUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $path;
        }

        $post = Post::create([
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,
            'images' => $imageUrl,
            'videos' => $videoUrl,
            'user_id' => $user->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Post created successfully',
            'post' => $post
        ]);
    }
}