<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'group_id' => fake()->boolean(70) ? \App\Models\Group::factory() : null,
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'phone_number' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'company' => fake()->company(),
            'job_title' => fake()->jobTitle(),
            'birthday' => fake()->date(),
            'notes' => fake()->boolean(30) ? fake()->paragraph() : null,
            'is_favorite' => fake()->boolean(20),
            'avatar' => null,
        ];
    }

    /**
     * Indicate that the contact is a favorite.
     */
    public function favorite(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_favorite' => true,
        ]);
    }

    /**
     * Indicate that the contact has no group.
     */
    public function withoutGroup(): static
    {
        return $this->state(fn (array $attributes) => [
            'group_id' => null,
        ]);
    }
}
