<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'status' => 'required|integer|min:0',
            'category_id' => 'required|exists:category,id',
            'is_featured' => 'required|boolean',
            'is_new' => 'required|boolean',
            'rating' => 'nullable|numeric|min:0|max:5',
            'review_count' => 'nullable|integer|min:0',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:255',
            // Optional: colors array
            'colors' => 'nullable|array',
            'colors.*.name' => 'string|max:255',
            'colors.*.hex' => 'string|regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
            // Optional: specs array
            'specs' => 'nullable|array',
            'specs.*.label' => 'string|max:255',
            'specs.*.value' => 'string|max:255',
            // Optional: storage array
            'storage' => 'nullable|array',
            'storage.*' => 'string|max:255',
        ];
    }
}
