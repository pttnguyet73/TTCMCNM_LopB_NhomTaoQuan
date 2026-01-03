<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
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
            'name'      => 'required|string|max:255',
            'slug'      => 'required|string|max:255|unique:category,slug',
            'icon'      => 'required|string|max:255',
            'is_deleted'=> 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'      => 'Vui lòng nhập tên danh mục.',
            'slug.required'      => 'Vui lòng nhập slug danh mục.',
            'slug.unique'        => 'Slug danh mục đã tồn tại.',
            'icon.required'      => 'Vui lòng nhập biểu tượng danh mục.',
            'is_deleted.required'=> 'Vui lòng chỉ định trạng thái xóa danh mục.',
        ];
    }
}
