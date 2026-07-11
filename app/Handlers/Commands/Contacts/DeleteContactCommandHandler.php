<?php

namespace App\Handlers\Commands\Contacts;

use App\Commands\Contacts\DeleteContactCommand;
use App\Models\ContactProfile;

class DeleteContactCommandHandler
{
    public function handle(DeleteContactCommand $command): void
    {
        $contact = ContactProfile::findOrFail($command->contactId);
        $contact->delete();
    }
}
