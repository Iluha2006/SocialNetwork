<?php

namespace App\Jobs\Media;

use App\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessAvatarUploadJob implements ShouldQueue
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
        $path = "avatars/{$this->fileName}";
        $contents = Storage::disk('local')->get($this->tempPath);

        Storage::disk('s3')->put($path, $contents, 'public');
        Storage::disk('s3')->delete($this->tempPath);

        $avatarUrl = Storage::disk('s3')->url($path);

        $profile = Profile::where('user_id', $this->userId)->first();
        if ($profile) {
            if ($profile->avatar) {
                $oldPath = parse_url($profile->avatar, PHP_URL_PATH);
                if ($oldPath) {
                    $oldKey = ltrim($oldPath, '/');
                    $bucketPrefix = env('AWS_BUCKET') . '/';
                    if (str_starts_with($oldKey, $bucketPrefix)) {
                        $oldKey = substr($oldKey, strlen($bucketPrefix));
                    }
                    Storage::disk('s3')->delete($oldKey);
                }
            }
            $profile->avatar = $avatarUrl;
            $profile->save();
        }
    }
}
