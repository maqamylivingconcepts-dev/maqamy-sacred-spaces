# Story page redesign (proposal)

Not applied to the live site. Previews use placeholder gradients where the real
photos would load.

- `preview-desktop.png`, `preview-mobile.png` — the redesigned page
- `story-redesign.patch` — the code change

## What changes

1. **Opening** — large "The MAQAMY *Story*" title and tagline beside the story
   photo in an arch-shaped frame with a gold outline; "Begin reading" link.
2. **Chapter I** — the first brand-story paragraph, centred in large type.
3. **Chapters II & III** — numbered headings beside a new craft image.
4. **Chapter IV** — dark Ḥuḍūr al-Qalb band with the Arabic phrase حضور القلب.
5. **Chapter V** — the closing paragraph, then the "Explore Noor & Janna" invitation.

The paragraph being read stays at full strength and the others fade slightly.

## Files touched by the patch

- `src/routes/story.tsx` — new layout
- `src/lib/brand-story.ts` — bilingual chapter titles (please proofread the Malay)
- `src/lib/site-assets.ts` — two new Assets-tab slots: craft image, philosophy backdrop
- `src/lib/admin.server.ts` — allows saving those two slots

## Notes before adopting

- The main story photo is cropped to fill the arch (previously shown uncropped).
- The two new image slots default to the Janna photo and the home desert photo
  until the owner replaces them in Admin → Assets.

## Apply

```bash
git apply future-work/story-redesign/story-redesign.patch
```
