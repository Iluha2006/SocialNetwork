<?php

namespace App\Http\Controllers\Settings;
use App\Http\Resources\Profile\ProfileResource;
use App\Http\Resources\Profile\ProfileShowResource;
use Illuminate\Support\Facades\Auth;
use App\Contracts\Profile\ProfileServiceInterface;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\Profile\ProfileCollection;
use App\Http\Resources\Profile\ProfileDetailResource;
use App\Http\Resources\BlockedUser\BlockedUserResource;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileServiceInterface $profileService
    ) {}

    public function show($id)
    {

        $data = $this->profileService->show((int) $id);

        return (new ProfileShowResource($data['profile']))
        ->additional([
            'is_blocked' => $data['is_blocked'],
            'has_blocked_this_user' => $data['has_blocked_this_user'],
        ]);
    }

    public function index()
    {
        $profiles = $this->profileService->index();

        return (new ProfileCollection($profiles))->response();
    }

    public function block($userId)
    {

            $result = $this->profileService->block((int) $userId);
            return response()->json($result);

    }

    public function unblock($userId)
    {

            $result = $this->profileService->unblock((int) $userId);
            return response()->json($result);

    }

    public function update(UpdateProfileRequest $request, $id)
    {

        $validatedData = $request->validated();
        $updatedProfile = $this->profileService->update($validatedData, (int) $id);

        return (new ProfileResource($updatedProfile))->response();
    }

    public function destroy($id)
    {

            $this->profileService->destroy((int) $id);
            return response()->json([
                'message' => 'Профиль успешно удален',
            ], 200);

    }

    public function updateAvatar(Request $request)
    {

            $result = $this->profileService->updateAvatar($request);
            return response()->json($result);

    }

    public function getBlockedUsers()
    {

            $result = $this->profileService->getBlockedUsers();
            return response()->json($result);

    }

    public function getFriends($id)
    {
        $friends = $this->profileService->getFriends((int) $id);
        return response()->json($friends);
    }

}