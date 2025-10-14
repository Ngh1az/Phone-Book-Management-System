<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by policies
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20', 'regex:/^[0-9\s\-\+\(\)]+$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'company' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'birthday' => ['nullable', 'date', 'before:today'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'is_favorite' => ['boolean'],
            'group_id' => [
                'nullable',
                'integer',
                'exists:groups,id',
                function ($attribute, $value, $fail) {
                    if ($value && !\App\Models\Group::where('id', $value)->where('user_id', auth()->id())->exists()) {
                        $fail('The selected group does not belong to you.');
                    }
                },
            ],
            'tags' => ['nullable', 'array'],
            'tags.*' => [
                'integer',
                'exists:tags,id',
            ],
            'avatar' => ['nullable', 'image', 'max:2048'], // 2MB max
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->has('tags') && is_array($this->tags)) {
                $userId = auth()->id();
                $tags = \App\Models\Tag::whereIn('id', $this->tags)->where('user_id', $userId)->pluck('id')->toArray();

                if (count($tags) !== count($this->tags)) {
                    $validator->errors()->add('tags', 'Some selected tags do not belong to you.');
                }
            }
        });
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'last_name' => 'last name',
            'phone_number' => 'phone number',
            'group_id' => 'group',
            'tags.*' => 'tag',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone_number.regex' => 'The phone number format is invalid. Only numbers, spaces, dashes, plus signs, and parentheses are allowed.',
            'birthday.before' => 'The birthday must be a date before today.',
            'avatar.max' => 'The avatar must not be larger than 2MB.',
        ];
    }
}
