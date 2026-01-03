<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductColorRequest extends FormRequest
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
            'name'       => 'required|string|max:255',
            'hex_code'   => 'required|string|max:7', // Ví dụ: #FFFFFF
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'name.required'     => 'Vui lòng nhập tên màu.',
            'hex_code.required' => 'Vui lòng nhập mã màu hex.',
        ];
    }
}
