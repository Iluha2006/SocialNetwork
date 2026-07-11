<?php

namespace App\Http\Controllers;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Online\SetOfflineCommand;
use App\Commands\Online\SetOnlineCommand;
use App\Queries\Online\CheckUserStatusQuery;
use App\Queries\Online\GetOnlineUsersQuery;
use Illuminate\Http\Request;

class OnlineStatusController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function getOnlineUsers(Request $request)
    {
        return response()->json($this->queryBus->ask(new GetOnlineUsersQuery()));
    }

    public function setUserOnline(Request $request)
    {
        $result = $this->commandBus->dispatch(new SetOnlineCommand($request));

        return response()->json($result);
    }

    public function setUserOffline(Request $request)
    {
        $result = $this->commandBus->dispatch(new SetOfflineCommand($request));

        return response()->json($result);
    }

    public function checkUserStatus($userId)
    {
        return response()->json($this->queryBus->ask(new CheckUserStatusQuery((int) $userId)));
    }
}
