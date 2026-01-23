<?php


use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use App\Broadcasting\MessageUser;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('chat.{id1}.{id2}', function ($user, $id1, $id2) {
    $ids = [(int) $id1, (int) $id2];
    return in_array((int) $user->id, $ids);
});

Broadcast::channel('call.{receiverId}', function ($user, $receiverId) {

    return (int) $user->id === (int) $receiverId;
});


Broadcast::channel('call-accept.{callerId}', function ($user, $callerId) {

    return (int) $user->id === (int) $callerId;
});


Broadcast::channel('call-reject.{callerId}', function ($user, $callerId) {

    return (int) $user->id === (int) $callerId;
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