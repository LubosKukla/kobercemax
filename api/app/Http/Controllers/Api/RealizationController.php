<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Realization;
use Illuminate\Http\JsonResponse;

class RealizationController extends Controller
{
    public function index(): JsonResponse
    {
        $realizations = Realization::query()
            ->where('is_published', true)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'realizations' => $realizations,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $realization = Realization::query()
            ->where('is_published', true)
            ->where('id', $id)
            ->first();

        if (! $realization) {
            return response()->json([
                'message' => 'Realizacia nebola najdena.',
            ], 404);
        }

        return response()->json($realization);
    }
}
