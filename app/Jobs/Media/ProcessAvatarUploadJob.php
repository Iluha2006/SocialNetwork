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
        Storage::disk('local')->delete($this->tempPath);

        $avatarUrl = config('filesystems.disks.s3.url') . '/' . $path
            ?: (env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $path);

        $profile = Profile::where('user_id', $this->userId)->first();
        if ($profile) {
            if ($profile->avatar) {
                $oldPath = parse_url($profile->avatar, PHP_URL_PATH);
                if ($oldPath) {
                    Storage::disk('s3')->delete(ltrim($oldPath, '/'));
                }
            }
            $profile->avatar = $avatarUrl;
            $profile->save();
        }
    }
}
