<x-mail::message>
# Ďakujeme za vašu správu

Ahojte {{ $contact['first_name'] }},  
ďakujeme, že ste nás kontaktovali. Vašu správu sme prijali a čoskoro sa vám ozveme.

<x-mail::panel>
**Vaša správa:**  
{{ $contact['message'] }}
</x-mail::panel>

Ak potrebujete niečo doplniť, odpovedzte na tento email alebo nám zavolajte na **044 / 4323884**.

S pozdravom,  
**Koberce MAX**
</x-mail::message>
