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
        $columnsToDrop = [];

        foreach (['legacy_id', 'category', 'image_upload_folder', 'instagram_code', 'source_url'] as $column) {
            if (Schema::hasColumn('realizations', $column)) {
                $columnsToDrop[] = $column;
            }
        }

        if ($columnsToDrop === []) {
            return;
        }

        Schema::table('realizations', function (Blueprint $table) use ($columnsToDrop) {
            if (in_array('legacy_id', $columnsToDrop, true)) {
                try {
                    $table->dropUnique('realizations_legacy_id_unique');
                } catch (\Throwable $e) {
                    // Ignore missing index differences across environments.
                }
            }

            $table->dropColumn($columnsToDrop);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('realizations', function (Blueprint $table) {
            if (! Schema::hasColumn('realizations', 'legacy_id')) {
                $table->unsignedBigInteger('legacy_id')->nullable()->unique();
            }
            if (! Schema::hasColumn('realizations', 'category')) {
                $table->string('category')->nullable();
            }
            if (! Schema::hasColumn('realizations', 'image_upload_folder')) {
                $table->string('image_upload_folder')->nullable();
            }
            if (! Schema::hasColumn('realizations', 'instagram_code')) {
                $table->string('instagram_code')->nullable();
            }
            if (! Schema::hasColumn('realizations', 'source_url')) {
                $table->string('source_url')->nullable();
            }
        });
    }
};
