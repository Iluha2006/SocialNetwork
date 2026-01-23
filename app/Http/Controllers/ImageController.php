<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ImageProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ImageController extends Controller
{
    public function index($userId)
    {

            $images = ImageProfile::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
            return response()->json($images, 200);

    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'profile_images' => 'required|image|mimes:jpeg,png,jpg|max:2048',

    ]);



        $user = $request->user();
        $imageUrl = null;

        if ($request->hasFile('profile_images')) {
            $image = $request->file('profile_images');
            $filename = time() . '_' . $image->getClientOriginalName();
$directory = "profile/{$user->id}/photo";
$fullPath = "{$directory}/{$filename}";


Storage::disk('s3')->put($fullPath, file_get_contents($image), 'public');


$imageUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET') . '/' . $fullPath;

        }

        $image = ImageProfile::create([
            'user_id' => $user->id,
            'path_image' => $imageUrl,
        ]);

        return response()->json([
            'message' => 'Image uploaded successfully',
            'path_image' => $image,

        ], 201);


}
    public function destroy($id)
    {

            $image = ImageProfile::findOrFail($id);
            Storage::disk('s3')->delete($image->path_image);
            $image->delete();
            return response()->json(['message' => 'Image deleted successfully'], 200);

    }
}