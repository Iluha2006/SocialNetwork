<?php

namespace App\Http\Controllers\Settings;

use App\Models\PrivacySetting;
use App\Models\User;
use App\Models\Profile;
use App\Models\ImageProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Contracts\Profile\PrivateProfileServiceInterface;
use App\Http\Resources\PrivateProfile\PrivacyFriendsResource;
use App\Http\Resources\PrivateProfile\PrivacyImagesResource;
use App\Http\Resources\PrivateProfile\PrivacySettingsResource;
use App\Http\Resources\PrivateProfile\PrivateProfileResource;

class PrivacySettingsController extends Controller
{
    public function __construct(
        private readonly PrivateProfileServiceInterface $privateProfileService
    ) {}


    public function PrivacyProfile(Request $request, $userId)
    {
        $viewer = Auth::guard('api')->user() ?? Auth::guard('web')->user();
        $owner = User::with('privacySettings')->find($userId); // ✅ Загрузите отношение

        // ✅ Проверка: существует ли пользователь
        if (!$owner) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не найден',
                'can_view_profile' => false,
            ], 404);
        }

        // ✅ Безопасный доступ к настройкам приватности
        $privacySettings = $owner->privacySettings ?? new PrivacySetting([
            'profile_visibility' => 'public',
            'friends_visible' => true,
            'images_visible' => true,
        ]);

        $canView = $this->privateProfileService->canViewProfile($viewer, $owner);

        if (!$canView) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ к профилю ограничен',
                'can_view_profile' => false,
                'profile_visibility' => $privacySettings->profile_visibility ?? 'public'
            ], 403);
        }

        $profile = Profile::with(['contact', 'carer', 'friends.user'])
            ->where('user_id', $userId)
            ->first();

        // ✅ Если профиль не найден
        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Профиль не найден',
            ], 404);
        }

        $filteredData = $this->privateProfileService->filterProfileData(
            $viewer,
            $owner,
            $profile->toArray()
        );

        if (!$filteredData['privacy']['can_view_friends']) {
            $filteredData['friends'] = [];
            $filteredData['friends_count'] = 0;
        }

        return new PrivateProfileResource($filteredData, [
            'profile_visibility' => $privacySettings->profile_visibility ?? 'public',
            'friends_visible' => (bool)($privacySettings->friends_visible ?? true),
            'images_visible' => (bool)($privacySettings->images_visible ?? true)
        ], $filteredData['privacy']);
    }

    public function PrivacyFriends(Request $request, $userId)
    {
        $viewer = Auth::user();
        $owner = User::find($userId);

        if (!$owner) {
            return response()->json(['success' => false, 'message' => 'Пользователь не найден'], 404);
        }

        $canViewFriends = $this->privateProfileService->canViewFriends($viewer, $owner);

        if (!$canViewFriends) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ к списку друзей ограничен',
                'can_view_friends' => false,
                'friends_visible' => $owner->privacySettings->friends_visible ?? true
            ], 403);
        }

        $profile = Profile::with(['friends.user'])->where('user_id', $userId)->first();

        return new PrivacyFriendsResource(
            $profile->friends ?? [],
            [
                'friends_visible' => (bool)($owner->privacySettings->friends_visible ?? true)
            ],
            true
        );
    }


    public function PrivacyImages(Request $request, $userId)
    {
        $viewer = Auth::user();
        $owner = User::find($userId);

        if (!$owner) {
            return response()->json(['success' => false, 'message' => 'Пользователь не найден'], 404);
        }

        $canViewImages = $this->privateProfileService->canViewImages($viewer, $owner);

        if (!$canViewImages) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ к изображениям ограничен',
                'can_view_images' => false,
                'images_visible' => $owner->privacySettings->images_visible ?? true
            ], 403);
        }

        $images = ImageProfile::where('user_id', $userId)->get();

        return new PrivacyImagesResource(
            $images,
            [
                'images_visible' => (bool)($owner->privacySettings->images_visible ?? true)
            ],
            true
        );
    }


    public function getPrivacySettings()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не аутентифицирован'
            ], 401);
        }

        $settings = PrivacySetting::firstOrCreate(
            ['user_id' => $user->id],
            [
                'profile_visibility' => 'public',
                'friends_visible' => true,
                'images_visible' => true,
                'message_from_friends_only' => false,
            ]
        );

        return new PrivacySettingsResource($settings);
    }


    public function updatePrivacySettings(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не аутентифицирован'
            ], 401);
        }

        $validated = $request->validate([
            'profile_visibility' => 'required|in:public,friends,private',
            'friends_visible' => 'boolean',
            'images_visible' => 'boolean',
            'message_from_friends_only' => 'boolean',
        ]);

        $settings = PrivacySetting::updateOrCreate(
            ['user_id' => $user->id],
            [
                'profile_visibility' => $validated['profile_visibility'],
                'friends_visible' => $validated['friends_visible'] ?? false,
                'images_visible' => $validated['images_visible'] ?? false,
                'message_from_friends_only' => $validated['message_from_friends_only'] ?? false,
            ]
        );

        return (new PrivacySettingsResource($settings))
            ->additional(['message' => 'Настройки успешно обновлены']);
    }
}