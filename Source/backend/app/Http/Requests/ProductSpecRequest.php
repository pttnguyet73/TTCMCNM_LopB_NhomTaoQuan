<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductSpecRequest extends FormRequest
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
            'product_id' => 'required|integer|exists:products,id',
            'label' => 'required|string|max:255',
            'value' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'label.required'     => 'Vui lòng nhập nhãn thông số.',
            'value.required' => 'Vui lòng nhập giá trị thông số.',
        ];
    }
}
