<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

use Laravel\Socialite\Facades\Socialite;

use Exception;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;



class GoogleController extends Controller

{
    public function redirectToGoogle()
    {

        return Socialite::driver('google')->redirect();
    }


    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 'user',
                ]);
            }

            Auth::login($user);

            $token = $user->createToken('authToken')->plainTextToken;

            return redirect(
                'http://localhost:5173/auth/callback'
                    . '?token=' . $token
                    . '&role=' . $user->role
                    . '&id=' . $user->id
            );
        } catch (Exception $e) {
            return redirect(
                'http://localhost:5173/login?error=google_login_failed'
            );
        }
    }
}
