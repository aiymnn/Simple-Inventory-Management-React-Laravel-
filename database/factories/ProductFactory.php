<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'name' => fake()->words(3, true),
            'category_id' => Category::pluck('id')->random(),
            'supplier_id' => Supplier::pluck('id')->random(),
            'image_path' => null,
            'price' => fake()->randomFloat(2, 10, 500),
            'quantity' => fake()->numberBetween(10, 100),
            'description' => fake()->sentence(),
            'sku' => 'PROD-' . strtoupper(Str::random(8)),
        ];
    }
}
