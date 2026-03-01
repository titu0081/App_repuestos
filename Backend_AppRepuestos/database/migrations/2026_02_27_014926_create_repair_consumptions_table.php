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
        Schema::create('repair_consumptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_id')->constrained('repairs');
            $table->foreignId('part_id')->constrained('parts');
            $table->unsignedInteger('quantity');
            $table->foreignId('created_by_user_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repair_consumptions');
    }
};
