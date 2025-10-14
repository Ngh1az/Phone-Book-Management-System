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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('group_id')->nullable()->constrained()->onDelete('set null');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_number');
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('company')->nullable();
            $table->string('job_title')->nullable();
            $table->date('birthday')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->string('avatar')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('user_id');
            $table->index('group_id');
            $table->index('is_favorite');
            $table->index(['first_name', 'last_name']);
            $table->index('phone_number'); // For phone search
            $table->index('email'); // For email search
            $table->index('deleted_at'); // For soft deletes queries
            $table->index(['user_id', 'is_favorite']); // Composite for favorite per user
            $table->index(['user_id', 'created_at']); // For recent contacts
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
