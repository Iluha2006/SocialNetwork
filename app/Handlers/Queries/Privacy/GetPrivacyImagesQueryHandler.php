<?php

namespace App\Handlers\Queries\Privacy;

use App\Data\PrivacyImagesData;
use App\Data\PrivacySettingsData;
use App\Models\ImageProfile;
use App\Models\User;
use App\Queries\Privacy\GetPrivacyImagesQuery;
use App\Contracts\Profile\PrivateProfileServiceInterface;
use Illuminate\Support\Facades\Auth;

class GetPrivacyImagesQueryHandler
{
    public function __construct(
        private readonly PrivateProfileServiceInterface $privateProfileService,
    ) {}

    public function handle(GetPrivacyImagesQuery $query): PrivacyImagesData
    {
        $viewer = Auth::user();
        $owner = User::select(['id'])->find($query->userId);

        if (!$owner) {
            throw new \RuntimeException('Пользователь не найден', 404);
        }

        $canViewImages = $this->privateProfileService->canViewImages($viewer, $owner);

        if (!$canViewImages) {
            throw new \RuntimeException('Доступ к изображениям ограничен', 403);
        }

        $images = ImageProfile::select(['id', 'user_id', 'path_image', 'created_at'])
            ->where('user_id', $query->userId)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return new PrivacyImagesData(
            images: $images->toArray(),
            can_view_images: true,
            privacy_settings: new PrivacySettingsData(
                images_visible: (bool)($owner->privacySettings->images_visible ?? true),
            ),
        );
    }
}
