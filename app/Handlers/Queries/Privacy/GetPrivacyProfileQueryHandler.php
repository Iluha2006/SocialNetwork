<?php

namespace App\Handlers\Queries\Privacy;

use App\Data\PrivateProfileData;
use App\Data\PrivacySettingsData;
use App\Models\PrivacySetting;
use App\Models\Profile;
use App\Models\User;
use App\Queries\Privacy\GetPrivacyProfileQuery;
use App\Contracts\Profile\PrivateProfileServiceInterface;

class GetPrivacyProfileQueryHandler
{
    public function __construct(
        private readonly PrivateProfileServiceInterface $privateProfileService,
    ) {}

    public function handle(GetPrivacyProfileQuery $query): PrivateProfileData
    {
        $owner = User::select(['id'])->with('privacySettings')->find($query->userId);

        if (!$owner) {
            throw new \RuntimeException('Пользователь не найден', 404);
        }

        $privacySettings = $owner->privacySettings ?? new PrivacySetting([
            'profile_visibility' => 'public',
            'friends_visible' => true,
            'images_visible' => true,
        ]);

        $canView = $this->privateProfileService->canViewProfile($query->viewer, $owner);

        if (!$canView) {
            throw new \RuntimeException('Доступ к профилю ограничен', 403);
        }

        $profile = Profile::with([
            'contact:user_id,phone,city,profile_id',
            'carer:user_id,city,place_work,work_experience,skills_work,position',
            'friends:id,user_id,name,avatar',
            'friends.user:id,name,email',
        ])
            ->select(['id', 'user_id', 'name', 'bio', 'avatar', 'email'])
            ->where('user_id', $query->userId)
            ->first();

        if (!$profile) {
            throw new \RuntimeException('Профиль не найден', 404);
        }

        $filteredData = $this->privateProfileService->filterProfileData(
            $query->viewer,
            $owner,
            $profile->toArray()
        );

        if (!$filteredData['privacy']['can_view_friends']) {
            $filteredData['friends'] = [];
            $filteredData['friends_count'] = 0;
        }

        return new PrivateProfileData(
            profile: $filteredData,
            privacy: $filteredData['privacy'],
            privacy_settings: new PrivacySettingsData(
                profile_visibility: $privacySettings->profile_visibility ?? 'public',
                friends_visible: (bool)($privacySettings->friends_visible ?? true),
                images_visible: (bool)($privacySettings->images_visible ?? true),
            ),
        );
    }
}
