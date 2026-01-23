<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('calls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['initiated', 'ringing', 'ongoing', 'ended', 'missed', 'rejected']);
            $table->string('call_type')->default('audio'); // audio или video
            $table->text('sdp_offer')->nullable(); // WebRTC SDP offer
            $table->text('sdp_answer')->nullable(); // WebRTC SDP answer
            $table->text('ice_candidates')->nullable(); // ICE candidates
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration')->nullable(); // в секундах
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('calls');
    }
};