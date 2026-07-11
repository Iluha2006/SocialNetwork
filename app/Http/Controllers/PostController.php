<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Posts\CreatePostCommand;
use App\Http\Requests\Post\CreatePostRequest;
use App\Queries\Posts\GetAllPostsQuery;
use App\Queries\Posts\GetUserPostsQuery;

class PostController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function getAllPosts()
    {
        $data = $this->queryBus->ask(new GetAllPostsQuery());

        return response()->json(['data' => $data]);
    }

    public function store(CreatePostRequest $request)
    {
        $postData = $this->commandBus->dispatch(new CreatePostCommand($request));

        return response()->json([
            'success' => true,
            'post' => $postData,
        ], 201);
    }

    public function getUserPosts($userId)
    {
        $data = $this->queryBus->ask(new GetUserPostsQuery((int) $userId));

        return response()->json(['data' => $data]);
    }
}
