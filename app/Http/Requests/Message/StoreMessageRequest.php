<?php

namespace App\Http\Requests\Message;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return
        [
            'content' => 'nullable|string|max:1000',
            'receiver_id' => 'required|exists:users,id',
            'image_mess' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'file' => 'nullable|file|mimes:pdf,docx,txt,zip,rar,xls,xlsx,ppt,pptx|max:10240'
        ];
    }

    public function messages()
{
    return [
        'image_mess.image' => 'Файл должен быть изображением',
        'image_mess.mimes' => 'Изображение должно быть в формате: jpeg, png, jpg, gif',
        'image_mess.max' => 'Размер изображения не должен превышать 10MB',

        'file.file' => 'Файл должен быть корректным файлом',
        'file.mimes' => 'Файл должен быть одного из форматов: pdf, doc, docx, txt, zip, rar, xls, xlsx, ppt, pptx',
        'file.max' => 'Размер файла не должен превышать 10MB'
    ];
}
}