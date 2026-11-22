# Privacy page redesign (proposal)

Not applied to the live site. Previews: `preview-desktop.png`,
`preview-mobile.png`, `preview-desktop-malay.png`.

## Why

The current page no longer matches how the site works:

- It talks about "purchase consultations" — customers now pay online through Stripe.
- It never mentions Stripe, or that card numbers never reach MAQAMY.
- It says only the customer can see their data — MAQAMY's admin team can too.
- It mentions "messages shared", but the site has no messaging form.
- It has no contact for privacy requests, no mention of Malaysia's PDPA 2010,
  no retention period and no "last updated" date.

## What the new page has

1. Plain-language heading, intro and **last updated** date.
2. Three promise badges: never sold · card details stay with Stripe · delete any time.
3. "On this page" contents list (sticky on desktop).
4. Numbered sections: Who we are · What we collect (table) · How we use it ·
   Who can see it · How long we keep it · Your rights (PDPA, 21-day reply) ·
   How we protect it · Changes to this policy.
5. Dark "Questions or requests?" contact box.

Everything is in English and Malay. The Copyright box moves out (it isn't a
privacy topic; the footer already shows © 2026).

## Fill in before adopting

At the top of `privacy-redesign.patch` (in `src/routes/privacy.tsx`):

- `CONTACT_EMAIL` — the email for privacy requests
- `COMPANY_DETAILS` — registered company name and SSM number
- `LAST_UPDATED` — the date the policy takes effect

Please also confirm the retention period (seven years for orders and invoices)
and that delivery/installation partners receive only name, phone and address.
This is a plain-language draft, not legal advice.

## Apply

```bash
git apply future-work/privacy-redesign/privacy-redesign.patch
```
