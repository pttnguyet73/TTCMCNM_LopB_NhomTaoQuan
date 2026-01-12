<?php

  

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Foundation\Auth\User as Authenticatable;

use Illuminate\Notifications\Notifiable;

use Laravel\Fortify\TwoFactorAuthenticatable;

use Laravel\Jetstream\HasProfilePhoto;

use Laravel\Sanctum\HasApiTokens;

  

class User extends Authenticatable implements MustVerifyEmail

{

    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use TwoFactorAuthenticatable;
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
         'is_verified',
        'code',
        'code_expires_at',
        'role',
        'status',
    ];

    protected $hidden = [

        'password',

        'remember_token',

    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'code_expires_at' => 'datetime',
    ];


    protected $appends = [

        'profile_photo_url',

    ];

    protected $dates = [
        'deleted_at',
    ];
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

}