<?php

namespace App\Jobs\Media;

use App\Models\ImageProfile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessProfileImageUploadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 120;

    public function __construct(
        public int $userId,
        public string $tempPath,
        public string $fileName
    ) {}

    public function handle(): void
    {
        $directory = "profile/{$this->userId}/photo";
        $fullPath = "{$directory}/{$this->fileName}";

        $contents = Storage::disk('local')->get($this->tempPath);
        Storage::disk('s3')->put($fullPath, $contents, 'public');
        Storage::disk('local')->delete($this->tempPath);

        $imageUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $fullPath;

        ImageProfile::create([
            'user_id' => $this->userId,
            'path_image' => $imageUrl,
        ]);
    }
}
