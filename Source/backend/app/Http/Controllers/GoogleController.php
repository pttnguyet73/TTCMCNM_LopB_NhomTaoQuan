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
            $user = Socialite::driver('google')->user();

            $finduser = User::where('google_id', $user->id)->first();

            if ($finduser) {

                Auth::login($finduser);
                $token = $finduser->createToken('authToken')->plainTextToken;

                return redirect(
                    'http://localhost:5173/admin'
                );
            } else {

                $newUser = User::create([

                    'name' => $user->name,

                    'email' => $user->email,

                    'google_id' => $user->id,

                    'password' => Hash::make(Str::random(24)),
                    'role' => 'user',

                ]);

                Auth::login($newUser);

                $token = $newUser->createToken('authToken')->plainTextToken;
                return redirect('http://localhost:5173/auth/callback' .
                    '?token=' . $token .
                    '&role=' . $user->role .
                    '&id=' . $user->id);
            }
        } catch (Exception $e) {

            dd($e->getMessage());
        }
    }
}
