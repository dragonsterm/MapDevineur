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
                'name' => 
                'Sydney Opera House', 
                'latitude' => -33.856784, 
                'longitude' => 151.215297, 
                'country' => 'Australia', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Taj Mahal', 
                'latitude' => 27.175015, 
                'longitude' => 78.042155, 
                'country' => 'India', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Great Wall of China', 
                'latitude' => 40.431908, 
                'longitude' => 116.570374, 
                'country' => 'China', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Eiffel Tower', 
                'latitude' => 48.858400, 
                'longitude' => 2.294500, 
                'country' => 'France', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Colosseum', 
                'latitude' => 41.890210, 
                'longitude' => 12.492231, 
                'country' => 'Italy', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Statue of Liberty', 
                'latitude' => 40.689200, 
                'longitude' => -74.044500, 
                'country' => 'USA', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Machu Picchu', 
                'latitude' => -13.163100, 
                'longitude' => -72.545000, 
                'country' => 'Peru', 
                'difficulty' => 'hard'
            ],
            [
                'name' => 'Shibuya Crossing', 
                'latitude' => 35.659500, 
                'longitude' => 139.700600, 
                'country' => 'Japan', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Petra', 
                'latitude' => 30.328500, 
                'longitude' => 35.444400, 
                'country' => 'Jordan', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Burj Khalifa', 
                'latitude' => 25.197200, 
                'longitude' => 55.274400, 
                'country' => 'UAE', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Santorini (Oia)', 
                'latitude' => 36.461800, 
                'longitude' => 25.375300, 
                'country' => 'Greece', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Pyramids of Giza', 
                'latitude' => 29.979200, 
                'longitude' => 31.134200, 
                'country' => 'Egypt', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Baldwin Street', 
                'latitude' => -45.850300, 
                'longitude' => 170.533300, 
                'country' => 'New Zealand', 
                'difficulty' => 'hard'
            ],
            [
                'name' => 'The Dark Hedges', 
                'latitude' => 55.134700, 
                'longitude' => -6.381300, 
                'country' => 'UK', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Lombard Street', 
                'latitude' => 37.802100, 
                'longitude' => -122.418700, 
                'country' => 'USA', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Chefchaouen Medina', 
                'latitude' => 35.168800, 
                'longitude' => -5.268300, 
                'country' => 'Morocco', 
                'difficulty' => 'hard'
            ],
            [
                'name' => 'Atlantic Ocean Road', 
                'latitude' => 63.016500, 
                'longitude' => 7.354100, 
                'country' => 'Norway', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Oatman Highway', 
                'latitude' => 35.026400, 
                'longitude' => -114.383500, 
                'country' => 'USA', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Caminito Street', 
                'latitude' => -34.639400, 
                'longitude' => -58.362800, 
                'country' => 'Argentina', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Longyearbyen', 
                'latitude' => 78.223200, 
                'longitude' => 15.626700, 
                'country' => 'Svalbard', 
                'difficulty' => 'hard'
            ],
            [
                'name' => 'Hosier Lane', 
                'latitude' => -37.816300, 
                'longitude' => 144.969100, 
                'country' => 'Australia', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Dotonbori', 
                'latitude' => 34.668700, 
                'longitude' => 135.501300, 
                'country' => 'Japan', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Kuala Lumpur', 
                'latitude' => 3.146781, 
                'longitude' => 101.711264, 
                'country' => 'Malaysia', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Yogyakarta', 
                'latitude' => -7.777212, 
                'longitude' => 110.415520, 
                'country' => 'Indonesia', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Malioboro Street', 
                'latitude' => -7.789856, 
                'longitude' => 110.364155, 
                'country' => 'Indonesia', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Seoul', 
                'latitude' => 37.560386, 
                'longitude' => 126.982011, 
                'country' => 'South Korea', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Ulaan Baatar', 
                'latitude' => 47.922260, 
                'longitude' => 106.918347, 
                'country' => 'Mongolia', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Times Square', 
                'latitude' => 40.758000, 
                'longitude' => -73.985500, 
                'country' => 'USA', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Christ the Redeemer', 
                'latitude' => -22.951900, 
                'longitude' => -43.210500, 
                'country' => 'Brazil', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Grand Canyon (Mather Point)', 
                'latitude' => 36.061700, 
                'longitude' => -112.107700, 
                'country' => 'USA', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Stonehenge', 
                'latitude' => 51.178900, 
                'longitude' => -1.826200, 
                'country' => 'UK', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Abbey Road Crossing', 
                'latitude' => 51.532000, 
                'longitude' => -0.177400, 
                'country' => 'UK', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Salar de Uyuni', 
                'latitude' => -20.133800, 
                'longitude' => -67.489100, 
                'country' => 'Bolivia', 
                'difficulty' => 'hard'
            ],
            [
                'name' => 'Copacabana Beach', 
                'latitude' => -22.971100, 
                'longitude' => -43.182200, 
                'country' => 'Brazil', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Khao San Road', 
                'latitude' => 13.758800, 
                'longitude' => 100.497500, 
                'country' => 'Thailand', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Hagia Sophia', 
                'latitude' => 41.008600, 
                'longitude' => 28.980200, 
                'country' => 'Turkey', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Niagara Falls', 
                'latitude' => 43.089600, 
                'longitude' => -79.084900, 
                'country' => 'Canada', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Table Mountain', 
                'latitude' => -33.962800, 
                'longitude' => 18.409800, 
                'country' => 'South Africa', 
                'difficulty' => 'hard'
            ],
            [
                'name' => 'Hallstatt', 
                'latitude' => 47.562200, 
                'longitude' => 13.649300, 
                'country' => 'Austria', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Dubrovnik Old Town', 
                'latitude' => 42.641200, 
                'longitude' => 18.110400, 
                'country' => 'Croatia', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Hollywood Walk of Fame', 
                'latitude' => 34.101600, 
                'longitude' => -118.326700, 
                'country' => 'USA', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Rainbow Street', 
                'latitude' => 64.142500, 
                'longitude' => -21.929000, 
                'country' => 'Iceland', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Cartagena Walled City', 
                'latitude' => 10.421900, 
                'longitude' => -75.548400, 
                'country' => 'Colombia', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Kathmandu Durbar Square', 
                'latitude' => 27.704200, 
                'longitude' => 85.306700, 
                'country' => 'Nepal', 
                'difficulty' => 'hard'
            ],
            [
                'name' => 'Calle Jaen', 
                'latitude' => -16.492200, 
                'longitude' => -68.135900, 
                'country' => 'Bolivia', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Hanoi Train Street', 
                'latitude' => 21.024500, 
                'longitude' => 105.841200, 
                'country' => 'Vietnam', 
                'difficulty' => 'hard'
            ],
            [
                'name' => 'Charles Bridge', 
                'latitude' => 50.086500, 
                'longitude' => 14.411400, 
                'country' => 'Czechia', 
                'difficulty' => 'easy'
            ],
            [
                'name' => 'Pink Street', 
                'latitude' => 38.707200, 
                'longitude' => -9.144800, 
                'country' => 'Portugal', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Victoria Street', 
                'latitude' => 55.948200, 
                'longitude' => -3.193300, 
                'country' => 'UK', 
                'difficulty' => 'medium'
            ],
            [
                'name' => 'Petit Champlain', 
                'latitude' => 46.812300, 
                'longitude' => -71.203800, 
                'country' => 'Canada', 
                'difficulty' => 'medium'
            ],
        ];

        foreach ($locations as $location) {
            Location::firstOrCreate(
                ['name' => $location['name']],
                $location
            );
        }
    }
}