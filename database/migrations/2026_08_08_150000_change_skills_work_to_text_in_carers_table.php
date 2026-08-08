<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('carers', function (Blueprint $table) {
            $table->text('skills_work')->nullable()->change();
            $table->text('work_experience')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('carers', function (Blueprint $table) {
            $table->string('skills_work')->nullable()->change();
            $table->string('work_experience')->nullable()->change();
        });
    }
};
