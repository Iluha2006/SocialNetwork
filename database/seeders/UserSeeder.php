<?php

namespace Database\Seeders;

use App\Models\Friendship;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('blocks')->delete();
        DB::table('roles')->delete();
        DB::table('comment_posts')->delete();
        DB::table('oauth_access_tokens')->delete();
        DB::table('oauth_auth_codes')->delete();
        DB::table('oauth_device_codes')->delete();

        User::query()->delete();

        $usersData = [
            [
                'name' => 'Иван Иванов',
                'email' => 'ivan.ivanov@example.com',
                'bio' => 'Разработчик и любитель путешествий',
            ],
            [
                'name' => 'Мария Смирнова',
                'email' => 'maria.smirnova@example.com',
                'bio' => 'Дизайнер, рисую в свободное время',
            ],
            [
                'name' => 'Алексей Кузнецов',
                'email' => 'alexey.kuznetsov@example.com',
                'bio' => 'Фотограф, снимаю природу',
            ],
            [
                'name' => 'Екатерина Попова',
                'email' => 'ekaterina.popova@example.com',
                'bio' => 'Преподаватель английского языка',
            ],
            [
                'name' => 'Дмитрий Соколов',
                'email' => 'dmitry.sokolov@example.com',
                'bio' => 'Люблю спорт и активный отдых',
            ],
        ];

        $users = collect();

        foreach ($usersData as $index => $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'online_status' => 'online',
            ]);

            $profile = Profile::create([
                'user_id' => $user->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'bio' => $data['bio'],
                'avatar' => "https://picsum.photos/seed/avatar{$index}/300/300",
            ]);

            $users->push($user);
        }

        $profiles = $users->map(fn($user) => $user->profile);

        foreach ($profiles as $profile) {
            foreach ($profiles as $friend) {
                if ($friend->id === $profile->id) {
                    continue;
                }
                Friendship::firstOrCreate([
                    'user_id' => $profile->id,
                    'friend_id' => $friend->id,
                ]);
            }
        }

        $friendCount = $profiles->count() - 1;
        $this->command->info("Создано {$users->count()} пользователей, у каждого по {$friendCount} друга");
    }
}
