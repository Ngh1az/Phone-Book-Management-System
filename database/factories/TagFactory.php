<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

        // Generate unique tag names by combining adjectives and nouns
        $adjectives = ['Important', 'Urgent', 'Critical', 'High-Priority', 'Low-Priority', 'Active', 'Pending', 'Archived'];
        $nouns = ['Client', 'Partner', 'Lead', 'Project', 'Task', 'Contact', 'Deal', 'Follow-up'];

        return [
            'user_id' => \App\Models\User::factory(),
            'name' => fake()->unique()->randomElement($adjectives) . ' ' . fake()->randomElement($nouns),
            'color' => fake()->randomElement($colors),
        ];
    }

    /**
     * Indicate that the tag has a specific color.
     */
    public function withColor(string $color): static
    {
        return $this->state(fn (array $attributes) => [
            'color' => $color,
        ]);
    }
}
