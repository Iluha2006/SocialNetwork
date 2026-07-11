<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Friends\AcceptFriendRequestCommand;
use App\Commands\Friends\CancelFriendRequestCommand;
use App\Commands\Friends\RejectFriendRequestCommand;
use App\Commands\Friends\SendFriendRequestCommand;
use App\Models\FriendRequest;
use App\Models\Profile;
use App\Queries\Friends\GetFriendRequestsQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FriendRequestController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function send(Request $request): JsonResponse
    {
        if (!$request->user()) {
            return response()->json(['success' => false, 'message' => 'Пользователь не авторизован'], 401);
        }

        $validated = $request->validate([
            'receiver_id' => 'required|exists:profiles,user_id',
        ]);

        $senderId = $request->user()->profile->id;

        $receiverProfile = Profile::where('user_id', $validated['receiver_id'])->first();
        if (!$receiverProfile) {
            return response()->json(['success' => false, 'message' => 'Профиль не найден'], 404);
        }

        $result = $this->commandBus->dispatch(
            new SendFriendRequestCommand($senderId, $receiverProfile->id)
        );

        return response()->json($result, $result['success'] ? 201 : 400);
    }

    public function accept(Request $request, int $requestId): JsonResponse
    {
        $friendRequest = FriendRequest::find($requestId);

        if (!$friendRequest) {
            return response()->json(['success' => false], 404);
        }

        $result = $this->commandBus->dispatch(new AcceptFriendRequestCommand($friendRequest));

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function reject(Request $request, int $requestId): JsonResponse
    {
        $userId = $request->user()->profile->id;

        $result = $this->commandBus->dispatch(
            new RejectFriendRequestCommand($requestId, $userId)
        );

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function getRequests(int $userId): JsonResponse
    {
        $profile = Profile::where('user_id', $userId)->first();
        if (!$profile) {
            return response()->json(['success' => false, 'message' => 'Профиль не найден'], 404);
        }

        return response()->json(
            $this->queryBus->ask(new GetFriendRequestsQuery($profile->id))
        );
    }

    public function cancel(Request $request, int $requestId): JsonResponse
    {
        if (!$request->user()) {
            return response()->json(['success' => false, 'message' => 'Пользователь не авторизован'], 401);
        }

        $this->commandBus->dispatch(
            new CancelFriendRequestCommand($requestId, $request->user()->profile->id)
        );

        return response()->json(['message' => 'Заявка отменена']);
    }
}
