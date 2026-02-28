<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);
        $remember = (bool) ($credentials['remember'] ?? false);

        if ($remember) {
            // Keep remember-me login for 30 days.
            Auth::guard('web')->setRememberDuration(60 * 24 * 30);
        }

        if (! Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ], $remember)) {
            return response()->json([
                'message' => 'Nespravny email alebo heslo.',
            ], 422);
        }

        if (! $this->isAllowedAdmin()) {
            Auth::logout();

            return response()->json([
                'message' => 'Tento ucet nema pristup do administracie.',
            ], 403);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Prihlasenie prebehlo uspesne.',
            'user' => $this->serializeUser(),
        ]);
    }

    public function me(): JsonResponse
    {
        if (! Auth::check()) {
            return response()->json([
                'message' => 'Neautorizovany pristup.',
            ], 401);
        }

        if (! $this->isAllowedAdmin()) {
            Auth::logout();

            return response()->json([
                'message' => 'Tento ucet nema pristup do administracie.',
            ], 403);
        }

        return response()->json([
            'user' => $this->serializeUser(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Boli ste odhlaseny.',
        ]);
    }

    private function isAllowedAdmin(): bool
    {
        $user = Auth::user();
        if (! $user?->email) {
            return false;
        }

        $allowedRaw = (string) env('ADMIN_EMAILS', '');
        if (trim($allowedRaw) === '') {
            $allowedRaw = (string) env('ADMIN_EMAIL', '');
        }
        if (trim($allowedRaw) === '') {
            $allowedRaw = 'admin@kobercemax.sk';
        }

        $allowed = array_values(array_filter(array_map(
            static fn (string $email) => Str::lower(trim($email)),
            explode(',', $allowedRaw)
        ), static fn (string $email) => $email !== ''));

        return in_array(Str::lower($user->email), $allowed, true);
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeUser(): array
    {
        $user = Auth::user();

        return [
            'id' => $user?->id,
            'name' => $user?->name,
            'email' => $user?->email,
        ];
    }
}
