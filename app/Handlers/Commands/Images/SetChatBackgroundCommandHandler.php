<?php

namespace App\Handlers\Commands\Images;

use App\Commands\Images\SetChatBackgroundCommand;
use App\Models\ImagesBacround;
use Illuminate\Support\Facades\Storage;

class SetChatBackgroundCommandHandler
{
    public function handle(SetChatBackgroundCommand $command): array
    {
        $user = $command->request->user();
        $imageUrl = null;

        if ($command->request->hasFile('chat_background')) {
            $image = $command->request->file('chat_background');
            $filename = 'chat_bg_' . $user->id . '_' . time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs("chat-backgrounds/{$user->id}", $filename, 's3');
            $imageUrl = config('filesystems.disks.s3.url') . '/' . env('AWS_BUCKET') . '/' . $path;
        }

        ImagesBacround::updateOrCreate(
            ['user_id' => $user->id],
            ['path_image' => $imageUrl]
        );

        return [
            'success' => true,
            'path_image' => $imageUrl,
            'message' => 'Фон чата успешно установлен',
        ];
    }
}
