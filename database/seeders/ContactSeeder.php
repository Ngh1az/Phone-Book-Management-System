<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create test user
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create groups for the user
        $groups = [
            ['name' => 'Family', 'color' => '#10B981', 'description' => 'Family members'],
            ['name' => 'Friends', 'color' => '#3B82F6', 'description' => 'Close friends'],
            ['name' => 'Work', 'color' => '#F59E0B', 'description' => 'Work colleagues'],
            ['name' => 'Business', 'color' => '#8B5CF6', 'description' => 'Business contacts'],
            ['name' => 'VIP', 'color' => '#EF4444', 'description' => 'Very important contacts'],
        ];

        $groupModels = [];
        foreach ($groups as $group) {
            $groupModels[] = \App\Models\Group::firstOrCreate(
                ['user_id' => $user->id, 'name' => $group['name']],
                ['color' => $group['color'], 'description' => $group['description']]
            );
        }

        // Create tags for the user
        $tags = [
            ['name' => 'Important', 'color' => '#EF4444'],
            ['name' => 'Follow-up', 'color' => '#F59E0B'],
            ['name' => 'Client', 'color' => '#10B981'],
            ['name' => 'Partner', 'color' => '#3B82F6'],
            ['name' => 'Lead', 'color' => '#8B5CF6'],
        ];

        $tagModels = [];
        foreach ($tags as $tag) {
            $tagModels[] = \App\Models\Tag::firstOrCreate(
                ['user_id' => $user->id, 'name' => $tag['name']],
                ['color' => $tag['color']]
            );
        }

        // Create sample contacts
        $contacts = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'phone_number' => '+1 234 567 8900',
                'email' => 'john.doe@example.com',
                'company' => 'Acme Corp',
                'job_title' => 'CEO',
                'is_favorite' => true,
                'group' => 'Business',
                'tags' => ['Important', 'Client'],
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'phone_number' => '+1 234 567 8901',
                'email' => 'jane.smith@example.com',
                'company' => 'Tech Solutions',
                'job_title' => 'CTO',
                'is_favorite' => true,
                'group' => 'Business',
                'tags' => ['Important', 'Partner'],
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Johnson',
                'phone_number' => '+1 234 567 8902',
                'email' => 'michael.j@example.com',
                'company' => null,
                'job_title' => null,
                'is_favorite' => false,
                'group' => 'Friends',
                'tags' => ['Follow-up'],
            ],
            [
                'first_name' => 'Emily',
                'last_name' => 'Williams',
                'phone_number' => '+1 234 567 8903',
                'email' => 'emily.w@example.com',
                'company' => 'Design Studio',
                'job_title' => 'Creative Director',
                'is_favorite' => false,
                'group' => 'Work',
                'tags' => ['Client'],
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Brown',
                'phone_number' => '+1 234 567 8904',
                'email' => 'david.b@example.com',
                'company' => null,
                'job_title' => null,
                'is_favorite' => true,
                'group' => 'Family',
                'tags' => ['Important'],
            ],
        ];

        foreach ($contacts as $contactData) {
            $groupName = $contactData['group'];
            $tagNames = $contactData['tags'];
            unset($contactData['group'], $contactData['tags']);

            // Find the group
            $group = collect($groupModels)->firstWhere('name', $groupName);

            // Create or update contact
            $contact = \App\Models\Contact::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'phone_number' => $contactData['phone_number'],
                ],
                [
                    ...$contactData,
                    'group_id' => $group?->id,
                    'address' => fake()->address(),
                    'birthday' => fake()->date('Y-m-d', '-25 years'),
                    'notes' => fake()->paragraph(),
                ]
            );

            // Attach tags
            $tagIds = collect($tagModels)
                ->whereIn('name', $tagNames)
                ->pluck('id')
                ->toArray();

            $contact->tags()->sync($tagIds);
        }

        $this->command->info('Created test user, groups, tags, and contacts successfully!');
    }
}
