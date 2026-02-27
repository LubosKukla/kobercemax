<x-mail::message>
# Nový dopyt z kontaktného formulára

Prišiel nový dopyt z webu kobercemax.

**Meno:** {{ $contact['first_name'] }} {{ $contact['last_name'] }}  
**Email:** {{ $contact['email'] }}  
**Telefón:** {{ $contact['phone'] !== '' ? $contact['phone'] : 'neuvedený' }}  
**Čas odoslania:** {{ $contact['submitted_at'] }}

<x-mail::panel>
{{ $contact['message'] }}
</x-mail::panel>

Na tento email môžete odpovedať priamo zákazníkovi.

{{ config('app.name') }}
</x-mail::message>
