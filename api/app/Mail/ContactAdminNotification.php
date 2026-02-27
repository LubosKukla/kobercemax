<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactAdminNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $contact)
    {
    }

    public function envelope(): Envelope
    {
        $fullName = trim($this->contact['first_name'].' '.$this->contact['last_name']);

        return new Envelope(
            subject: 'Nový dopyt z webu: '.$fullName,
            replyTo: [
                new Address($this->contact['email'], $fullName),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact.admin',
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
