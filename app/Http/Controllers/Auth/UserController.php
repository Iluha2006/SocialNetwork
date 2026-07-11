<?php

namespace App\Http\Controllers\Auth;

use App\Buses\Contracts\QueryBusInterface;
use App\Http\Controllers\Controller;
use App\Queries\Auth\CheckAuthQuery;
use App\Queries\Auth\GetCurrentUserQuery;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function getCurrentUser(Request $request)
    {
        try {
            return response()->json($this->queryBus->ask(new GetCurrentUserQuery($request)));
        } catch (\RuntimeException $e) {
            $status = in_array($e->getCode(), [401, 403, 404], true) ? $e->getCode() : 401;
            return response()->json(['message' => $e->getMessage()], $status);
        }
    }

    public function checkAuth(Request $request)
    {
        return response()->json($this->queryBus->ask(new CheckAuthQuery($request)));
    }
}
