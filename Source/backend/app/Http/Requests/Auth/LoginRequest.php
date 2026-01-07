<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

class LoginRequest extends BaseRequest
{
  
    public function rules()
    {
        return [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|max:255',
        ];
    }
}
