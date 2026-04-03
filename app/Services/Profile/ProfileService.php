<?php

namespace App\Services\Profile;

use App\Contracts\Profile\ProfileServiceInterface;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Models\Profile;

class ProfileService implements ProfileServiceInterface
{



    public function show(int $userId): array
    {

        $profile =  Profile::where('user_id', $userId)->first();
        $currentUser = $this->resolveCurrentUser();

        $isBlocked = false;
        $hasBlockedThisUser = false;

        if ($currentUser ) {
            $isBlocked = $profile->user->hasBlocked($currentUser);
            $hasBlockedThisUser = $currentUser->hasBlocked($profile->user);
        }

        return [
            'profile' => $profile,
            'is_blocked' => $isBlocked,
            'has_blocked_this_user' => $hasBlockedThisUser,
        ];
    }
    protected function resolveCurrentUser(): ?User
    {
        return Auth::guard('api')->user() ?? Auth::guard('web')->user();
    }

    public function index(): iterable
    {
        $profile= Profile::with('user:id,name,email')
            ->orderBy('id')
            ->get(['id', 'user_id', 'name', 'email', 'avatar']);


            return $profile;
    }

    public function block(int $userId): array
    {
        $currentUser = Auth::guard('api')->user() ?? Auth::guard('web')->user();


        $userToBlock = User::find($userId);
        if (!$userToBlock) {
            throw new \RuntimeException('Пользователь не найден', 404);
        }

        if ($currentUser->id === $userId) {
            throw new \RuntimeException('Нельзя заблокировать себя', 400);
        }

        $alreadyBlocked = $currentUser->blocks()
            ->where('blocked_id', $userId)
            ->exists();

        if ($alreadyBlocked) {
            throw new \RuntimeException('Пользователь уже заблокирован', 400);
        }

        $currentUser->blocks()->create(['blocked_id' => $userId]);

        return [
            'success' => true,
            'blocked' => true,
            'message' => 'Пользователь успешно заблокирован',
        ];
    }

    public function unblock(int $userId): array
    {
        $currentUser = Auth::guard('api')->user() ?? Auth::guard('web')->user();

        $userToUnblock = User::find($userId);
        if (!$userToUnblock) {
            throw new \RuntimeException('Пользователь не найден', 404);
        }

        $block = $currentUser->blocks()->where('blocked_id', $userId)->first();

        if (!$block) {
            throw new \RuntimeException('Пользователь не был заблокирован', 400);
        }

        $block->delete();

        return [
            'success' => true,
            'blocked' => false,
            'message' => 'Пользователь успешно разблокирован',
        ];
    }

    public function update(array $data, int $id): Profile
    {

        $profile = Profile::findOrFail($id);

        $profile->update($data);
        return $profile->load('user');
    }

    public function destroy(int $id): void
    {
        $profile = Profile::find($id);
        if (!$profile) {
            throw new \RuntimeException('Профиль не найден', 404);
        }

        $profile->delete();
    }

    public function updateAvatar(Request $request): array
    {
        $validated = $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        if (!$user) {
            throw new \RuntimeException('Unauthorized', 401);
        }

        $file = $request->file('avatar');
        $fileName = 'avatar_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = "avatars/{$fileName}";
        Storage::disk('s3')->put($path, file_get_contents($file), 'public');

        $avatarUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $path;

        $profile = Profile::where('user_id', $user->id)->first();
        if ($profile) {
            if ($profile->avatar) {
                $oldPath = parse_url($profile->avatar, PHP_URL_PATH);
                if ($oldPath) {
                    Storage::disk('s3')->delete(ltrim($oldPath, '/'));
                }
            }

            $profile->avatar = $avatarUrl;
            $profile->save();
        }

        return [
            'success' => true,
            'avatar' => $avatarUrl,
            'message' => 'Avatar updated successfully',
        ];
    }

    public function getBlockedUsers(): array
    {
        $currentUser =Auth::guard('api')->user() ?? Auth::guard('web')->user();

        if (!$currentUser) {
            throw new \RuntimeException('Пользователь не аутентифицирован', 401);
        }

        $blockedUsers = $currentUser->blocks()
            ->with('blocked.profile:id,user_id,name,email,avatar')
            ->get(['blocked_id'])
            ->pluck('blocked')
            ->filter()
            ->map(function ($blockedUser) {
                return [
                    'id' => $blockedUser->id,
                    'name' => $blockedUser->profile?->name ?? $blockedUser->name,
                    'email' => $blockedUser->profile?->email ?? $blockedUser->email,
                    'avatar' => $blockedUser->profile?->avatar,
                ];
            });

        return [
            'success' => true,
            'blocked_users' => $blockedUsers,
            'count' => $blockedUsers->count(),
        ];
    }

    public function getFriends(int $profileId): iterable
    {
        $profile = Profile::with('friends')->findOrFail($profileId);
        return $profile->friends;
    }

    public function getImages(int $userId): iterable
    {
        return \App\Models\ImageProfile::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}