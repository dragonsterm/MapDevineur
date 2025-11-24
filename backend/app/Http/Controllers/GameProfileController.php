<?php

namespace App\Http\Controllers;

use App\Models\GameProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GameProfileController extends Controller
{
    /**
     * Get the current user's profile
     */
    public function show(Request $request)
    {
        $profile = $request->user()->gameProfile;
        $highScore = $request->user()->scores()->max('score') ?? 0;

        return response()->json([
            'profile' => $profile,
            'high_score' => $highScore
        ]);
    }

    /**
     * Get a specific user's profile (Public)
     */
    public function getPublicProfile($userId)
    {
        $user = User::with('gameProfile')->findOrFail($userId);
        $highScore = $user->scores()->max('score') ?? 0;

        return response()->json([
            'profile' => $user->gameProfile,
            'username' => $user->username,
            'high_score' => $highScore,
            'is_own_profile' => Auth::id() === $user->id
        ]);
    }

    /**
     * Store a new game profile
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'display_name' => 'required|string|max:32',
            'country' => 'required|string|max:255',
            'gender' => 'required|in:male,female,not specify',
        ]);

        if ($request->user()->gameProfile) {
            return response()->json(['message' => 'Profile already exists'], 409);
        }

        $profile = $request->user()->gameProfile()->create([
            'display_name' => $validated['display_name'],
            'country' => $validated['country'],
            'gender' => $validated['gender'],
            'avatar' => 'dino_idle'
        ]);

        return response()->json([
            'message' => 'Profile created successfully',
            'profile' => $profile
        ], 201);
    }

    /**
     * Update existing profile
     */
    public function update(Request $request)
    {
        $profile = $request->user()->gameProfile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $validated = $request->validate([
            'display_name' => 'sometimes|string|max:32',
            'country' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female,not specify',
            'bio' => 'nullable|string|max:200',
            'date_of_birth' => 'nullable|date',
            'avatar' => 'sometimes|string'
        ]);

        $profile->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ]);
    }

    /**
     * Delete the user account and all related data
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}