<?php

namespace App\Console\Commands;
use File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\LazyCollection;

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
      $coll= collect([1,2,3,4,5,6,]);

      $coll->each(function ($value, $key) {
        $this->info($key , $value);
      });

      $cel= new LazyCollection();
    }
}
