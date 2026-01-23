<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show($id)
    {
        $profile = Profile::with("user")->find($id);

        if (!$profile->user) {
            return response()->json(['message' => 'Пользователь не найден'], 404);
        }

        $currentUser = auth()->user();
        $isBlocked = false;
        $hasBlockedThisUser = false;

        if ($currentUser) {
            $isBlocked = $profile->user->hasBlocked($currentUser);
            $hasBlockedThisUser = $currentUser->hasBlocked($profile->user);
        }

        return response()->json([
            'user_id' => $profile->user_id,
            'avatar' => $profile->avatar,
            'name' => $profile->name,
            'email' => $profile->email,
            'created_at' => $profile->created_at,
            'bio' => $profile->bio,
            'is_blocked' => $isBlocked,
            'has_blocked_this_user' => $hasBlockedThisUser,
            'user' => [
                'id' => $profile->user->id,
                'name' => $profile->user->name,
                'email' => $profile->user->email,
            ]
        ]);
    }

    public function index()
    {
        $profiles = Profile::with('user:id,name,email')
            ->orderBy('id')
            ->get(['id', 'user_id', 'name', 'email', 'avatar']);

        return response()->json($profiles);
    }

    public function block($userId)
    {
        $currentUser = Auth::user();


        $userToBlock = User::find($userId);
        if (!$userToBlock) {
            return response()->json(['message' => 'Пользователь не найден'], 404);
        }

        if ($currentUser->id == $userId) {
            return response()->json(['message' => 'Нельзя заблокировать себя'], 400);
        }

        // Проверяем, не заблокирован ли уже этот пользователь
        $alreadyBlocked = $currentUser->blocks()
            ->where('blocked_id', $userId)
            ->exists();

        if ($alreadyBlocked) {
            return response()->json(['message' => 'Пользователь уже заблокирован'], 400);
        }

        $currentUser->blocks()->create(['blocked_id' => $userId]);

        return response()->json([
            'success' => true,
            'blocked' => true,
            'message' => 'Пользователь успешно заблокирован'
        ]);
    }

    public function unblock($userId)
    {
        $currentUser = Auth::user();


        $userToUnblock = User::find($userId);
        if (!$userToUnblock) {
            return response()->json(['message' => 'Пользователь не найден'], 404);
        }

        $block = $currentUser->blocks()->where('blocked_id', $userId)->first();

        if (!$block) {
            return response()->json(['message' => 'Пользователь не был заблокирован'], 400);
        }

        $block->delete();

        return response()->json([
            'success' => true,
            'blocked' => false,
            'message' => 'Пользователь успешно разблокирован'
        ]);
    }

    public function update(Request $request, $id)
    {
        $profile = Profile::findOrFail($id);
        $validated = $request->validate(
            [
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|max:255|unique:profiles,email,'.$profile->id,
               'bio' => 'nullable|string|max:255|'
            ],
            [
                'name.required' => 'Поле имени обязательно для заполнения',
                'email.email' => 'Введите корректный email адрес',
                'email.unique' => 'Этот email уже используется'
            ]
        );

        $profile->update($validated);
        $updatedProfile = Profile::with('user')->find($profile->id);

        return response()->json($updatedProfile);
    }

    public function destroy($id)
    {
        $profile = Profile::find($id);
        if (!$profile) {
            return response()->json(['message' => 'Профиль не найден'], 404);
        }
        $profile->delete();
        return response()->json([
            'message' => 'Профиль успешно удален'
        ], 200);
    }

    public function updateAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
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
                Storage::disk('s3')->delete(ltrim($oldPath, '/'));
            }

            $profile->avatar = $avatarUrl;
            $profile->save();

            return response()->json([
                'success' => true,
                'avatar' => $avatarUrl,
                'message' => 'Avatar updated successfully'
            ]);
        }
    }

    public function getBlockedUsers()
    {
        $currentUser = Auth::user();

        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не аутентифицирован'
            ], 401);
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

        return response()->json([
            'success' => true,
            'blocked_users' => $blockedUsers,
            'count' => $blockedUsers->count()
        ]);
    }
}