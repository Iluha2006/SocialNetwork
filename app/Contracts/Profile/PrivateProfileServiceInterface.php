<?php

namespace App\Contracts\Profile;

use App\Models\User;

interface PrivateProfileServiceInterface
{
    public function canViewProfile(?User $viewer, User $owner): bool;
    public function canViewFriends(?User $viewer, User $owner): bool;
    public function canViewImages(?User $viewer, User $owner): bool;
    public function filterProfileData(?User $viewer, User $owner, array $profileData): array;
}
