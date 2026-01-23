<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateContactRequest extends FormRequest
{
    public function authorize()
    {
        return ContactProfile::find($this->route('id'))?->user_id === auth()->id();
    }

    public function rules()
    {
        return [
            'phone' => 'required|string|max:12',
            'city' => 'required|string|max:100',
        ];
    }

    public function messages()
    {
        return [
            'phone.required' => 'Телефон обязателен для заполнения',
            'phone.max' => 'Телефон не должен превышать 12 символов',
            'city.required' => 'Город обязателен для заполнения',
            'city.max' => 'Город не должен превышать 100 символов'
        ];
    }



}