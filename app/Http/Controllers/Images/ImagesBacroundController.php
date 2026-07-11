<?php

namespace App\Http\Controllers\Images;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Images\SetChatBackgroundCommand;
use App\Http\Controllers\Controller;
use App\Models\ImagesBacround;
use App\Queries\Images\GetCurrentBackgroundQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImagesBacroundController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function index($userId)
    {
        $images = ImagesBacround::where('user_id', $userId)->get();

        return response()->json($images, 200);
    }

    public function setChatBackground(Request $request)
    {
        $request->validate([
            'chat_background' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'user_id' => 'required|exists:users,id',
        ]);

        $result = $this->commandBus->dispatch(new SetChatBackgroundCommand($request));

        return response()->json($result, 201);
    }

    public function destroy($id)
    {
        $image = ImagesBacround::findOrFail($id);

        $urlPath = parse_url($image->path_image, PHP_URL_PATH);
        $s3Path = ltrim($urlPath, '/');

        if (Storage::disk('s3')->exists($s3Path)) {
            Storage::disk('s3')->delete($s3Path);
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Изображение успешно удалено',
        ], 200);
    }

    public function getCurrentBackground($userId)
    {
        return response()->json(
            $this->queryBus->ask(new GetCurrentBackgroundQuery((int) $userId))
        );
    }
}
