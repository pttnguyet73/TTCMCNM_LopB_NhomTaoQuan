<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class ResendCodeRequest extends BaseRequest
{
    public function rules()
    {
        return [
            'email' => 'required|string|email|max:255',
        ];
    }
}
