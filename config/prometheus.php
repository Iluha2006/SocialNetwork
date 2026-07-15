<?php

return [
    'enabled' => true,

    'urls' => [
        'default' => 'metrics',
    ],

    'allowed_ips' => [],

    'default_namespace' => 'app',

    'middleware' => [],

    'actions' => [
        'render_collectors' => Spatie\Prometheus\Actions\RenderCollectorsAction::class,
    ],

    'wipe_storage_after_rendering' => false,

    'cache' => 'redis',
];
