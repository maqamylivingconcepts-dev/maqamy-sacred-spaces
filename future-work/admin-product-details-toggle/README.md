# Admin switch for product details (planned, not built)

**Status:** saved for later — build when the owner asks.

## Today

The "Details" and "The collection" lists under each product on
`/collections` are hidden by a code switch:

```ts
// src/routes/collections.tsx
const SHOW_PRODUCT_DETAILS = false;
```

Showing them again currently needs a code change.

## Goal

A **Show product details** on/off switch in the admin console so the owner can
show or hide those lists without code.

## Plan

1. **Storage (database change, needs approval).** Add a small `site_settings`
   table (`id text primary key`, `settings jsonb`, `updated_at timestamptz`),
   readable by everyone and writable only by the server, mirroring
   `typography_settings`. Row `id = 'website'`, setting
   `{ "showProductDetails": false }`. Create it through Lovable so the hosted
   backend gets the migration.
2. **Server (owner-only).** In `src/lib/admin.server.ts` add `getSiteSettings`
   and `saveSiteSettings` actions, validated with zod and restricted to the
   owner (`master`), like the typography actions.
3. **Admin UI.** In `src/routes/admin.tsx`, add a switch — either in the
   Products tab ("Show Details and The collection on the collections page") or
   a new "Settings" tab — with Save and a confirmation toast.
4. **Website.** Replace the constant in `src/routes/collections.tsx` with a
   `useSiteSettings()` hook (same pattern as `useSiteAsset`), defaulting to
   hidden if the setting can't be loaded.
5. **Test.** Unit-test the settings schema; check the switch hides and shows
   the lists on desktop and mobile.

## Before switching on

Send the final product details text (English and Malay) so the lists are
accurate when they reappear.
