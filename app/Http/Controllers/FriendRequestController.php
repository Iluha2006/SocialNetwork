<?php

namespace App\Http\Controllers;

use App\Services\FriendRequestService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FriendRequestController extends Controller
{
    private FriendRequestService $friendRequestService;
    public function __construct(FriendRequestService $friendRequestService)
    {
        $this->friendRequestService = $friendRequestService;
    }

    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate(
        [
            'sender_id' => 'required|exists:profiles,id',
            'receiver_id' => 'required|exists:profiles,id|different:sender_id'
        ]);
            $result = $this->friendRequestService->sendFriendRequest(
                $validated['sender_id'],
                $validated['receiver_id']
            );

            return response()->json($result['request'], 201);


    }

    public function accept($requestId): JsonResponse
    {
            $this->friendRequestService->acceptRequest($requestId);
            return response()->json(['message' => 'Заявка принята']);
    }

    public function reject($requestId): JsonResponse
    {

            $this->friendRequestService->rejectRequest($requestId);
            return response()->json(['message' => 'Заявка отклонена']);


    }

    public function getRequests($profileId): JsonResponse
    {

            $requests = $this->friendRequestService->getRequests($profileId);
            return response()->json($requests);


    }

    public function cancel(Request $request, $requestId): JsonResponse
    {

            $this->friendRequestService->cancelRequest(
                $requestId,
                $request->user()->profile->id
            );
            return response()->json(['message' => 'Заявка отменена']);
    }
}
