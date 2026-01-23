<?php

namespace App\Http\Requests\Audio;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AudioMessageRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'audio_mess' => 'required|file|mimes:audio/mpeg,mp3,wav,aac,webm,ogg|max:10240',
            'receiver_id' => 'required|exists:users,id',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'audio_mess.required' => 'Аудио файл обязателен для отправки',
            'audio_mess.file' => 'Файл должен быть корректным аудио файлом',
            'audio_mess.mimes' => 'Аудио файл должен быть одного из форматов: mpeg, mp3, wav, aac, webm, ogg',
            'audio_mess.max' => 'Размер аудио файла не должен превышать 10MB',

            'receiver_id.required' => 'ID получателя обязателен',
            'receiver_id.exists' => 'Указанный получатель не существует',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'error' => $validator->errors()->first()
        ], 422));
    }

}
