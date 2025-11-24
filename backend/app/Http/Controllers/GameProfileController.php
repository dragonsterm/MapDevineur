<?php

namespace App\Http\Controllers;

use App\Models\GameProfile;
use Illuminate\Http\Request;

class GameProfileController extends Controller
{
    /**
     * Get the current user's profile
     */
    public function show(Request $request)
    {
        $profile = $request->user()->gameProfile;
        return response()->json([
            'profile' => $profile
        ]);
    }

    /**
     * Store a new game profile
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'display_name' => 'required|string|max:255',
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
        ]);

        return response()->json([
            'message' => 'Profile created successfully',
            'profile' => $profile
        ], 201);
    }
}