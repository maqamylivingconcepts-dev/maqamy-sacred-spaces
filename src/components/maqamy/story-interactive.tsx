import { useEffect, useRef, useState, type ReactNode } from "react";

/** True when the visitor has asked their device for reduced motion. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** 0 → 1 as the element travels from the lower part of the screen to the upper part. */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      const p = (start - r.top) / (start - end + r.height * 0.6);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return { ref, progress };
}

type Token = { text: string; gold: boolean; key?: string };

function tokenize(text: string, goldPhrases: string[], specials: string[]): Token[] {
  const ranges = goldPhrases.flatMap((p) => { const i = text.indexOf(p); return i < 0 ? [] : [[i, i + p.length] as const]; });
  const out: Token[] = [];
  const re = /\S+\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const at = m.index;
    const word = m[0];
    const special = specials.find((s) => word.trim().replace(/[—,.:;]+$/, "") === s);
    out.push({ text: word, gold: ranges.some(([a, b]) => at >= a && at < b), ...(special ? { key: special } : {}) });
  }
  return out;
}

/**
 * Idea 1 — words light up as you read; key phrases turn gold.
 * Words in `specials` are handed to `renderSpecial` (used for the maqām card).
 */
export function RevealText({ text, gold = [], specials = [], renderSpecial, className = "" }: {
  text: string;
  gold?: string[];
  specials?: string[];
  renderSpecial?: (word: string, lit: boolean) => ReactNode;
  className?: string;
}) {
  const { ref, progress } = useScrollProgress<HTMLParagraphElement>();
  const reduced = useReducedMotion();
  const tokens = tokenize(text, gold, specials);
  const litCount = reduced ? tokens.length : Math.round(progress * tokens.length);
  return (
    <p ref={ref} className={className}>
      {tokens.map((tk, i) => {
        const lit = i < litCount;
        const colour = !lit ? "text-current opacity-25" : tk.gold ? "text-brand-gold opacity-100" : "opacity-100";
        if (tk.key && renderSpecial) {
          const trailing = tk.text.slice(tk.text.indexOf(tk.key) + tk.key.length);
          return <span key={i} className={`transition-opacity duration-300 ${lit ? "opacity-100" : "opacity-25"}`}>{renderSpecial(tk.key, lit)}{trailing}</span>;
        }
        return <span key={i} className={`transition-[opacity,color] duration-300 ${colour}`}>{tk.text}</span>;
      })}
    </p>
  );
}

/** Idea 2 — tap (or hover) the name to see its meaning. */
export function MeaningWord({ word, arabic, meaning, label }: { word: string; arabic: string; meaning: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const root = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  // Keep the card on screen with a 16px margin, wherever the word wraps.
  useEffect(() => {
    if (!open || !card.current) { setShift(0); return; }
    const r = card.current.getBoundingClientRect();
    const left = r.left - shift;
    const right = r.right - shift;
    const margin = 16;
    setShift(left < margin ? margin - left : right > window.innerWidth - margin ? window.innerWidth - margin - right : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <span
      ref={root}
      className="relative inline-block"
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setOpen(false); }}
    >
      <button type="button" aria-expanded={open} aria-label={label} onClick={(e) => { const mouse = (e.nativeEvent as PointerEvent).pointerType === "mouse"; setOpen((v) => (mouse ? true : !v)); }} className="italic text-brand-gold underline decoration-brand-gold/60 decoration-1 underline-offset-[6px]">
        {word}
      </button>
      <span ref={card} role="tooltip" style={{ marginLeft: shift }} className={`absolute bottom-full left-1/2 z-20 mb-3 w-56 -translate-x-1/2 border border-brand-gold/40 bg-brand-forest px-5 py-4 text-center text-brand-cream shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)] transition-all duration-300 ${open ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"}`}>
        <span lang="ar" dir="rtl" className="block font-display text-3xl leading-tight text-brand-gold-soft">{arabic}</span>
        <span className="mt-1 block text-xs italic text-brand-cream/70">{word}</span>
        <span className="mt-2 block font-display text-base not-italic">“{meaning}”</span>
      </span>
    </span>
  );
}

/** Idea 3 — Arabic calligraphy drawn stroke by stroke, then filled. */
export function DrawnArabic({ text, className = "" }: { text: string; className?: string }) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const p = reduced ? 1 : progress;
  const draw = Math.min(1, p / 0.7);
  const fill = Math.max(0, (p - 0.55) / 0.35);
  return (
    <div ref={ref} className={className}>
      <svg viewBox="0 0 600 160" className="mx-auto w-full max-w-xl" role="img" aria-label={text}>
        <text
          x="300" y="115" textAnchor="middle" direction="rtl" lang="ar"
          className="font-display" fontSize="112"
          fill="currentColor" fillOpacity={Math.min(1, fill)}
          stroke="currentColor" strokeWidth="1.2"
          strokeDasharray="1400" strokeDashoffset={1400 * (1 - draw)}
        >{text}</text>
      </svg>
    </div>
  );
}
