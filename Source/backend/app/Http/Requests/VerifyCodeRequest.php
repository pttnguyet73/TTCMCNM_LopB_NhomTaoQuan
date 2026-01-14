<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyCodeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
   public function rules()
{
    return [
        'email' => 'required|email',
        'code' => 'required',
        'purpose' => 'required|in:register,reset_password'
    ];
}
    public function messages(): array
    {
        return [
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Định dạng email không hợp lệ.',
            'code.required' => 'Vui lòng nhập mã xác nhận.',
            'purpose.required' => 'Vui lòng nhập mục đích sử dụng mã.',
            'purpose.in' => 'Mục đích không hợp lệ. Chỉ chấp nhận "register" hoặc "reset_password".',
        ];
    }
}
