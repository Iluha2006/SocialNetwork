<?php

namespace App\Http\Middleware;

use Closure;
use Prometheus\CollectorRegistry;

class PrometheusMetrics
{
    public function __construct(
        private CollectorRegistry $registry
    ) {}

    public function handle($request, Closure $next)
    {
        if ($request->path() === 'metrics') {
            return $next($request);
        }

        $start = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $start;
        $method = $request->method();
        $endpoint = $request->path();
        $status = $response->getStatusCode();

        $this->registry->getOrRegisterCounter(
            'app', 'requests_total', 'Total number of requests',
            ['method', 'endpoint', 'status']
        )->incBy(1, [$method, $endpoint, (string) $status]);

        $this->registry->getOrRegisterHistogram(
            'app', 'response_time_seconds', 'Request duration in seconds',
            ['method', 'endpoint'],
            [0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
        )->observe($duration, [$method, $endpoint]);

        if ($status >= 400) {
            $this->registry->getOrRegisterCounter(
                'app', 'errors_total', 'Total number of errored requests',
                ['method', 'endpoint', 'status']
            )->incBy(1, [$method, $endpoint, (string) $status]);
        }

        return $response;
    }
}
