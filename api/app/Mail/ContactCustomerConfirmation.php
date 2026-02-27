<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactCustomerConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $contact)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Potvrdenie prijatia správy | Koberce MAX',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact.customer',
            with: [
                'contact' => $this->contact,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
