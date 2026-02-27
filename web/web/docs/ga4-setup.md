# GA4 Setup (Koberce MAX)

Tento projekt posiela eventy do GA4 az po cookie suhlase.

## 1) Overenie streamu

1. V GA4 otvor `Admin -> Data streams -> Web`.
2. Over, ze Measurement ID je `G-B3DJNHWFS8`.
3. V `Reports -> Realtime` otvor web a otestuj:
   - preklik medzi podstrankami (`page_view`)
   - klik na CTA (`cta_click`)
   - klik na telefon (`phone_click`)
   - odoslanie formulara (`generate_lead`)

## 2) Eventy, ktore su uz implementovane

- `page_view`
- `cta_click`
- `phone_click`
- `generate_lead`
- `contact_form_error`

Posielane parametre:

- `cta_click`: `cta_label`, `destination`, `destination_type`, `page_path`
- `phone_click`: `cta_label`, `phone_number`, `destination`, `page_path`
- `generate_lead`: `form_name`, `method`, `page_path`
- `contact_form_error`: `form_name`, `page_path`

## 3) Oznacenie konverzii (Key events)

V GA4:

1. `Admin -> Events`
2. Pri evente `generate_lead` zapni `Mark as key event`.
3. Volitelne (podla biznis cielov) zapni aj:
   - `phone_click`

Odporucanie:

- Primarna konverzia: `generate_lead`
- Sekundarna konverzia: `phone_click`

## 4) Custom definitions (aby boli viditelne parametre v reportoch)

V GA4:

1. `Admin -> Custom definitions -> Create custom dimension`
2. Scope: `Event`
3. Vytvor tieto dimenzie:

- Dimension name: `CTA label` / Event parameter: `cta_label`
- Dimension name: `CTA destination` / Event parameter: `destination`
- Dimension name: `CTA destination type` / Event parameter: `destination_type`
- Dimension name: `Phone number` / Event parameter: `phone_number`
- Dimension name: `Form name` / Event parameter: `form_name`
- Dimension name: `Form method` / Event parameter: `method`
- Dimension name: `Page path (custom)` / Event parameter: `page_path`

Poznamka: nove custom dimenzie sa neplnia spätne, data sa zbieraju od momentu vytvorenia.

## 5) Odporucane reporty (Explorations)

### A) Funnel: navsteva kontaktu -> odoslany formular

Kroky:

1. `page_view` kde `Page path + query string` obsahuje `/kontakt`
2. `generate_lead` kde `form_name = contact_form`

### B) CTA vykonnost

Tabulka:

- Rows: `CTA label`
- Secondary dimension: `CTA destination type`
- Metric: `Event count`
- Filter: `Event name = cta_click`

### C) Telefonaty z webu

Tabulka:

- Rows: `Phone number`
- Metric: `Event count`
- Filter: `Event name = phone_click`

## 6) Co este nastavit mimo eventov

- Prepojit `Search Console` s GA4 (`Admin -> Product links`).
- Ak pouzivas Google Ads, prepojit aj Ads.
- V `Reports snapshot` pridat kartu s `Key events`.

## 7) Kontrola po nasadeni

Po deployi over:

1. Bez cookie suhlasu sa eventy neposielaju.
2. Po suhlase sa posiela `page_view`.
3. Pri odoslani kontaktneho formulara naskoci `generate_lead`.
4. Pri kliku na telefon naskoci `phone_click`.

