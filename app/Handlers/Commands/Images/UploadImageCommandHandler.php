<?php

namespace App\Handlers\Commands\Images;

use App\Commands\Images\UploadImageCommand;
use App\Data\ImageData;
use App\Models\ImageProfile;
use Illuminate\Support\Facades\Storage;

class UploadImageCommandHandler
{
    public function handle(UploadImageCommand $command): ImageData
    {
        $user = $command->request->user();
        $imageUrl = null;

        if ($command->request->hasFile('profile_images')) {
            $image = $command->request->file('profile_images');
            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $directory = "profile/{$user->id}/photo";
            $fullPath = "{$directory}/{$filename}";

            Storage::disk('s3')->put($fullPath, file_get_contents($image), 'public');
            $imageUrl = config('filesystems.disks.s3.url') . '/' . env('AWS_BUCKET') . '/' . $fullPath;
        }

        $image = ImageProfile::create([
            'user_id' => $user->id,
            'path_image' => $imageUrl,
        ]);

        return ImageData::from($image);
    }
}
