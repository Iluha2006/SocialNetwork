<?php

namespace App\Handlers\Commands\Images;

use App\Commands\Images\DeleteImageCommand;
use App\Models\ImageProfile;
use Illuminate\Support\Facades\Storage;

class DeleteImageCommandHandler
{
    public function handle(DeleteImageCommand $command): void
    {
        $image = ImageProfile::findOrFail($command->imageId);
        Storage::disk('s3')->delete($image->path_image);
        $image->delete();
    }
}
