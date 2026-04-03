@component('mail::message')

# Подтверждение email

Привет, **{{ 'Пользователь' }} **!

Добро пожаловать в **{{ $appName }}**!

Для завершения регистрации подтвердите ваш email:

@component('mail::button', ['url' => $url, 'color' => 'primary'])
 Подтвердить email
@endcomponent

>  Ссылка действительна **{{ $expires }} минут**.

@component('mail::subcopy')
© {{ date('Y') }} {{ $appName }}. Все права защищены.
@endcomponent

@endcomponent