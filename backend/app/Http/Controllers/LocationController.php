<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameRound;
use App\Models\Score;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LocationController extends Controller
{
    public function getRandom()
    {
        $locations = Location::inRandomOrder()
            ->limit(5)
            ->get(['id', 'name', 'latitude', 'longitude', 'country', 'difficulty']);

        if ($locations->count() < 5) {
            return response()->json([
                'message' => 'Not enough locations available. Please add more locations to the database.',
            ], 400);
        }

        return response()->json([
            'locations' => $locations,
        ]);
    }
}
?>
