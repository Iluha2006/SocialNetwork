<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\Auth\CustomVerifyEmail;
use Illuminate\Console\Command;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class TestVerificationEmail extends Command
{
    protected $signature = 'mail:test-verification {email}';
    protected $description = 'Отправить тестовое письмо верификации';

    public function handle(): int
    {
        $email = $this->argument('email');

        try {
            $user = User::firstOrCreate(
                ['email' => $email],
                ['name' => 'Test User', 'password' => bcrypt('password')]
            );

            $this->info("👤 Пользователь: {$user->name} ({$user->email})");
            $this->info("🔐 Email verified at: " . ($user->email_verified_at ?? 'NULL'));

            // Проверка MustVerifyEmail
            if (!$user instanceof MustVerifyEmail) {
                $this->error('❌ Пользователь не реализует MustVerifyEmail');
                return Command::FAILURE;
            }

            // Сброс верификации для теста
            if ($user->wasRecentlyCreated === false && $user->email_verified_at !== null) {
                $this->warn('🔄 Сбрасываем верификацию для теста...');
                $user->update(['email_verified_at' => null]);
            }

            $this->info('📧 Отправка уведомления...');
            $user->notify(new CustomVerifyEmail());

            $this->info("✅ Письмо отправлено на {$email}");
            $this->info('🔍 Проверьте папку "Спам" и "Промоакции" в Gmail');
            $this->info('📄 Или посмотрите лог: storage/logs/laravel.log');

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("❌ Ошибка: " . $e->getMessage());
            $this->error("📍 " . $e->getFile() . ":" . $e->getLine());

            \Log::error('TestVerificationEmail failed: ' . $e->getMessage(), [
                'email' => $email,
                'trace' => $e->getTraceAsString(),
            ]);

            return Command::FAILURE;
        }
    }
}