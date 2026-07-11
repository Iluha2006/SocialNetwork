<?php

namespace App\Http\Controllers\Image;

use App\Buses\Contracts\CommandBusInterface;
use App\Buses\Contracts\QueryBusInterface;
use App\Commands\Images\DeleteImageCommand;
use App\Commands\Images\UploadImageCommand;
use App\Http\Controllers\Controller;
use App\Queries\Images\GetUserImagesQuery;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function __construct(
        private readonly CommandBusInterface $commandBus,
        private readonly QueryBusInterface $queryBus,
    ) {}

    public function index($userId)
    {
        return response()->json($this->queryBus->ask(new GetUserImagesQuery((int) $userId)), 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'profile_images' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imageData = $this->commandBus->dispatch(new UploadImageCommand($request));

        return response()->json([
            'message' => 'Image uploaded successfully',
            'path_image' => $imageData,
        ], 201);
    }

    public function destroy($id)
    {
        $this->commandBus->dispatch(new DeleteImageCommand((int) $id));

        return response()->json(['message' => 'Image deleted successfully'], 200);
    }
}
