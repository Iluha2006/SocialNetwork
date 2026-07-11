<?php


use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use App\Broadcasting\MessageUser;

Broadcast::channel('user.{id}', function (User $user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('audio.{id}', function (User $user, $id) {
    return (int) $user->id === (int) $id;
});



Broadcast::channel('chat.{id1}.{id2}', function ($user, $id1, $id2) {
    $ids = [(int) $id1, (int) $id2];
    return in_array((int) $user->id, $ids);
});


Broadcast::channel('call.{userId}', function (User $user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('call-accept.{callerId}', function (User $user, $callerId) {
    return (int) $user->id === (int) $callerId;
});

Broadcast::channel('call-reject.{callerId}', function (User $user, $callerId) {
    return (int) $user->id === (int) $callerId;
});

Broadcast::channel('call-end.{id1}.{id2}', function (User $user, $id1, $id2) {
    return $user->id === (int) $id1 || $user->id === (int) $id2;
});

Broadcast::channel('online-status', function ($user) {
    if ($user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email
        ];
    }
    return null;
});


Broadcast::channel('messages', function ($user) {
    return $user !== null;
});
