<?php

namespace App\Handlers\Commands\Contacts;

use App\Commands\Contacts\CreateContactCommand;
use App\Data\ContactData;
use App\Models\ContactProfile;

class CreateContactCommandHandler
{
    public function handle(CreateContactCommand $command): ContactData
    {
        $existingContact = ContactProfile::where('user_id', $command->userId)->first();
        if ($existingContact) {
            throw new \RuntimeException('У вас уже есть контактная информация. Вы можете только обновить существующую.');
        }

        $existingPhone = ContactProfile::where('phone', $command->data['phone'])->first();
        if ($existingPhone) {
            throw new \RuntimeException('Этот номер телефона уже используется другим пользователем.');
        }

        $contact = ContactProfile::create(array_merge($command->data, ['user_id' => $command->userId]));

        return ContactData::from($contact);
    }
}
