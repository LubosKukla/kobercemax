<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RealizationSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $count = DB::table('realizations')->count();
        if ($count === 0) {
            $this->command?->warn('Realizations table is empty. Nothing to reorder.');
            return;
        }

        $ordered = DB::table('realizations')
            ->select('id')
            ->orderByRaw('date IS NULL DESC')
            ->orderBy('date')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        if ($ordered->isEmpty()) {
            $this->command?->warn('No realizations found for reordering.');
            return;
        }

        $maxId = (int) DB::table('realizations')->max('id');
        $offset = $maxId + 1000;

        // Step 1: move IDs out of the target range to avoid PK collisions.
        foreach ($ordered as $row) {
            DB::table('realizations')
                ->where('id', (int) $row->id)
                ->update(['id' => (int) $row->id + $offset]);
        }

        // Step 2: assign new sequential IDs by date order (oldest -> newest).
        $newId = 1;
        foreach ($ordered as $row) {
            DB::table('realizations')
                ->where('id', (int) $row->id + $offset)
                ->update(['id' => $newId]);
            $newId++;
        }

        DB::statement('ALTER TABLE realizations AUTO_INCREMENT = '.($ordered->count() + 1));

        $this->command?->info("Reordered {$ordered->count()} realizations by date (oldest ID 1 -> newest highest ID).");
    }
}
