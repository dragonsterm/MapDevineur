<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameRound;
use App\Models\Score;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function create(Request $request)
    {
        $game = Game::create([
            'user_id' => $request->user()->id,
            'total_score' => 0,
        ]);

        return response()->json([
            'message' => 'Game created successfully',
            'game' => [
                'id' => $game->id,
                'total_score' => $game->total_score,
            ],
        ], 201);
    }

    public function submitRound(Request $request, $id)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'round_number' => 'required|integer|min:1|max:5',
            'guess_latitude' => 'required|numeric|between:-90,90',
            'guess_longitude' => 'required|numeric|between:-180,180',
            'time_taken' => 'required|integer|min:0|max:120',
        ]);

        $game = Game::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $location = \App\Models\Location::findOrFail($validated['location_id']);
        
        $distance = $this->calculateDistance(
            $location->latitude,
            $location->longitude,
            $validated['guess_latitude'],
            $validated['guess_longitude']
        );

        $baseScore = max(0, 5000 - ($distance * 10));
        $timeBonus = max(0, (120 - $validated['time_taken']) * 10);
        $roundScore = (int) ($baseScore + $timeBonus);

        $round = GameRound::create([
            'game_id' => $game->id,
            'location_id' => $validated['location_id'],
            'round_number' => $validated['round_number'],
            'guess_latitude' => $validated['guess_latitude'],
            'guess_longitude' => $validated['guess_longitude'],
            'distance' => $distance,
            'time_taken' => $validated['time_taken'],
            'round_score' => $roundScore,
        ]);

        return response()->json([
            'message' => 'Round submitted successfully',
            'round' => [
                'id' => $round->id,
                'distance' => $distance,
                'time_taken' => $validated['time_taken'],
                'round_score' => $roundScore,
                'actual_location' => [
                    'latitude' => $location->latitude,
                    'longitude' => $location->longitude,
                    'name' => $location->name,
                ],
            ],
        ]);
    }

    public function complete(Request $request, $id)
    {
        $game = Game::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $totalScore = GameRound::where('game_id', $game->id)->sum('round_score');

        $game->update([
            'total_score' => $totalScore,
            'completed_at' => now(),
        ]);

        Score::create([
            'user_id' => $request->user()->id,
            'game_id' => $game->id,
            'score' => $totalScore,
        ]);

        return response()->json([
            'message' => 'Game completed successfully',
            'game' => [
                'id' => $game->id,
                'total_score' => $totalScore,
                'completed_at' => $game->completed_at,
            ],
        ]);
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}

?>
