<?php

namespace App\Http\Controllers;

use App\Models\GameRound;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LocationController extends Controller
{
    public function getRandom(Request $request)
    {
        $userId = $request->user() ? $request->user()->id : null;
        $count = 5;

        $query = Location::query();

        if ($userId) {
            $playedLocationIds = GameRound::whereHas('game', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })->pluck('location_id');

            $query->whereNotIn('id', $playedLocationIds);
        }

        $locations = $query->inRandomOrder()
            ->limit($count)
            ->get(['id', 'name', 'latitude', 'longitude', 'country', 'difficulty']);

        if ($locations->count() < $count) {
            $needed = $count - $locations->count();
            
            $existingIds = $locations->pluck('id');
            
            $fallbackLocations = Location::whereNotIn('id', $existingIds)
                ->inRandomOrder()
                ->limit($needed)
                ->get(['id', 'name', 'latitude', 'longitude', 'country', 'difficulty']);

            $locations = $locations->merge($fallbackLocations);
        }

        if ($locations->count() < $count) {
             return response()->json([
                'message' => 'Not enough locations in the database to start a game.',
            ], 400);
        }

        return response()->json([
            'locations' => $locations->shuffle()->values(),
        ]);
    }
}

?>