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

        

            if (!$user instanceof MustVerifyEmail) {
                
                return Command::FAILURE;
            }

         
            if ($user->wasRecentlyCreated === false && $user->email_verified_at !== null) {
              
                $user->update(['email_verified_at' => null]);
            }


            return Command::SUCCESS;

        } catch (\Exception $e) {
            

            return Command::FAILURE;
        }
    }
}