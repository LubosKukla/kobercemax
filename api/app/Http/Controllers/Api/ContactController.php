<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactAdminNotification;
use App\Mail\ContactCustomerConfirmation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:80'],
            'last_name' => ['required', 'string', 'max:80'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40'],
            'message' => ['required', 'string', 'max:4000'],
        ]);

        $contact = [
            'first_name' => trim((string) $validated['first_name']),
            'last_name' => trim((string) $validated['last_name']),
            'email' => trim((string) $validated['email']),
            'phone' => trim((string) ($validated['phone'] ?? '')),
            'message' => trim((string) $validated['message']),
            'submitted_at' => now()->toDateTimeString(),
        ];

        $adminEmail = (string) config('contact.admin_email');

        try {
            Mail::to($adminEmail)->send(new ContactAdminNotification($contact));
            Mail::to($contact['email'])->send(new ContactCustomerConfirmation($contact));

            return response()->json([
                'message' => 'Ďakujeme, správu sme prijali. Čoskoro sa vám ozveme.',
            ], 201);
        } catch (Throwable $exception) {
            Log::error('Contact form mail sending failed.', [
                'error' => $exception->getMessage(),
                'contact_email' => $contact['email'],
            ]);

            return response()->json([
                'message' => 'Správu sa nepodarilo odoslať. Skúste to prosím o chvíľu znova.',
            ], 500);
        }
    }
}
