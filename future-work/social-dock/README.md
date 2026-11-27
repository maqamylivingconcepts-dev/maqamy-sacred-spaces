# Social contact button

**Applied to the live site on 27 November 2026** with the real WhatsApp,
Facebook, Instagram and Threads links. Replaces the WhatsApp-only idea in `../whatsapp-button/`.

A round MAQAMY-style button (forest green, gold phone icon) at the bottom-right
of every customer page (hidden on admin). Tapping it fans out four icon-only
links — **WhatsApp, Facebook, Instagram, Threads** — and turns into an ✕
(names are kept for screen readers and as hover tooltips).
Tapping outside or pressing Esc closes it. WhatsApp opens with a ready message
in the visitor's language.

Previews: `preview-mobile.png` (closed / open), `preview-desktop-open.png`.

## Before going live

Fill in at the top of `src/components/maqamy/social-dock.tsx` (the patch has
dummy values):

- `WHATSAPP_NUMBER` — set to `60186693631` (018-669 3631)
- `FACEBOOK_URL` — set to the Maqamy Living Concepts page
- `INSTAGRAM_URL` — set to `instagram.com/maqamylivingconcepts`
- `THREADS_URL` — e.g. `https://www.threads.net/@maqamy`

The Threads icon is an @ sign stand-in; swap for the official Threads mark if preferred.

## Apply

```bash
git apply future-work/social-dock/social-dock.patch
```
