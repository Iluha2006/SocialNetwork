<?php

namespace App\Handlers\Queries\Friends;

use App\Models\Profile;
use App\Queries\Friends\GetFriendsListQuery;
use App\Repositories\Contracts\FriendshipRepositoryInterface;

class GetFriendsListQueryHandler
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendshipRepo,
    ) {}

    public function handle(GetFriendsListQuery $query): array
    {
        $profile = Profile::where('user_id', $query->profileId)->first();

        if (!$profile) {
            throw new \RuntimeException('Профиль не найден', 404);
        }

        $friends = $this->friendshipRepo->getFriends($profile->id);

        return $friends->toArray();
    }
}
