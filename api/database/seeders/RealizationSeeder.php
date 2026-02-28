<?php

namespace Database\Seeders;

use App\Models\Realization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class RealizationSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $jsonPath = base_path('../web/web/src/data/realizations.json');

        if (! is_file($jsonPath)) {
            $this->command?->warn("Realizations JSON not found at: {$jsonPath}");
            return;
        }

        $raw = file_get_contents($jsonPath);
        if ($raw === false) {
            $this->command?->warn('Unable to read realizations.json');
            return;
        }

        $payload = json_decode($raw, true);
        if (! is_array($payload)) {
            $this->command?->warn('Invalid JSON in realizations.json');
            return;
        }

        $items = Arr::get($payload, 'realizations', []);
        if (! is_array($items)) {
            $this->command?->warn('Invalid realizations collection in JSON');
            return;
        }

        $usedSlugs = [];

        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }

            $title = trim((string) Arr::get($item, 'title', ''));
            $slug = $this->buildUniqueSlugFromTitle($title, $usedSlugs);

            if ($title === '' || $slug === '') {
                continue;
            }

            $gallery = $this->normalizeArray(Arr::get($item, 'gallery', []));
            $coverImage = trim((string) Arr::get($item, 'coverImage', ''));
            if ($coverImage === '' && count($gallery) > 0) {
                $coverImage = $gallery[0];
            }
            if ($coverImage !== '' && ! in_array($coverImage, $gallery, true)) {
                array_unshift($gallery, $coverImage);
            }
            if ($coverImage !== '' && in_array($coverImage, $gallery, true)) {
                $gallery = array_values(array_filter($gallery, static fn (string $img) => $img !== $coverImage));
                array_unshift($gallery, $coverImage);
            }

            Realization::updateOrCreate(['title' => $title], [
                'slug' => $slug,
                'title' => $title,
                'date' => Arr::get($item, 'date'),
                'excerpt' => Arr::get($item, 'excerpt'),
                'summary' => Arr::get($item, 'summary'),
                'cover_image' => $coverImage !== '' ? $coverImage : null,
                'gallery' => $gallery,
                'tags' => $this->normalizeArray(Arr::get($item, 'tags', [])),
                'is_published' => true,
            ]);
        }
    }

    /**
     * @param  mixed  $value
     * @return list<string>
     */
    private function normalizeArray(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(array_map(
            static fn ($item) => trim((string) $item),
            $value
        ), static fn ($item) => $item !== ''));
    }

    /**
     * @param  list<string>  $usedSlugs
     */
    private function buildUniqueSlugFromTitle(string $title, array &$usedSlugs): string
    {
        $base = Str::slug($title);
        if ($base === '') {
            return '';
        }

        $candidate = $base;
        $i = 2;

        while (
            in_array($candidate, $usedSlugs, true) ||
            Realization::query()
                ->where('slug', $candidate)
                ->where('title', '!=', $title)
                ->exists()
        ) {
            $candidate = "{$base}-{$i}";
            $i++;
        }

        $usedSlugs[] = $candidate;

        return $candidate;
    }
}
