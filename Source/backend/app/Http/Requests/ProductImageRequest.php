<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductImageRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'image_url' => 'required|url',
            'is_main'    => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Mã sản phẩm là bắt buộc.',
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'image.required' => 'Vui lòng chọn hình ảnh.',
            'image.image' => 'Tập tin phải là hình ảnh.',
            'image.mimes' => 'Định dạng hình ảnh phải là: jpeg, png, jpg, gif, webp.',
            'image.max' => 'Kích thước hình ảnh không được vượt quá 5MB.',
            'is_main.boolean' => 'Giá trị is_main phải là true hoặc false.',
        ];
    }
}
