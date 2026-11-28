# Future work

Proposed changes that are **not** part of the live website. Nothing in this
folder is built or deployed — the site only uses `src/`.

Each sub-folder holds one proposal as a git patch plus preview screenshots.
To adopt one, apply its patch from the repository root and review it:

```bash
git apply future-work/<proposal>/<proposal>.patch
```

| Proposal | What it does |
| --- | --- |
| [`story-redesign/`](story-redesign/) | **Superseded by `story-interactive/`.** Rebuilds `/story` as five bilingual editorial chapters with an arched opening image, a Ḥuḍūr al-Qalb feature band and a closing invitation; adds two owner-replaceable story images. |
| [`privacy-redesign/`](privacy-redesign/) | **Applied 22 Nov 2026.** Rewrites `/privacy` to match how the site works today (Stripe payments, admin access, PDPA rights, retention, contact) with a contents list, data table and promise badges. |
| [`admin-product-details-toggle/`](admin-product-details-toggle/) | **Planned.** An admin on/off switch to show or hide the product Details and The collection lists (currently hidden in code). |
| [`whatsapp-button/`](whatsapp-button/) | **Superseded by `social-dock/`.** Floating WhatsApp chat button with a bilingual ready message. |
| [`social-dock/`](social-dock/) | **Applied 27 Nov 2026.** Floating contact button that opens into WhatsApp, Facebook, Instagram and Threads. |
| [`story-interactive/`](story-interactive/) | **Applied 27 Nov 2026.** Story page layout with words that light up as you read, a tap-to-reveal *maqām* meaning card, and حضور القلب drawn in gold. |
| [`qiblah-watch/`](qiblah-watch/) | **Built.** Watch (prayer times) and Qiblah compass pages opened from the phone button. |
