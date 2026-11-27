# WhatsApp chat button (proposal)

Not live yet. A round floating button, bottom-right on every customer page
(hidden on admin), that opens WhatsApp with a ready message in the visitor's
language:

- EN: "Hi MAQAMY, I'd like to know more about your collections."
- BM: "Hai MAQAMY, saya ingin tahu lebih lanjut tentang koleksi anda."

Previews (left: WhatsApp green, right: MAQAMY forest green with gold icon):
`preview-mobile.png`, `preview-desktop.png`.

## Before going live

1. Set `WHATSAPP_NUMBER` in `src/components/maqamy/whatsapp-button.tsx`
   (digits only, with country code, e.g. `60123456789`). The patch has a
   dummy `60000000000`.
2. Choose the colour: `tone = "green"` or `tone = "brand"` (patch defaults to brand).

## Apply

```bash
git apply future-work/whatsapp-button/whatsapp-button.patch
```
