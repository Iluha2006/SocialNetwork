<?php

namespace App\Handlers\Queries\Contacts;

use App\Models\ContactProfile;
use App\Queries\Contacts\GetContactsQuery;

class GetContactsQueryHandler
{
    public function handle(GetContactsQuery $query): array
    {
        $contacts = ContactProfile::where('user_id', $query->userId)->get();

        return $contacts->toArray();
    }
}
