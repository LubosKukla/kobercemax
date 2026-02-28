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
        if (! Schema::hasColumn('realizations', 'date_label')) {
            return;
        }

        Schema::table('realizations', function (Blueprint $table) {
            $table->dropColumn('date_label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('realizations', 'date_label')) {
            return;
        }

        Schema::table('realizations', function (Blueprint $table) {
            $table->string('date_label')->nullable();
        });
    }
};
