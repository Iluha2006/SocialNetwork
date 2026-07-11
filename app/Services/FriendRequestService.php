<?php

namespace App\Services;

use App\Models\FriendRequest;
use App\Models\Friendship;
use Illuminate\Database\Eloquent\Collection;

class FriendRequestService
{
    public function sendFriendRequest(int $senderId, int $receiverId): array
    {
        
        if ($senderId === $receiverId) {
            return [
                'success' => false,
            ];
        }

        if ($this->friendshipExists($senderId, $receiverId)) {
            return [
                'success' => false,
             
            ];
        }

        $existingRequest = $this->findExistingRequest($senderId, $receiverId);

        if ($existingRequest) {
            return $this->handleExistingRequest($existingRequest, $senderId, $receiverId);
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
        return FriendRequest::where(function($query) use ($senderId, $receiverId) {
            $query->where('sender_id', $senderId)
                  ->where('receiver_id', $receiverId);
        })->orWhere(function($query) use ($senderId, $receiverId) {
            $query->where('sender_id', $receiverId)
                  ->where('receiver_id', $senderId);
        })->first();
    }

    private function handleExistingRequest(FriendRequest $existingRequest, int $senderId, int $receiverId): array
    {
        switch ($existingRequest->status) {
            case 'pending':
             
                if ($existingRequest->sender_id === $senderId) {
                    return [
                        'success' => false,
                    
                        
                    ];
                } 
            
                else {
                    return $this->acceptRequest($existingRequest);
                }

            case 'accepted':
                return [
                    'success' => false,
                    'message' => 'Пользователь уже в друзьях',
                    'code' => 'ALREADY_FRIENDS'
                ];

            case 'rejected':
                if ($existingRequest->sender_id === $senderId) {
                    return $this->renewRejectedRequest($existingRequest);
                } 
                else {
                    return [
                        'success' => false,
                        'message' => 'Вы отклонили заявку от этого пользователя',
                        'code' => 'YOU_REJECTED_REQUEST'
                    ];
                }

            default:
                return [
                    'success' => false,
                ];
        }
    }

    private function renewRejectedRequest(FriendRequest $request): array
    {
        $request->update([
            'status' => 'pending',
            'updated_at' => now()
        ]);

        return [
            'success' => true,
            'request' => $request->load('sender:id,name,email', 'receiver:id,name,email'),
            'message' => 'Заявка отправлена повторно',
            'code' => 'REQUEST_RENEWED'
        ];
    }

    private function createNewRequest(int $senderId, int $receiverId): array
    {
        $friendRequest = FriendRequest::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'status' => 'pending'
        ]);

        return [
            'success' => true,
            'request' => $friendRequest->load('sender:id,name,email', 'receiver:id,name,email'),
            'message' => 'Заявка отправлена',
            'code' => 'REQUEST_SENT'
        ];
    }

    public function acceptRequest(FriendRequest $request): array
    {
      
        if ($request->status !== 'pending') {
            return [
                'success' => false,
               
            ];
        }

     
        Friendship::firstOrCreate([
            'user_id' => $request->sender_id,
            'friend_id' => $request->receiver_id
        ]);

        Friendship::firstOrCreate([
            'user_id' => $request->receiver_id,
            'friend_id' => $request->sender_id
        ]);

        
        $request->update(['status' => 'accepted']);

        return [
            'success' => true,
            'request' => $request->load('sender:id,name,email', 'receiver:id,name,email'),
            'message' => 'Заявка принята',
            'code' => 'REQUEST_ACCEPTED'
        ];
    }

    public function rejectRequestById(int $requestId, int $userId): array
    {
        $friendRequest = FriendRequest::where('id', $requestId)
            ->where('receiver_id', $userId)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return [
                'success' => false,
            
            ];
        }

        $friendRequest->update(['status' => 'rejected']);

        return [
            'success' => true,
            'request' => $friendRequest->load('sender:id,name,email', 'receiver:id,name,email'),
         
           
        ];
    }

    public function getRequests(int $profileId): array
    {
        return [
            'success' => true,
            'incoming' => $this->getIncomingRequests($profileId),
            'outgoing' => $this->getOutgoingRequests($profileId)
        ];
    }

    private function getIncomingRequests(int $profileId): Collection
    {
        return FriendRequest::select(['id', 'sender_id', 'receiver_id', 'status', 'created_at'])
            ->with('sender:id,name')
            ->where('receiver_id', $profileId)
            ->where('status', 'pending')
            ->get();
    }

    private function getOutgoingRequests(int $profileId): Collection
    {
        return FriendRequest::select(['id', 'sender_id', 'receiver_id', 'status', 'created_at'])
            ->with('receiver:id,name')
            ->where('sender_id', $profileId)
            ->where('status', 'pending')
            ->get();
    }

    public function cancelRequest(int $requestId, int $userId): array
    {
        $request = FriendRequest::where('id', $requestId)
            ->where('sender_id', $userId)
            ->where('status', 'pending')
            ->first();

        if (!$request) {
            return [
                'success' => false,
                'message' => 'Заявка не найдена',
                'code' => 'REQUEST_NOT_FOUND'
            ];
        }

        $request->delete();

        return [
            'success' => true,
            'message' => 'Заявка отменена',
           
        ];
    }
}