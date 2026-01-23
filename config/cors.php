<?php

return [
    'paths' => [
        'api/*',

        'login',
        'logout',
        'auth/*',
        'messages/*',
        'profile',
        'profile/*'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:8000',
],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Accept',
        'Content-Type',
        'X-Requested-With',
        'X-XSRF-TOKEN',
        'Authorization'
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];