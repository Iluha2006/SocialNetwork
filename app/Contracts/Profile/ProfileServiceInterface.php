<?php

namespace App\Contracts\Profile;

use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Models\Profile;
use Illuminate\Http\Request;

interface ProfileServiceInterface
{
    public function show(int $id): array;

    public function index(): iterable;

    public function block(int $userId): array;

    public function unblock(int $userId): array;

    public function update(array $data, int $id) :Profile;

    public function destroy(int $id): void;

    public function updateAvatar(Request $request): array;

    public function getBlockedUsers(): array;

    public function getFriends(int $profileId): iterable;

    public function getImages(int $userId): iterable;
}
