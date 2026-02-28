<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Realization;
use Illuminate\Support\Facades\File;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class RealizationAdminController extends Controller
{
    private const MIN_BYTES_TO_OPTIMIZE = 40 * 1024;
    private const MAX_LONG_EDGE = 2400;

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('q', ''));
        $perPage = (int) $request->query('per_page', 20);
        $perPage = $perPage > 0 ? min($perPage, 100) : 20;

        $items = Realization::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json($items);
    }

    public function show(Realization $realization): JsonResponse
    {
        return response()->json($realization);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatePayload($request);
        $item = Realization::create($data);

        return response()->json($item, 201);
    }

    public function update(Request $request, Realization $realization): JsonResponse
    {
        $data = $this->validatePayload($request, $realization->id);
        $realization->update($data);

        return response()->json($realization->fresh());
    }

    public function togglePublished(Realization $realization): JsonResponse
    {
        $realization->is_published = ! $realization->is_published;
        $realization->save();

        return response()->json($realization->fresh());
    }

    public function destroy(Realization $realization): JsonResponse
    {
        $realization->delete();

        return response()->json([
            'message' => 'Realizacia bola vymazana.',
        ]);
    }

    public function uploadGalleryImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'max:10240'],
            'slug' => ['nullable', 'string', 'max:255'],
            'realization_id' => ['nullable', 'integer', 'exists:realizations,id'],
        ]);

        $slug = Str::slug((string) ($data['slug'] ?? ''));
        if ($slug === '') {
            $slug = 'realizacia';
        }

        $relativeDir = 'img/realizations/uploads/'.now()->format('Y/m')."/{$slug}";
        $targetDir = base_path("../web/web/public/{$relativeDir}");
        File::ensureDirectoryExists($targetDir);

        $file = $request->file('image');
        $extension = strtolower((string) $file->getClientOriginalExtension());
        if ($extension === '') {
            $extension = 'jpg';
        }

        $fileName = Str::uuid()->toString().'.'.$extension;
        $file->move($targetDir, $fileName);
        $storedFilePath = $targetDir.DIRECTORY_SEPARATOR.$fileName;
        $this->optimizeUploadedImage($storedFilePath, $extension);

        $path = '/'.$relativeDir.'/'.$fileName;
        $gallery = null;
        $coverImage = null;

        if (! empty($data['realization_id'])) {
            $realization = Realization::query()->findOrFail((int) $data['realization_id']);
            $gallery = $this->normalizeArray($realization->gallery ?? []);
            $gallery = array_values(array_filter($gallery, static fn (string $item) => $item !== $path));
            array_unshift($gallery, $path);
            [$gallery, $coverImage] = $this->syncCoverAndGallery($gallery, $realization->cover_image);

            $realization->gallery = $gallery;
            $realization->cover_image = $coverImage;
            $realization->save();
            $gallery = $realization->gallery;
            $coverImage = $realization->cover_image;
        }

        return response()->json([
            'path' => $path,
            'gallery' => $gallery,
            'cover_image' => $coverImage,
        ], 201);
    }

    public function removeGalleryImage(Request $request, Realization $realization): JsonResponse
    {
        $data = $request->validate([
            'image' => ['required', 'string', 'max:2048'],
            'delete_file' => ['nullable', 'boolean'],
        ]);

        $targetImage = trim((string) $data['image']);
        $gallery = $this->normalizeArray($realization->gallery ?? []);
        $updated = array_values(array_filter($gallery, static fn (string $item) => $item !== $targetImage));

        if (count($updated) === count($gallery)) {
            return response()->json([
                'message' => 'Obrazok sa v galerii nenasiel.',
            ], 404);
        }

        [$updated, $coverImage] = $this->syncCoverAndGallery($updated, $realization->cover_image === $targetImage ? null : $realization->cover_image);
        $realization->gallery = $updated;
        $realization->cover_image = $coverImage;
        $realization->save();

        if (($data['delete_file'] ?? true) === true) {
            $this->deleteManagedGalleryFile($targetImage);
        }

        return response()->json([
            'message' => 'Obrazok bol odstraneny.',
            'gallery' => $updated,
            'cover_image' => $coverImage,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('realizations', 'slug')->ignore($ignoreId),
            ],
            'date' => ['nullable', 'date'],
            'excerpt' => ['nullable', 'string'],
            'summary' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['string', 'max:2048'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $slug = trim((string) ($data['slug'] ?? ''));
        if ($slug === '') {
            $slug = Str::slug((string) $data['title']);
        }
        $data['slug'] = $this->ensureUniqueSlug($slug, $ignoreId);

        [$gallery, $coverImage] = $this->syncCoverAndGallery(
            $data['gallery'] ?? [],
            $data['cover_image'] ?? null
        );
        $data['gallery'] = $gallery;
        $data['cover_image'] = $coverImage;
        $data['tags'] = $this->normalizeArray($data['tags'] ?? []);
        $data['is_published'] = (bool) ($data['is_published'] ?? false);

        return $data;
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

    private function ensureUniqueSlug(string $baseSlug, ?int $ignoreId = null): string
    {
        $slug = Str::slug($baseSlug);
        if ($slug === '') {
            $slug = 'realizacia';
        }

        $candidate = $slug;
        $i = 2;

        while (
            Realization::query()
                ->where('slug', $candidate)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $candidate = "{$slug}-{$i}";
            $i++;
        }

        return $candidate;
    }

    /**
     * @param  mixed  $galleryValue
     * @return array{0:list<string>,1:?string}
     */
    private function syncCoverAndGallery(mixed $galleryValue, mixed $coverValue): array
    {
        $gallery = array_values(array_unique($this->normalizeArray($galleryValue)));
        $coverImage = trim((string) ($coverValue ?? ''));

        if ($coverImage === '' && count($gallery) > 0) {
            $coverImage = $gallery[0];
        }

        if ($coverImage !== '' && ! in_array($coverImage, $gallery, true)) {
            array_unshift($gallery, $coverImage);
        }

        if ($coverImage !== '' && in_array($coverImage, $gallery, true)) {
            $gallery = array_values(array_filter(
                $gallery,
                static fn (string $image) => $image !== $coverImage
            ));
            array_unshift($gallery, $coverImage);
        }

        if ($coverImage === '' && count($gallery) === 0) {
            return [[], null];
        }

        if ($coverImage === '' && count($gallery) > 0) {
            $coverImage = $gallery[0];
        }

        return [$gallery, $coverImage];
    }

    private function deleteManagedGalleryFile(string $path): void
    {
        $normalized = trim($path);
        if (! str_starts_with($normalized, '/img/realizations/uploads/')) {
            return;
        }

        $fullPath = base_path('../web/web/public'.$normalized);
        if (is_file($fullPath)) {
            @unlink($fullPath);
        }
    }

    private function optimizeUploadedImage(string $fullPath, string $extension): void
    {
        if (! is_file($fullPath)) {
            return;
        }

        $beforeSize = @filesize($fullPath);
        if (! is_int($beforeSize) || $beforeSize < self::MIN_BYTES_TO_OPTIMIZE) {
            return;
        }

        $ext = strtolower(trim($extension));
        $size = @getimagesize($fullPath);
        $origWidth = is_array($size) ? (int) ($size[0] ?? 0) : 0;
        $origHeight = is_array($size) ? (int) ($size[1] ?? 0) : 0;
        $image = null;

        if (in_array($ext, ['jpg', 'jpeg'], true)) {
            if (! function_exists('imagecreatefromjpeg')) {
                return;
            }

            $image = @imagecreatefromjpeg($fullPath);
            if (! $image) {
                return;
            }

            $image = $this->applyJpegExifOrientation($image, $fullPath);
            $resized = $this->resizeImageResourceIfNeeded($image, false);
            $wasResized = $resized['resized'];
            $image = $resized['image'];

            $tmpPath = $fullPath.'.tmp';
            imageinterlace($image, true);
            @imagejpeg($image, $tmpPath, 80);
            imagedestroy($image);
            $this->replaceFileWhenOptimized($fullPath, $tmpPath, $beforeSize, $wasResized);
            return;
        }

        if ($ext === 'png') {
            if (! function_exists('imagecreatefrompng')) {
                return;
            }

            $image = @imagecreatefrompng($fullPath);
            if (! $image) {
                return;
            }

            $resized = $this->resizeImageResourceIfNeeded($image, true);
            $wasResized = $resized['resized'];
            $image = $resized['image'];

            $tmpPath = $fullPath.'.tmp';
            imagealphablending($image, false);
            imagesavealpha($image, true);
            @imagepng($image, $tmpPath, 8);
            imagedestroy($image);
            $this->replaceFileWhenOptimized($fullPath, $tmpPath, $beforeSize, $wasResized);
            return;
        }

        if ($ext === 'webp') {
            if (! function_exists('imagecreatefromwebp') || ! function_exists('imagewebp')) {
                return;
            }

            $image = @imagecreatefromwebp($fullPath);
            if (! $image) {
                return;
            }

            $resized = $this->resizeImageResourceIfNeeded($image, true);
            $wasResized = $resized['resized'];
            $image = $resized['image'];

            $tmpPath = $fullPath.'.tmp';
            @imagewebp($image, $tmpPath, 80);
            imagedestroy($image);
            $this->replaceFileWhenOptimized($fullPath, $tmpPath, $beforeSize, $wasResized);
            return;
        }

        if ($ext === 'avif') {
            if (! function_exists('imagecreatefromavif') || ! function_exists('imageavif')) {
                return;
            }

            $image = @imagecreatefromavif($fullPath);
            if (! $image) {
                return;
            }

            $resized = $this->resizeImageResourceIfNeeded($image, true);
            $wasResized = $resized['resized'];
            $image = $resized['image'];

            $tmpPath = $fullPath.'.tmp';
            @imageavif($image, $tmpPath, 50);
            imagedestroy($image);
            $this->replaceFileWhenOptimized($fullPath, $tmpPath, $beforeSize, $wasResized);
            return;
        }

        if (
            $origWidth > 0
            && $origHeight > 0
            && max($origWidth, $origHeight) > self::MAX_LONG_EDGE
        ) {
            // Unsupported format with large dimensions; keep original to avoid corruption.
            return;
        }
    }

    /**
     * @param  \GdImage|resource  $image
     * @return \GdImage|resource
     */
    private function applyJpegExifOrientation(mixed $image, string $fullPath): mixed
    {
        if (! function_exists('exif_read_data')) {
            return $image;
        }

        $exif = @exif_read_data($fullPath);
        $orientation = (int) ($exif['Orientation'] ?? 1);
        $angle = match ($orientation) {
            3 => 180,
            6 => -90,
            8 => 90,
            default => null,
        };

        if ($angle === null) {
            return $image;
        }

        $rotated = imagerotate($image, $angle, 0);
        if (! $rotated) {
            return $image;
        }

        imagedestroy($image);

        return $rotated;
    }

    /**
     * @param  \GdImage|resource  $image
     * @return array{image:mixed,resized:bool}
     */
    private function resizeImageResourceIfNeeded(mixed $image, bool $preserveAlpha): array
    {
        $srcWidth = imagesx($image);
        $srcHeight = imagesy($image);
        $longEdge = max($srcWidth, $srcHeight);

        if ($longEdge <= self::MAX_LONG_EDGE) {
            return ['image' => $image, 'resized' => false];
        }

        $scale = self::MAX_LONG_EDGE / $longEdge;
        $targetWidth = max(1, (int) round($srcWidth * $scale));
        $targetHeight = max(1, (int) round($srcHeight * $scale));

        $canvas = imagecreatetruecolor($targetWidth, $targetHeight);
        if (! $canvas) {
            return ['image' => $image, 'resized' => false];
        }

        if ($preserveAlpha) {
            imagealphablending($canvas, false);
            imagesavealpha($canvas, true);
            $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
            imagefilledrectangle($canvas, 0, 0, $targetWidth, $targetHeight, $transparent);
        }

        imagecopyresampled(
            $canvas,
            $image,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $srcWidth,
            $srcHeight
        );

        imagedestroy($image);

        return ['image' => $canvas, 'resized' => true];
    }

    private function replaceFileWhenOptimized(
        string $fullPath,
        string $tmpPath,
        int $beforeSize,
        bool $wasResized
    ): void {
        if (! is_file($tmpPath)) {
            return;
        }

        $afterSize = @filesize($tmpPath);
        if (! is_int($afterSize)) {
            @unlink($tmpPath);
            return;
        }

        if ($wasResized || $afterSize < ($beforeSize - 1024)) {
            @rename($tmpPath, $fullPath);
            return;
        }

        @unlink($tmpPath);
    }
}
