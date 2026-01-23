<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateContactRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'phone' => 'required|string|max:20|unique:contact_profiles,phone',
            'city' => 'required|string|max:100',
            'profile_id' => 'sometimes|exists:profiles,id'
        ];
    }

    public function messages()
    {
        return [
            'phone.required' => 'Телефон обязателен для заполнения',
            'phone.max' => 'Телефон не должен превышать 20 символов',
            'phone.unique' => 'Этот номер телефона уже используется',
            'city.required' => 'Город обязателен для заполнения',
            'city.max' => 'Город не должен превышать 100 символов',
        ];
    }


}