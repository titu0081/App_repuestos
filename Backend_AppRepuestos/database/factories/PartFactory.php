<?php

namespace Database\Factories;

use App\Models\Part;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Part>
 */
class PartFactory extends Factory
{
    protected $model = Part::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $techParts = [
            'Pantalla OLED iPhone 12',
            'Batería Samsung S21',
            'Teclado mecánico laptop',
            'Disco SSD NVMe 1TB',
            'Memoria RAM DDR4 16GB',
            'Ventilador CPU 120mm',
            'Flex de carga USB-C',
            'Cámara trasera Xiaomi',
            'Módulo WiFi/Bluetooth',
            'Fuente poder 65W USB-C',
            'Altavoz interno laptop',
            'Touchpad portátil',
            'Conector HDMI motherboard',
            'Pasta térmica premium',
            'Micrófono interno smartphone',
        ];

        return [
            'sku' => fake()->unique()->bothify('TEC-#####'),
            'name' => fake()->randomElement($techParts),
            'description' => fake()->optional()->sentence(10),
        ];
    }
}
