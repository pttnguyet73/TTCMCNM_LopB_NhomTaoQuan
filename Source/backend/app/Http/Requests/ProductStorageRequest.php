<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStorageRequest extends FormRequest
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
            'product_id' => 'required|exists:product,id',
            'value'          => 'required|string|max:255',
            'stock_quantity' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'value.required'     => 'Vui lòng nhập giá trị lưu trữ.',
            'stock_quantity.required' => 'Vui lòng nhập số lượng tồn kho.',
        ];
    }
}
