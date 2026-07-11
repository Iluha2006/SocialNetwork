<?php

namespace App\Handlers\Commands\Friends;

use App\Commands\Friends\DeleteFriendCommand;
use App\Repositories\Contracts\FriendshipRepositoryInterface;

class DeleteFriendCommandHandler
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendshipRepo,
    ) {}

    public function handle(DeleteFriendCommand $command): void
    {
        $this->friendshipRepo->deleteFriendship(
            $command->profileId,
            $command->friendProfileId,
        );
    }
}
