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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $userInput = $request->validated();
        $userInput['password'] = Hash::make($userInput['password']);
        $userInput['code'] = Str::random(6);
        $userInput['code_expires_at'] = now()->addMinutes(10);
        $userInput['code_purpose'] = 'register';

        $user = User::create($userInput);

        Mail::to($user->email)->send(
            new SendCodeVerifyEmail($user->code)
        );

        return response()->json([
            'message' => 'User registered successfully',
            'user' => new UserResource($user)
        ], 201);
    }


    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'purpose' => 'nullable|in:register,reset_password',
        ]);

        $email = $request->email;
        $code = $request->code;
        $purpose = $request->input('purpose', 'register');

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->code !== $code) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

        if (!$user->code_expires_at || $user->code_expires_at->isPast()) {
            return response()->json(['message' => 'Code expired'], 400);
        }

        if ($purpose === 'register') {
            $user->email_verified_at = now();
        }

        // clear OTP
        $user->code = null;
        $user->code_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'Verify code success'
        ]);
    }



    public function resendCode(ResendCodeRequest $request)
    {
        $data = $request->validated();
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        // mặc định resend cho verify đăng ký
        $purpose = $data['purpose'] ?? 'register';

        // quên mật khẩu thì user phải tồn tại
        if ($purpose === 'reset_password' && !$user->is_verified) {
            return response()->json([
                'message' => 'Email chưa được xác thực',
            ], 400);
        }

        $code = rand(100000, 999999);

        $user->code = $code;
        $user->code_expires_at = now()->addMinutes(10);
        $user->code_purpose = $purpose;
        $user->save();

        Mail::to($user->email)->send(
            new SendCodeVerifyEmail($code)
        );

        return response()->json([
            'message' => 'Code sent successfully',
            'purpose' => $purpose
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

    public function updateProfile(Request $request)
{
    
    $user = Auth::userOrFail();

   
    $validated = $request->validate([
        'name'   => 'nullable|string|max:255',
        'phone'  => 'nullable|string|max:50',
        'avatar' => 'nullable|image|max:5120',
    ]);

    if ($request->hasFile('avatar')) {
        $path = $request->file('avatar')->store('profile-photos', 'public');
        $user->profile_photo_path = $path;
    }

    if ($request->filled('name')) {
        $user->name = $validated['name'];
    }

    if ($request->filled('phone')) {
        $user->phone = $validated['phone'];
    }

    $user->save();

    return new UserResource($user);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password reset successfully'
        ], 200);
    }
}
