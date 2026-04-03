<?php
namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Models\Profile;



class UpdateProfileRequest extends FormRequest{

    public function authorize(): bool
    {
        $profileId = $this->route('id');
        return $this->user()->profile?->id === (int) $profileId;
    }

    public function rules(): array
    {
        $profileId = $this->route('id');

        return [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:profiles,email,' . $profileId,
            'bio' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Поле имени обязательно для заполнения',
            'email.email' => 'Введите корректный email адрес',
            'email.unique' => 'Этот email уже используется',
            'bio.max' => 'Биография не должна превышать 1000 символов',
        ];
    }


}


