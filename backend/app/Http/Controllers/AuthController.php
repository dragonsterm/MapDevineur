<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * register a new user
     */
    public function register(Request $request) {
        $validated =  $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);

        return response()->json([
            'message' => 'Registration successful',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ],
        ], 201);
    }

    /**
     * login an existing user
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('username', 'password'))) {
            throw ValidationException::withMessages([
                'username' => ['Wrong username or password.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => Auth::user()->id,
                'username' => Auth::user()->username,
            ],
        ]);
    }

    /**
     * Check if user exists (Step 1 of Reset Password)
     */
    public function checkUser(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
        ]);

        $exists = User::where('username', $request->username)->exists();

        if (!$exists) {
            return response()->json([
                'message' => 'Account not found with this username',
            ], 404);
        }

        return response()->json([
            'message' => 'User found',
        ]);
    }

    /**
     * Reset Password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:users,username',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('username', $request->username)->first();
        
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'username' => $request->user()->username,
            ],
        ]);
    }
}

?>