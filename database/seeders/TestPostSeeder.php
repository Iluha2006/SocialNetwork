<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestPostSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create();

        $posts = collect(range(1, 5))->map(fn($i) => [
            'title' => "Тестовый пост #{$i}",
            'content' => "Это автоматический пост #{$i} для проверки кеша. Создан: " . now(),
            'user_id' => $user->id,
            'images' => 'https://cf2.ppt-online.org/files2/slide/i/iunkGS2gLCYZdPUBh1vwMQ8Vf9bWlIeTFDJH6crO4p/slide-22.jpg'.$i,
            'videos' => null,
            'created_at' => now()->subHours(rand(0, 48)),
            'updated_at' => now(),
        ]);

        Post::insertOrIgnore($posts->toArray());

        // 🔥 Инвалидация кеша после создания постов
        $cache = app(\App\Contracts\Cache\CacheServiceInterface::class);
        $cache->forget('posts:all');
        
        $this->command->info("✅ Создано {$posts->count()} тестовых постов для пользователя #{$user->id}");
    }
}