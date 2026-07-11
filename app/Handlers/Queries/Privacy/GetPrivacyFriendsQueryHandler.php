<?php

namespace App\Handlers\Queries\Privacy;

use App\Data\PrivacyFriendsData;
use App\Data\PrivacySettingsData;
use App\Models\Profile;
use App\Models\User;
use App\Queries\Privacy\GetPrivacyFriendsQuery;
use App\Contracts\Profile\PrivateProfileServiceInterface;
use Illuminate\Support\Facades\Auth;

class GetPrivacyFriendsQueryHandler
{
    public function __construct(
        private readonly PrivateProfileServiceInterface $privateProfileService,
    ) {}

    public function handle(GetPrivacyFriendsQuery $query): PrivacyFriendsData
    {
        $viewer = Auth::user();
        $owner = User::find($query->userId);

        if (!$owner) {
            throw new \RuntimeException('Пользователь не найден', 404);
        }

        $canViewFriends = $this->privateProfileService->canViewFriends($viewer, $owner);

        if (!$canViewFriends) {
            throw new \RuntimeException('Доступ к списку друзей ограничен', 403);
        }

        $profile = Profile::with(['friends.user'])->where('user_id', $query->userId)->first();

        return new PrivacyFriendsData(
            friends: $profile->friends->toArray() ?? [],
            friends_count: $profile->friends->count() ?? 0,
            can_view_friends: true,
            privacy_settings: new PrivacySettingsData(
                friends_visible: (bool)($owner->privacySettings->friends_visible ?? true),
            ),
        );
    }
}
