<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class TestS3Upload extends Command
{
    protected $signature = 'test:s3';
    protected $description = 'тест загрузки в S3';

    public function handle()
    {
        
        $image = Http::get('https://cf2.ppt-online.org/files2/slide/i/iunkGS2gLCYZdPUBh1vwMQ8Vf9bWlIeTFDJH6crO4p/slide-22.jpg')->body();
        
 
        $user = User::first();
        $path = "user_media/{$user->id}/images/test_" . time() . ".jpg";
        
       
        Storage::disk('s3')->put($path, $image, 'public');
        
       
        $url = config('filesystems.disks.s3.url') . '/' . env('AWS_BUCKET') . '/' . $path;
        
        Post::create([
            'title' => 'Тест',
            'content' => 'test',
            'user_id' => $user->id,
            'images' => $url,
            'videos' => null,
        ]);

       
    }
}