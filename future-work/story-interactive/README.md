# Interactive story layout

**Applied to the live site on 27 November 2026.** The opening story image is unchanged. Reworks the middle of `/story` (keeps the opening and the
closing "Explore Collections" band) around three interactions, using the v2
story text in English and Malay:

1. **Words light up as you read** — each chapter's words fade from soft grey to
   full colour as you scroll; key phrases turn gold: *bring the heart into
   presence*, *a place to return*, *the presence of the heart*, *From Malaysia,
   for the world* (and the Malay equivalents).
2. **Tap the name** — *maqām* in chapter II is underlined in gold; tapping (or
   hovering on desktop) opens a small card: مقام · maqām · "a place to return".
   The card stays on screen on phones and closes on tap-outside or Esc.
3. **Ḥuḍūr al-Qalb drawn** — chapter IV is a dark band where حضور القلب is
   drawn stroke by stroke in gold as you scroll, then filled.

Chapters are marked I–V in gold italic numerals. Visitors with "reduce motion"
turned on see the text fully shown and the calligraphy already drawn.

Previews: `preview-mobile.png` (reading · name card · drawing · drawn),
`preview-desktop.png`, `preview-meaning-card.png`.

Checked: no errors, no sideways scrolling on phone or desktop, Malay works.

## Notes

- Replaces the current paragraph highlight box; the "Highlighted brand story"
  typography size in Admin still applies to the story text.
- Independent of `../story-redesign/` (an older layout proposal); pick one.

## Apply

```bash
git apply future-work/story-interactive/story-interactive.patch
```
