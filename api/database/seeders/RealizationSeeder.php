<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class RealizationSeeder extends Seeder
{
    private const SNAPSHOT_PATH = 'seeders/data/realizations.json';

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $seeded = $this->seedFromSnapshot();
        if ($seeded > 0) {
            $this->command?->info("Replaced realizations table with {$seeded} records from snapshot.");
            return;
        }

        $this->command?->warn('Snapshot file is missing or invalid. Realizations table was not changed.');
    }

    private function seedFromSnapshot(): int
    {
        $snapshotFile = database_path(self::SNAPSHOT_PATH);
        if (! File::exists($snapshotFile)) {
            return 0;
        }

        $decoded = json_decode((string) File::get($snapshotFile), true);
        if (! is_array($decoded) || $decoded === []) {
            return 0;
        }

        $rows = [];
        $now = now()->toDateTimeString();
        $usedSlugs = [];

        foreach ($decoded as $index => $item) {
            if (! is_array($item)) {
                continue;
            }

            $id = max(1, (int) ($item['id'] ?? ($index + 1)));
            $title = trim((string) ($item['title'] ?? ''));
            if ($title === '') {
                continue;
            }

            $gallery = $this->normalizeStringArray($item['gallery'] ?? []);
            $tags = $this->normalizeStringArray($item['tags'] ?? []);
            $date = $this->normalizeDate($item['date'] ?? null);
            $createdAt = $this->normalizeDateTime($item['created_at'] ?? null, $now);
            $updatedAt = $this->normalizeDateTime($item['updated_at'] ?? null, $createdAt);

            $rows[] = [
                'id' => $id,
                'slug' => $this->buildUniqueSlugFromTitle($title, $usedSlugs),
                'title' => $title,
                'date' => $date,
                'excerpt' => $this->normalizeNullableText($item['excerpt'] ?? null),
                'summary' => $this->normalizeNullableText($item['summary'] ?? null),
                'cover_image' => $this->normalizeNullableText($item['cover_image'] ?? null),
                'gallery' => json_encode($gallery, JSON_UNESCAPED_SLASHES),
                'tags' => json_encode($tags, JSON_UNESCAPED_SLASHES),
                'is_published' => (bool) ($item['is_published'] ?? true),
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
            ];
        }

        if ($rows === []) {
            return 0;
        }

        DB::table('realizations')->delete();
        $this->setAutoIncrement(1);
        foreach (array_chunk($rows, 200) as $chunk) {
            DB::table('realizations')->insert($chunk);
        }
        $this->setAutoIncrement(max(array_column($rows, 'id')) + 1);

        return count($rows);
    }

    /**
     * @param  mixed  $value
     * @return list<string>
     */
    private function normalizeStringArray(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(array_map(
            static fn ($item) => trim((string) $item),
            $value
        ), static fn (string $item) => $item !== ''));
    }

    private function normalizeDate(mixed $value): ?string
    {
        $raw = trim((string) ($value ?? ''));
        if ($raw === '') {
            return null;
        }

        $candidate = substr($raw, 0, 10);
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $candidate) === 1) {
            return $candidate;
        }

        return null;
    }

    private function normalizeDateTime(mixed $value, string $fallback): string
    {
        $raw = trim((string) ($value ?? ''));
        if ($raw === '') {
            return $fallback;
        }

        return $raw;
    }

    private function normalizeNullableText(mixed $value): ?string
    {
        $raw = trim((string) ($value ?? ''));
        return $raw === '' ? null : $raw;
    }

    /**
     * @param  array<string, bool>  $usedSlugs
     */
    private function buildUniqueSlugFromTitle(string $title, array &$usedSlugs): string
    {
        $base = Str::slug($title);
        if ($base === '') {
            $base = 'realizacia';
        }

        $candidate = $base;
        $i = 2;
        while (isset($usedSlugs[$candidate])) {
            $candidate = $base.'-'.$i;
            $i++;
        }

        $usedSlugs[$candidate] = true;
        return $candidate;
    }

    private function setAutoIncrement(int $nextId): void
    {
        $next = max(1, $nextId);
        $driver = DB::getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE realizations AUTO_INCREMENT = '.$next);
            return;
        }

        if ($driver === 'sqlite') {
            try {
                DB::statement("UPDATE sqlite_sequence SET seq = ".($next - 1)." WHERE name = 'realizations'");
            } catch (\Throwable $_error) {
                // sqlite_sequence may not exist on all SQLite table definitions.
            }
        }
    }
}
