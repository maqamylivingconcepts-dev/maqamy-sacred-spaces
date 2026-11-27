# MAQAMY brand story versions

| Version | Status | Record |
| --- | --- | --- |
| v1 | Retired 27 Nov 2026 | [v1.md](v1.md) |
| v2 | **Live** from 27 Nov 2026 | [v2.md](v2.md) |

Both versions live in `src/lib/brand-story.ts`. To switch the story page back
to v1, change the last line to:

```ts
export const brandStory = brandStoryV1;
```

(and restore the v1 label "Malaysian design house" in `src/routes/story.tsx`).
