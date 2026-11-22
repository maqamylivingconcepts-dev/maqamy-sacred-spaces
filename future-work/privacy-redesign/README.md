# Privacy page redesign

**Applied to the live site on 22 November 2026** with contact email
maqamylivingconcepts@gmail.com and softened retention/partner wording.
Still to add: registered company name and SSM number (`COMPANY_NAME` in
`src/routes/privacy.tsx`).

 Previews: `preview-desktop.png`,
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

A softer, brand-styled layout rather than a document:

1. **Welcome** — "Your privacy, *held with care.*", a short warm intro, the
   last-updated date and three icon promises (never sold · cards stay with
   Stripe · yours to remove).
2. **What we collect** — four icon cards: account, orders, payment, device.
3. **How we use it** — "To bring your space home." with a checklist.
4. **Who can see it** — "A small, trusted circle." five icon tiles.
5. **Keeping it safe** — dark band: how it's protected and how long it's kept.
6. **Your rights** — four gold-edged tiles under the PDPA: see, correct, delete, say no.
7. **Contact** — centred card with the privacy email and company details.

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
