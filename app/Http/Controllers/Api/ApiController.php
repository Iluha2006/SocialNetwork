<?php

namespace App\Http\Controllers\Api;

use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;


abstract class ApiController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    protected function success(mixed $data = null, string $message , int $code = Response::HTTP_OK): JsonResponse
    {
        return response()->json(
            data: [
                'success' => true,
                'message' => $message,
                'data' => $data,
            ],
            status: $code,
            options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        );
    }


    protected function error(string $message = 'Error', int $code = Response::HTTP_BAD_REQUEST, mixed $errors = null): JsonResponse
    {
        return response()->json(
            data: [
                'success' => false,
                'message' => $message,
                'errors' => $errors,
            ],
            status: $code,
            options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        );
    }


    protected function created(mixed $data = null, string $message = 'Created'): JsonResponse
    {
        return $this->success($data, $message, Response::HTTP_CREATED);
    }


    protected function noContent(): JsonResponse
    {
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
