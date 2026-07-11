<?php

namespace App\Handlers\Commands\Contacts;

use App\Commands\Contacts\UpdateContactCommand;
use App\Data\ContactData;
use App\Models\ContactProfile;

class UpdateContactCommandHandler
{
    public function handle(UpdateContactCommand $command): ContactData
    {
        $contact = ContactProfile::findOrFail($command->contactId);
        $contact->update($command->data);

        return ContactData::from($contact);
    }
}
