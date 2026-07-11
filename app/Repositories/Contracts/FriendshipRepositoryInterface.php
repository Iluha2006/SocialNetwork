<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface FriendshipRepositoryInterface
{
    public function getFriends(int $profileId): Collection;
    public function deleteFriendship(int $profileId, int $friendId): void;
}