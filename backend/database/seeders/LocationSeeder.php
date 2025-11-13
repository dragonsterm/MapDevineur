<?php

namespace Database\Seeders;

use App\Models\Location;

use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'name' => 'Sydney Opera House',
                'latitude' => -33.856784,
                'longitude' => 151.215297,
                'country' => 'Australia',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Taj Mahal',
                'latitude' => 27.175015,
                'longitude' => 78.042155,
                'country' => 'India',
                'difficulty' => 'medium',
            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
