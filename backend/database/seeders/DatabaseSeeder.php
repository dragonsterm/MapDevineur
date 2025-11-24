<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
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
            [
                'name' => 'Kuala Lumpur',
                'latitude' => 3.146781,
                'longitude' => 101.711264,
                'country' => 'Malaysia',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Yogyakarta',
                'latitude' => -7.777212,
                'longitude' => 110.415520,
                'country' => 'Indonesia',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Yogyakarta',
                'latitude' => -7.789856,
                'longitude' => 110.364155,
                'country' => 'Indonesia',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Seoul',
                'latitude' => 37.560386,
                'longitude' => 126.982011,
                'country' => 'South Korea',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Ulaan Baatar',
                'latitude' => 47.92226,
                'longitude' => 106.91835,
                'country' => 'Mongolia',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Tokyo',
                'latitude' => 35.6895,
                'longitude' => 139.6917,
                'country' => 'Japan',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Beijing',
                'latitude' => 39.9042,
                'longitude' => 116.4074,
                'country' => 'China',
                'difficulty' => 'hard',
            ],
            [
                'name' => 'Bangkok',
                'latitude' => 13.7563,
                'longitude' => 100.5018,
                'country' => 'Thailand',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Manila',
                'latitude' => 14.5995,
                'longitude' => 120.9842,
                'country' => 'Philippines',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Hanoi',
                'latitude' => 21.0278,
                'longitude' => 105.8342,
                'country' => 'Vietnam',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Singapore',
                'latitude' => 1.3521,
                'longitude' => 103.8198,
                'country' => 'Singapore',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Jakarta',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'country' => 'Indonesia',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Canberra',
                'latitude' => -35.2809,
                'longitude' => 149.1300,
                'country' => 'Australia',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Wellington',
                'latitude' => -41.2865,
                'longitude' => 174.7762,
                'country' => 'New Zealand',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Berlin',
                'latitude' => 52.5200,
                'longitude' => 13.4050,
                'country' => 'Germany',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Paris',
                'latitude' => 48.8566,
                'longitude' => 2.3522,
                'country' => 'France',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'London',
                'latitude' => 51.5074,
                'longitude' => -0.1278,
                'country' => 'United Kingdom',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Rome',
                'latitude' => 41.9028,
                'longitude' => 12.4964,
                'country' => 'Italy',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Madrid',
                'latitude' => 40.4168,
                'longitude' => -3.7038,
                'country' => 'Spain',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Ottawa',
                'latitude' => 45.4215,
                'longitude' => -75.6972,
                'country' => 'Canada',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Washington D.C.',
                'latitude' => 38.9072,
                'longitude' => -77.0369,
                'country' => 'United States',
                'difficulty' => 'easy',
            ],
            [
                'name' => 'Mexico City',
                'latitude' => 19.4326,
                'longitude' => -99.1332,
                'country' => 'Mexico',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Brasilia',
                'latitude' => -15.8267,
                'longitude' => -47.9218,
                'country' => 'Brazil',
                'difficulty' => 'hard',
            ],
            [
                'name' => 'Buenos Aires',
                'latitude' => -34.6037,
                'longitude' => -58.3816,
                'country' => 'Argentina',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Cairo',
                'latitude' => 30.0444,
                'longitude' => 31.2357,
                'country' => 'Egypt',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Riyadh',
                'latitude' => 24.7136,
                'longitude' => 46.6753,
                'country' => 'Saudi Arabia',
                'difficulty' => 'medium',
            ],
            [
                'name' => 'Abu Dhabi',
                'latitude' => 24.4539,
                'longitude' => 54.3773,
                'country' => 'United Arab Emirates',
                'difficulty' => 'easy',
            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
