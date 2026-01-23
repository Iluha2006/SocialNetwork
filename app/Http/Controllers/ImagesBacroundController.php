<?php

namespace App\Http\Controllers;

use App\Models\ImagesBacround;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImagesBacroundController extends Controller
{
    public function index($userId)
    {
        $images = ImagesBacround::where('user_id', $userId)->get();
        return response()->json($images, 200);
    }

    public function setChatBackground(Request $request)
    {
        $validated = $request->validate([
            'chat_background' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'user_id' => 'required|exists:users,id'
        ]);


            $user = $request->user();
            $imageUrl = null;

            if ($request->hasFile('chat_background')) {
                $image = $request->file('chat_background');


                $filename = 'chat_bg_' . $user->id . '_' . time() . '.' . $image->getClientOriginalExtension();


                $path = $image->storeAs("chat-backgrounds/{$user->id}", $filename, 's3');


                $imageUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $path;
            }


            $chatBackground = ImagesBacround::updateOrCreate(
                ['user_id' => $user->id],
                ['path_image' => $imageUrl]
            );

            return response()->json([
                'success' => true,
                'path_image' => $imageUrl,
                'message' => 'Фон чата успешно установлен'
            ], 201);


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
                'message' => 'Изображение успешно удалено'
            ], 200);

    }


    public function getCurrentBackground($userId)
    {

            $background = ImagesBacround::where('user_id', $userId)->first();

            return response()->json([
                'success' => true,
                'background' => $background ? $background->path_image : null
            ], 200);

    }
}