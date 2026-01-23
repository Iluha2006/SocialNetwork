<?php
namespace App\Http\Controllers;

use App\Models\PrivacySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Profile;
use App\Models\ImageProfile;
use App\Services\PrivateProfileService;

class PrivacySettingsController extends Controller
{
    private PrivateProfileService $privateProfileService;

    public function __construct(PrivateProfileService $privateProfileService) {
        $this->privateProfileService = $privateProfileService;
    }
    public function PrivacyProfile(Request $request, $userId)
    {
        $viewer = Auth::user();
        $owner = User::findOrFail($userId);

  
        $canView = $this->privateProfileService->canViewProfile($viewer, $owner);

        if (!$canView) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ к профилю ограничен',
                'can_view_profile' => false,
                'profile_visibility' => $owner->privacySettings->profile_visibility ?? 'public'
            ], 403);
        }

      
        $profile = Profile::with(['contact', 'carer', 'friends.user'])
            ->where('user_id', $userId)
            ->firstOrFail();

 
        $privacySettings = $owner->privacySettings;

        $filteredData = $this->privateProfileService->filterProfileData(
            $viewer,
            $owner,
            $profile->toArray()
        );

       
        if (!$filteredData['privacy']['can_view_friends']) {
            $filteredData['friends'] = [];
            $filteredData['friends_count'] = 0;
        }

        return response()->json([
            'success' => true,
            'profile' => $filteredData,
            'privacy' => $filteredData['privacy'],
            'privacy_settings' => [
                'profile_visibility' => $privacySettings->profile_visibility ?? 'public',
                'friends_visible' => (bool)($privacySettings->friends_visible ?? true),
                'images_visible' => (bool)($privacySettings->images_visible ?? true)
            ]
        ]);
    }

    public function PrivacyFriends(Request $request, $userId)
    {
        $viewer = Auth::user();
        $owner = User::findOrFail($userId);

 
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

        return response()->json([
            'success' => true,
            'friends' => $profile->friends ?? [],
            'friends_count' => $profile->friends->count() ?? 0,
            'can_view_friends' => true,
            'privacy_settings' => [
                'friends_visible' => (bool)($owner->privacySettings->friends_visible ?? true)
            ]
        ]);
    }

    public function PrivacyImages(Request $request, $userId)
    {
        $viewer = Auth::user();
        $owner = User::findOrFail($userId);

       
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

        return response()->json([
            'success' => true,
            'images' => $images,
            'can_view_images' => true,
            'privacy_settings' => [
                'images_visible' => (bool)($owner->privacySettings->images_visible ?? true)
            ]
        ]);
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

        return response()->json([
            'success' => true,
            'settings' => [
                'profile_visibility' => $settings->profile_visibility,
                'friends_visible' => (bool)$settings->friends_visible,
                'images_visible' => (bool)$settings->images_visible,
                'message_from_friends_only' => (bool)$settings->message_from_friends_only,
            ]
        ]);
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

        return response()->json([
            'success' => true,
            'message' => 'Настройки успешно обновлены',
            'settings' => [
                'profile_visibility' => $settings->profile_visibility,
                'friends_visible' => (bool)$settings->friends_visible,
                'images_visible' => (bool)$settings->images_visible,
                'message_from_friends_only' => (bool)$settings->message_from_friends_only,
            ]
        ]);
    }
}