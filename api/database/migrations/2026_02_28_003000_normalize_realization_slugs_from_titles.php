<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $rows = DB::table('realizations')
            ->select(['id', 'title', 'slug'])
            ->orderBy('id')
            ->get();

        $usedSlugs = [];

        foreach ($rows as $row) {
            $base = Str::slug((string) ($row->title ?? ''));
            if ($base === '') {
                $base = 'realizacia-'.$row->id;
            }

            $candidate = $base;
            $i = 2;

            while (in_array($candidate, $usedSlugs, true)) {
                $candidate = $base.'-'.$i;
                $i++;
            }

            $usedSlugs[] = $candidate;

            if ((string) $row->slug !== $candidate) {
                DB::table('realizations')
                    ->where('id', $row->id)
                    ->update(['slug' => $candidate]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible data normalization.
    }
};
