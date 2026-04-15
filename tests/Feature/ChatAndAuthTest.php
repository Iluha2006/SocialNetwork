<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
class ChatAndAuthTest extends TestCase
{
    public function test_get_chats_returns_json_response(): void
    {
        // Создаем пользователя
        $user = User::factory()->create([
            'email_verified_at' => now()
        ]);


        $this->actingAs($user);

        // Делаем запрос
        $response = $this->getJson('/messages/chats');



        // Проверяем статус
        $response->assertStatus(200);

        // Проверяем, что вернулся JSON
        $response->assertHeader('Content-Type', 'application/json');

        // Проверяем структуру JSON (если есть данные)
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name'
            ]
        ]);
    }

    public function test_guests_cant_view_dashboard()
{
    $user = User::factory()->guest()->create();
    $response = $this->actingAs($user)->get('/messages/chats');
    $response->assertStatus(401);
}
}