<?php

use Illuminate\Database\Seeder;
use App\User;

class AdminTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::updateOrCreate([
        	'username' => 'admin',
        	'email' => 'admin@mailinator.com',
        ], [
        	'first_name' => 'John',
        	'last_name' => 'Doe',
        	'email_verified_at' => now(),
        	'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        	'remember_token' => Str::random(10),
        	'role' => 'admin',
        ]);
    }
}
