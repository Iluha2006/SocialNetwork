<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Friends\DeleteFriendCommand;
use App\Queries\Friends\CheckFriendshipQuery;
use App\Queries\Friends\GetFriendsListQuery;
use App\Queries\Friends\GetFriendshipStatusQuery;
use Illuminate\Http\JsonResponse;

class FriendshipController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function getFriends(int $userId): JsonResponse
    {
        $friends = $this->queryBus->ask(new GetFriendsListQuery($userId));

        return response()->json($friends, 200);
    }

    public function deleteFriend(int $userId, int $friendUserId): JsonResponse
    {
        $this->commandBus->dispatch(new DeleteFriendCommand($userId, $friendUserId));

        return response()->json(['message' => 'Друг удален']);
    }

    public function checkFriendship(int $profileId, int $friendId): JsonResponse
    {
        return response()->json(
            $this->queryBus->ask(new CheckFriendshipQuery($profileId, $friendId))
        );
    }

    public function getFriendshipStatus(int $userId, int $otherUserId): JsonResponse
    {
        return response()->json(
            $this->queryBus->ask(new GetFriendshipStatusQuery($userId, $otherUserId))
        );
    }
}
