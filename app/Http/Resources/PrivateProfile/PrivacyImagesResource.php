<?php

namespace App\Http\Resources\PrivateProfile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrivacyImagesResource extends JsonResource
{
    protected $privacySettings;
    protected $canViewImages;

    public function __construct($resource, $privacySettings = null, $canViewImages = true)
    {
        parent::__construct($resource);
        $this->privacySettings = $privacySettings;
        $this->canViewImages = $canViewImages;
    }

    public function toArray(Request $request): array
    {
        $images = $this->resource ?? [];

        return [
            'success' => true,
            'images' => $images,
            'can_view_images' => $this->canViewImages,
            'privacy_settings' => [
                'images_visible' => $this->privacySettings['images_visible'] ?? true,
            ],
        ];
    }
}