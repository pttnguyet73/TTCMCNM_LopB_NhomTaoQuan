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

    'hex' => [
        'required_without:hex_code',
        'string',
        'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'
    ],

    'hex_code' => [
        'required_without:hex',
        'string',
        'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'
    ],
];

    }

    protected function prepareForValidation()
    {
        // If hex is provided but not hex_code, rename it for consistency
        if ($this->has('hex') && !$this->has('hex_code')) {
            $this->merge([
                'hex_code' => $this->input('hex'),
            ]);
        }
    }

    public function messages(): array
    {
        return [
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'name.required'     => 'Vui lòng nhập tên màu.',
            'hex.required_without' => 'Vui lòng nhập mã màu hex.',
            'hex_code.required_without' => 'Vui lòng nhập mã màu hex.',
            'hex.regex' => 'Mã màu hex không hợp lệ.',
            'hex_code.regex' => 'Mã màu hex không hợp lệ.',
        ];
    }
}
