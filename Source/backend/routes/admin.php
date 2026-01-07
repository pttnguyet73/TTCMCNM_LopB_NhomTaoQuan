<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;



Route::get('register', [AuthController::class, 'register'])->name('register');
