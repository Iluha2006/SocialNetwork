<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale())}}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta name="theme-color" content="#6777ef">
    <meta name="description" content="Social Network — общение, друзья, сообщества">
    <meta name="mobile-web-app-capable" content="yes">

    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/socials.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="SocialNetwork">

    <title>SocialNetwork</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
