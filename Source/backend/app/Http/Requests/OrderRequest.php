<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'address_id' => 'required|exists:address,id',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|string',
            'shipping_fee' => 'required|numeric|min:0',
            'tracking_number' => 'nullable|string',
            'coupon_code' => 'nullable|string',
        ];
    }
}
