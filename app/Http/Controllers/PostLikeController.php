<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Posts\LikePostCommand;
use App\Commands\Posts\UnlikePostCommand;
use App\Queries\Posts\GetPostLikesHistoryQuery;
use App\Queries\Posts\GetPostLikesQuery;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PostLikeController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function deleteLike(int $postId): JsonResponse
    {
        try {
            $result = $this->commandBus->dispatch(new UnlikePostCommand($postId));

            return response()->json($result);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Пост не найден'], 404);
        }
    }

    public function toggleLike(int $postId): JsonResponse
    {
        try {
            $result = $this->commandBus->dispatch(new LikePostCommand($postId));

            return response()->json($result);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Пост не найден'], 404);
        } catch (AuthenticationException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function getCount(int $postId): JsonResponse
    {
        try {
            return response()->json($this->queryBus->ask(new GetPostLikesQuery($postId)));
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Пост не найден'], 404);
        }
    }

    public function history(int $postId): JsonResponse
    {
        try {
            return response()->json($this->queryBus->ask(new GetPostLikesHistoryQuery($postId)));
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Пост не найден'], 404);
        }
    }
}
