<?php

namespace App\Http\Controllers\Settings;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Privacy\UpdatePrivacySettingsCommand;
use App\Http\Controllers\Controller;
use App\Queries\Privacy\GetPrivacyFriendsQuery;
use App\Queries\Privacy\GetPrivacyImagesQuery;
use App\Queries\Privacy\GetPrivacyProfileQuery;
use App\Queries\Privacy\GetPrivacySettingsQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrivacySettingsController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function PrivacyProfile(Request $request, $userId)
    {
        $viewer = Auth::guard('api')->user() ?? Auth::guard('web')->user();

        try {
            $data = $this->queryBus->ask(new GetPrivacyProfileQuery((int) $userId, $viewer));

            return response()->json([
                'success' => true,
                'profile' => $data->profile,
                'privacy' => $data->privacy,
                'privacy_settings' => $data->privacy_settings,
            ]);
        } catch (\RuntimeException $e) {
            $status = in_array($e->getCode(), [403, 404], true) ? $e->getCode() : 403;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'can_view_profile' => false,
            ], $status);
        }
    }

    public function PrivacyFriends(Request $request, $userId)
    {
        try {
            $data = $this->queryBus->ask(new GetPrivacyFriendsQuery((int) $userId));

            return response()->json([
                'success' => true,
                'friends' => $data->friends,
                'friends_count' => $data->friends_count,
                'can_view_friends' => $data->can_view_friends,
                'privacy_settings' => $data->privacy_settings,
            ]);
        } catch (\RuntimeException $e) {
            $status = in_array($e->getCode(), [403, 404], true) ? $e->getCode() : 403;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'can_view_friends' => false,
            ], $status);
        }
    }

    public function PrivacyImages(Request $request, $userId)
    {
        try {
            $data = $this->queryBus->ask(new GetPrivacyImagesQuery((int) $userId));

            return response()->json([
                'success' => true,
                'images' => $data->images,
                'can_view_images' => $data->can_view_images,
                'privacy_settings' => $data->privacy_settings,
            ]);
        } catch (\RuntimeException $e) {
            $status = in_array($e->getCode(), [403, 404], true) ? $e->getCode() : 403;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'can_view_images' => false,
            ], $status);
        }
    }

    public function getPrivacySettings()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Пользователь не аутентифицирован'], 401);
        }

        $data = $this->queryBus->ask(new GetPrivacySettingsQuery($user->id));

        return response()->json(['success' => true, 'settings' => $data]);
    }

    public function updatePrivacySettings(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Пользователь не аутентифицирован'], 401);
        }

        $validated = $request->validate([
            'profile_visibility' => 'required|in:public,friends,private',
            'friends_visible' => 'boolean',
            'images_visible' => 'boolean',
            'message_from_friends_only' => 'boolean',
        ]);

        $data = $this->commandBus->dispatch(
            new UpdatePrivacySettingsCommand($user->id, $validated)
        );

        return response()->json([
            'success' => true,
            'settings' => $data,
            'message' => 'Настройки успешно обновлены',
        ]);
    }
}
