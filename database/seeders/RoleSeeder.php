<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('securepassword'),
            ]
        );


        $adminRole = Role::firstOrCreate(
            ['name' => 'ADMIN'],
            ['user_id' => $admin->id]
        );


        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

    }
}