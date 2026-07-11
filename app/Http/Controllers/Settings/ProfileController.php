<?php

namespace App\Http\Controllers\Settings;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Profile\BlockUserCommand;
use App\Commands\Profile\DeleteProfileCommand;
use App\Commands\Profile\UnblockUserCommand;
use App\Commands\Profile\UpdateAvatarCommand;
use App\Commands\Profile\UpdateProfileCommand;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Queries\Profile\GetAllProfilesQuery;
use App\Queries\Profile\GetBlockedUsersQuery;
use App\Queries\Profile\GetFriendsQuery;
use App\Queries\Profile\GetProfileQuery;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function show($id)
    {
        $profileShowData = $this->queryBus->ask(new GetProfileQuery((int) $id));

        return response()->json([
            'profile' => $profileShowData->profile,
            'is_blocked' => $profileShowData->is_blocked,
            'has_blocked_this_user' => $profileShowData->has_blocked_this_user,
        ]);
    }

    public function index()
    {
        $profiles = $this->queryBus->ask(new GetAllProfilesQuery());

        return response()->json(['data' => $profiles]);
    }

    public function block($userId)
    {
        return response()->json(
            $this->commandBus->dispatch(new BlockUserCommand((int) $userId))
        );
    }

    public function unblock($userId)
    {
        return response()->json(
            $this->commandBus->dispatch(new UnblockUserCommand((int) $userId))
        );
    }

    public function update(UpdateProfileRequest $request, $id)
    {
        $profileData = $this->commandBus->dispatch(
            new UpdateProfileCommand($request->validated(), (int) $id)
        );

        return response()->json($profileData);
    }

    public function destroy($id)
    {
        $this->commandBus->dispatch(new DeleteProfileCommand((int) $id));

        return response()->json(['message' => 'Профиль успешно удален'], 200);
    }

    public function updateAvatar(Request $request)
    {
        return response()->json(
            $this->commandBus->dispatch(new UpdateAvatarCommand($request))
        );
    }

    public function getBlockedUsers()
    {
        return response()->json($this->queryBus->ask(new GetBlockedUsersQuery()));
    }

    public function getFriends($id)
    {
        return response()->json($this->queryBus->ask(new GetFriendsQuery((int) $id)));
    }
}
