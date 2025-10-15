<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed test data with Vietnamese contacts
        $this->call([
            VietnameseContactSeeder::class,
        ]);

        // Optionally create additional random users with contacts
        // Uncomment below to generate more test data
        /*
        User::factory(5)
            ->has(
                \App\Models\Group::factory(3)
                    ->has(\App\Models\Contact::factory(5))
            )
            ->has(\App\Models\Tag::factory(4))
            ->create();
        */
    }
}
