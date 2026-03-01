<?php

namespace Database\Factories;

use App\Models\InventoryMovement;
use App\Models\Part;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryMovement>
 */
class InventoryMovementFactory extends Factory
{
    protected $model = InventoryMovement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'part_id' => Part::query()->inRandomOrder()->value('id') ?? Part::factory()->create()->id,
            'type' => fake()->randomElement(['in', 'out', 'adjustment']),
            'quantity' => fake()->numberBetween(1, 30),
            'performed_by_user_id' => User::query()->inRandomOrder()->value('id') ?? User::factory()->create()->id,
            'performed_at' => fake()->dateTimeBetween('-3 months', 'now'),
            'notes' => fake()->optional()->sentence(8),
        ];
    }
}
