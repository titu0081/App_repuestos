<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Client;
use App\Models\Part;
use App\Models\InventoryMovement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

      User::firstOrCreate(
    ['email' => 'test@example.com'],
    [
        'name' => 'Test User',
                'password' => Hash::make('password'),
    ]);
        User::firstOrCreate(
            ['email' => 'ismad@hotmail.com'],
            [
                'name' => 'Ismael Davila',
                'password' => Hash::make('admin123'),
            ]
        );
        Client::factory(10)->create();
        Part::factory(15)->create();
        InventoryMovement::factory(40)->create();

    }
}
