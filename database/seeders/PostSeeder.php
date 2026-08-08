<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::query()->inRandomOrder()->limit(3)->get();

        if ($users->isEmpty()) {
            $this->command->warn('⚠️ Нет пользователей для создания постов. Сначала запустите UserSeeder.');
            return;
        }

        $posts = collect([
            [
                'title' => 'Прогулка по горам',
                'content' => 'Сегодня выбрались в горы на рассвете. Виды просто невероятные, советую всем хотя бы раз увидеть это своими глазами!',
                'images' => 'https://i.pinimg.com/736x/61/2f/e0/612fe0f03a8125179a5e89233f69373e.jpg',
            ],
            [
                'title' => 'Мой новый проект',
                'content' => 'Наконец-то закончил работу над своим проектом. Потребовалось несколько месяцев, но результат того стоил. Делюсь с вами фото!',
                'images' => 'https://picsum.photos/seed/post2/1200/800',
            ],
            [
                'title' => 'Выходные на море',
                'content' => 'Провёл выходные на море с друзьями. Погода была отличная, а вода тёплая. Самые яркие моменты в кадре.',
                'images' => 'https://picsum.photos/seed/post3/1200/800',
            ],
        ]);

        foreach ($posts as $index => $post) {
            Post::create([
                'title' => $post['title'],
                'content' => $post['content'],
                'images' => $post['images'],
                'user_id' => $users[$index % $users->count()]->id,
                'likes_count' => 0,
            ]);
        }

        $cache = app(\App\Contracts\Cache\CacheServiceInterface::class);
        $cache->forget('posts:all');

        $this->command->info("✅ Создано {$posts->count()} постов");
    }
}
