<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);

        $scores = Score::with('user:id,username')
            ->orderBy('score', 'desc')
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);

        return response()->json([
            'leaderboard' => $scores->map(function ($score, $index) use ($scores) {
                return [
                    'rank' => $scores->firstItem() + $index,
                    'username' => $score->user->username,
                    'score' => $score->score,
                    'created_at' => $score->created_at->toDateTimeString(),
                ];
            }),
            'pagination' => [
                'current_page' => $scores->currentPage(),
                'last_page' => $scores->lastPage(),
                'per_page' => $scores->perPage(),
                'total' => $scores->total(),
            ],
        ]);
    }

    public function userScores($id)
    {
        $scores = Score::where('user_id', $id)
            ->with('user:id,username')
            ->orderBy('score', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'scores' => $scores->map(function ($score) {
                return [
                    'score' => $score->score,
                    'created_at' => $score->created_at->toDateTimeString(),
                ];
            }),
        ]);
    }
}

?>
