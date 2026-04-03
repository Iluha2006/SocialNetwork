<?php

namespace App\Http\Controllers;

use App\Models\CommentPost;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        $user = $request->user();

        $comment = CommentPost::create([
            'comment' => $request->comment,
            'user_id' => $user->id,
            'post_id' => $post->id
        ])->load('user', 'user.profile');

        return response()->json([
            'success' => true,
            'comment' => $comment
        ]);
    }
    public function index(Post $post)
    {
        $comments = $post->comments()->with('user')->with('user.profile')->latest()->get();
        return response()->json([
            'comments' => $comments
        ]);
    }


    public function destroy(Request $request, $commentId)
    {
        $user = $request->user();
        $comment = CommentPost::findOrFail($commentId);
        $comment->delete();
        return response()->json([
            'success' => true,
            'message' => 'Сообщение удалено'
        ]);
    }
}