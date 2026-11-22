/**
 * Banner captions have a title and an optional subtitle, stored together in
 * the existing `banners.title` column as "Title | Subtitle" so no schema
 * change is needed. Older single-line titles are shown as the title only.
 */
const SEPARATOR = " | ";
export const BANNER_TITLE_MAX = 120;

export function splitBannerTitle(value: string | null | undefined): { title: string; subtitle: string } {
  const text = (value ?? "").trim();
  const at = text.indexOf("|");
  if (at < 0) return { title: text, subtitle: "" };
  return { title: text.slice(0, at).trim(), subtitle: text.slice(at + 1).trim() };
}

export function joinBannerTitle(title: string, subtitle: string): string {
  const t = title.replace(/\|/g, "").trim();
  const s = subtitle.replace(/\|/g, "").trim();
  return s ? `${t}${SEPARATOR}${s}` : t;
}
