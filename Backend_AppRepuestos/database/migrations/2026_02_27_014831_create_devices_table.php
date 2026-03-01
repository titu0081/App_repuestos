<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('serial_number');
            $table->string('model');
            $table->timestamp('received_at');
            $table->foreignId('received_by_user_id')->constrained('users');
            $table->foreignId('client_id')->constrained('clients');
            $table->text('reported_issue');
            $table->string('status'); // received/repairing/repaired/packed/shipped
            $table->timestamps();
            $table->softDeletes();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
