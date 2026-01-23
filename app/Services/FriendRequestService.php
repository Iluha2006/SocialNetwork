<?php

namespace App\Services;

use App\Models\FriendRequest;
use App\Models\Friendship;
use Illuminate\Database\Eloquent\Collection;

class FriendRequestService
{
    public function sendFriendRequest(int $senderId, int $receiverId): array
{

    if ($this->friendshipExists($senderId, $receiverId)) {
        throw new \RuntimeException('Пользователь уже в друзьях', 400);
    }


    $existingRequest = $this->findExistingRequest($senderId, $receiverId);

    if ($existingRequest) {
        return $this->handleExistingRequest($existingRequest, $senderId);
    }


    return $this->createNewRequest($senderId, $receiverId);
}


     public function friendshipExists(int $userId1, int $userId2): bool
    {
        return Friendship::where(function($query) use ($userId1, $userId2) {
            $query->where('user_id', $userId1)
                  ->where('friend_id', $userId2);
        })->orWhere(function($query) use ($userId1, $userId2) {
            $query->where('user_id', $userId2)
                  ->where('friend_id', $userId1);
        })->exists();
    }

    private function findExistingRequest(int $senderId, int $receiverId): ?FriendRequest
    {
        return FriendRequest::where(function($query) use ($senderId, $receiverId)
        {
            $query->where('sender_id', $senderId)
                  ->where('receiver_id', $receiverId);
        })->orWhere(function($query) use ($senderId, $receiverId) {
            $query->where('sender_id', $receiverId)
                  ->where('receiver_id', $senderId);
        })->first();
    }

    private function handleExistingRequest(FriendRequest $existingRequest, int $senderId): array
{
    switch ($existingRequest->status) {
        case 'pending':
            if ($existingRequest->sender_id == $senderId) {
                throw new \RuntimeException('Вы уже отправили заявку этому пользователю', 400);
            } else {

                throw new \RuntimeException('Этот пользователь уже отправил вам заявку', 400);
            }

        case 'accepted':
            throw new \RuntimeException('Пользователь уже в друзьях', 400);

        case 'rejected':
            if ($existingRequest->sender_id == $senderId) {
                $this->renewRejectedRequest($existingRequest);
                return [
                    'request' => $existingRequest->load('sender', 'receiver'),
                    'message' => 'Заявка обновлена'
                ];
            } else {
                throw new \RuntimeException('Нельзя отправить заявку после отклонения', 400);
            }
    }

    throw new \RuntimeException('Неизвестный статус заявки', 400);
}
    private function renewRejectedRequest(FriendRequest $request): void
    {
        $request->update([
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    private function createNewRequest(int $senderId, int $receiverId): array
    {
        $friendRequest = FriendRequest::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'status' => 'pending'
        ]);

        return [
            'request' => $friendRequest->load('sender', 'receiver'),
            'message' => 'Заявка отправлена'
        ];
    }

    public function acceptRequest(int $requestId): void
    {
        $friendRequest = FriendRequest::findOrFail($requestId);

            Friendship::firstOrCreate([
                'user_id' => $friendRequest->sender_id,
                'friend_id' => $friendRequest->receiver_id
            ]);

            Friendship::firstOrCreate([
                'user_id' => $friendRequest->receiver_id,
                'friend_id' => $friendRequest->sender_id
            ]);

            $friendRequest->update(['status' => 'accepted']);

    }

    public function rejectRequest(int $requestId): void
    {
        $friendRequest = FriendRequest::findOrFail($requestId);

        $friendRequest->update(['status' => 'rejected']);
    }

    public function getRequests(int $profileId): array
    {
        return [
            'incoming' => $this->getIncomingRequests($profileId),
            'outgoing' => $this->getOutgoingRequests($profileId)
        ];
    }

    private function getIncomingRequests(int $profileId): Collection
    {
        return FriendRequest::with('sender')
            ->where('receiver_id', $profileId)
            ->where('status', 'pending')
            ->get();
    }

    private function getOutgoingRequests(int $profileId): Collection
    {
        return FriendRequest::with('receiver')
            ->where('sender_id', $profileId)
            ->where('status', 'pending')
            ->get();
    }

    public function cancelRequest(int $requestId, int $userId): void
    {
        $request = FriendRequest::where('id', $requestId)
            ->where('sender_id', $userId)
            ->where('status', 'pending')
            ->firstOrFail();

        $request->delete();
    }
}
