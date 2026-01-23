<?php

namespace App\Console\Commands;
use File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ConsoleComands extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'go';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
       $file= File::get(public_path("index.php"));
       Storage::disk("s3")->put("files/file.php",$file);
    }
}
