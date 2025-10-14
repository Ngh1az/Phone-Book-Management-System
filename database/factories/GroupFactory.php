<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Group>
 */
class GroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

        return [
            'user_id' => \App\Models\User::factory(),
            'name' => fake()->randomElement(['Family', 'Friends', 'Work', 'Business', 'Personal', 'VIP', 'Clients', 'Team']),
            'description' => fake()->boolean(70) ? fake()->sentence() : null,
            'color' => fake()->randomElement($colors),
        ];
    }

    /**
     * Indicate that the group has a specific color.
     */
    public function withColor(string $color): static
    {
        return $this->state(fn (array $attributes) => [
            'color' => $color,
        ]);
    }
}
