<?php

namespace App\Jobs\Media;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessPostMediaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 300;

    public function __construct(
        public int $postId,
        public ?string $imageTempPath,
        public ?string $videoTempPath,
        public ?string $imageFileName,
        public ?string $videoFileName
    ) {}

    public function handle(): void
    {
        $post = Post::find($this->postId);
        if (!$post) {
            return;
        }

        $imageUrl = null;
        $videoUrl = null;

        if ($this->imageTempPath && $this->imageFileName) {
            $path = "user_media/{$post->user_id}/images/{$this->imageFileName}";
            $contents = Storage::disk('local')->get($this->imageTempPath);
            Storage::disk('s3')->put($path, $contents, 'public');
            Storage::disk('local')->delete($this->imageTempPath);
            $imageUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $path;
        }

        if ($this->videoTempPath && $this->videoFileName) {
            $path = "user_media/{$post->user_id}/videos/{$this->videoFileName}";
            $contents = Storage::disk('local')->get($this->videoTempPath);
            Storage::disk('s3')->put($path, $contents, 'public');
            Storage::disk('local')->delete($this->videoTempPath);
            $videoUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $path;
        }

        $post->update(array_filter([
            'images' => $imageUrl,
            'videos' => $videoUrl,
        ]));
    }
}
