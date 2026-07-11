<?php

namespace App\Commands\Privacy;

class UpdatePrivacySettingsCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly array $settings,
    ) {}
}
