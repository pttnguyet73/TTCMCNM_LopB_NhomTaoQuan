<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendCodeRequest;
use App\Http\Requests\Auth\VerifyCodeRequest;
use App\Http\Resources\UserResource;
use App\Mail\SendCodeVerifyEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $userInput = $request->validated();
        $userInput['password'] = Hash::make($userInput['password']);
        $userInput['code'] = Str::random(6);
        $userInput['code_expires_at'] = now()->addMinutes(10);
        $user = User::create($userInput);

        Mail::to($user->email)->send(new SendCodeVerifyEmail($user->code));

        return response()->json([
            'message' => 'User registered successfully',
            'user' => new UserResource($user)
        ], 201);
    }

    public function verifyEmail(VerifyCodeRequest $request)
    {
        $userInput = $request->validated();
        $user = User::where('email', $userInput['email'])->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        if ($user->code !== $userInput['code']) {
            return response()->json([
                'message' => 'Invalid code',
            ], 400);
        }

        if ($user->code_expires_at < now()) {
            return response()->json([
                'message' => 'Code expired',
            ], 400);
        }
        
        $user->is_verified = true;
        $user->code = null;
        $user->code_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'Email verified successfully',
            'user' => new UserResource($user)
        ], 200);
    }

    public function resendCode(ResendCodeRequest $request)
    {
        $userInput = $request->validated();
        $user = User::where('email', $userInput['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $code = Str::random(6);
        $expiresAt = now()->addMinutes(10);
        $user->code = $code;
        $user->code_expires_at = $expiresAt;
        $user->save();

        Mail::to($user->email)->send(new SendCodeVerifyEmail($code));

        return response()->json([
            'message' => 'Code sent successfully',
        ], 200);
    }

    public function login(LoginRequest $request)
    {
        $userInput = $request->validated();
        $user = User::where('email', $userInput['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email or password is incorrect',
            ], 401);
        }

        if (!$user->is_verified) {
            return response()->json([
                'message' => 'Email is not verified',
            ], 401);
        }

        $checkPassword = Hash::check($userInput['password'], $user->password);

        if (!$checkPassword) {
            return response()->json([
                'message' => 'Email or password is incorrect',
            ], 401);
        }

        $accessToken = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user),
            'access_token' => $accessToken
        ], 200);
    }

    public function getProfile()
    {
        return new UserResource(Auth::user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }
}
