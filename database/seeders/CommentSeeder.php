<?php

namespace Database\Seeders;

use App\Models\CommentPost;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $posts = Post::query()->orderBy('id')->get();
        $users = User::query()->orderBy('id')->get();

        if ($posts->isEmpty() || $users->isEmpty()) {
            $this->command->warn('Нет постов или пользователей для создания комментариев.');
            return;
        }

        $commentsPool = [
            'Класс! Отличные фотографии!',
            'Согласен, выглядит просто потрясающе!',
            'Куда собираетесь в следующий раз?',
            'Было бы здорово присоединиться к вам',
            'Круто, завидую белой завистью',
            'Поздравляю, это большой шаг!',
            'Какая красота, спасибо что делитесь!',
            'А где это место находится?',
            'Мне очень нравится этот пост',
            'Топ! Так держать!',
        ];

        $created = 0;

        foreach ($posts as $post) {
            $commentCount = rand(2, 5);

            $authors = $users->where('id', '!=', $post->user_id)
                ->shuffle()
                ->take($commentCount);

            foreach ($authors as $index => $author) {
                CommentPost::create([
                    'comment' => $commentsPool[array_rand($commentsPool)],
                    'user_id' => $author->id,
                    'post_id' => $post->id,
                    'created_at' => now()->subHours(rand(1, 24) + $index),
                    'updated_at' => now(),
                ]);

                $created++;
            }
        }

        $cache = app(\App\Contracts\Cache\CacheServiceInterface::class);
        $cache->forget('posts:all');

        $this->command->info("Создано {$created} комментариев от разных пользователей");
    }
}
