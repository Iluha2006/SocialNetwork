<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Comments\CreateCommentCommand;
use App\Commands\Comments\DeleteCommentCommand;
use App\Models\Post;
use App\Queries\Comments\GetPostCommentsQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function store(Request $request, Post $post)
    {
        $request->validate(['comment' => 'required|string|max:1000']);

        $user = Auth::user();
       

        $commentData = $this->commandBus->dispatch(
            new CreateCommentCommand($post->id, $request->comment, $user->id)
        );

        return response()->json([
            'success' => true,
            'comment' => $commentData,
        ]);
    }

    public function index(Post $post)
    {
        return response()->json(
            $this->queryBus->ask(new GetPostCommentsQuery($post))
        );
    }

    public function destroy($commentId)
    {
        $this->commandBus->dispatch(new DeleteCommentCommand((int) $commentId));

        return response()->json([
            'success' => true,
            'message' => 'Сообщение удалено',
        ]);
    }
}
