import { useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { splitBannerTitle } from "@/lib/banner-title";

type Banner = Tables<"banners">;
const IMAGE_MS = 5000;

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  useEffect(() => {
    void supabase.from("banners").select("*").eq("active", true).order("display_order").then(({ data }) => setBanners(data ?? []));
  }, []);
  return banners;
}

export function BannerCarousel({ banners, tone = "light" }: { banners: Banner[]; tone?: "light" | "dark" }) {
  const [index, setIndex] = useState(0);
  // Sound is remembered per banner; until the visitor sets it, the first tap anywhere turns it on.
  const [interacted, setInteracted] = useState(false);
  const [soundFor, setSoundFor] = useState<Record<string, boolean>>({});
  const timer = useRef(0);
  const videos = useRef(new Map<string, HTMLVideoElement>());
  const count = banners.length;
  const current = banners[index % Math.max(count, 1)];

  const next = () => setIndex((value) => (value + 1) % count);
  const soundOn = current ? (soundFor[current.id] ?? interacted) : false;

  // Browsers block autoplay-with-sound until the visitor interacts once;
  // the first tap/scroll/keypress anywhere unmutes the current video.
  useEffect(() => {
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const stop = () => events.forEach((type) => window.removeEventListener(type, enable));
    function enable(e: Event) {
      // The sound button decides for itself; don't let the same tap switch sound on and back off.
      if (e.target instanceof Element && e.target.closest("[data-banner-sound]")) return;
      setInteracted(true);
      stop();
    }
    events.forEach((type) => window.addEventListener(type, enable));
    return stop;
  }, []);

  // Only the banner on screen plays (and only it can be heard); every other video is paused and silent.
  useEffect(() => {
    for (const [id, video] of videos.current) {
      if (current && id === current.id) {
        video.muted = !soundOn;
        if (video.paused) void video.play().catch(() => { video.muted = true; void video.play().catch(() => undefined); });
      } else {
        video.muted = true;
        if (!video.paused) video.pause();
      }
    }
  }, [current, soundOn]);

  // A video starts from the beginning each time its slide comes into view.
  useEffect(() => {
    if (!current || current.kind !== "video") return;
    const video = videos.current.get(current.id);
    if (video) video.currentTime = 0;
  }, [current]);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!current) return;
    if (current.kind === "image") timer.current = window.setTimeout(next, IMAGE_MS);
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count]);

  if (!count || !current) return null;
  const dark = tone === "dark";

  return (
    <section aria-label="Featured" className={`relative overflow-hidden ${dark ? "bg-brand-cream" : "bg-brand-ink"}`}>
      <div className="relative mx-auto aspect-[16/9] max-h-[70vh] w-full max-w-[1440px] sm:aspect-[21/9]">
        {banners.map((banner, i) => {
          const active = i === index % count;
          return (
            <div
              key={banner.id}
              className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(${(i - (index % count)) * 100}%)` }}
              aria-hidden={!active}
            >
              {banner.kind === "video" ? (
                <video
                  src={banner.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload={active ? "auto" : "metadata"}
                  onEnded={() => { if (active) next(); }}
                  ref={(el) => {
                    if (!el) { videos.current.delete(banner.id); return; }
                    videos.current.set(banner.id, el);
                  }}
                />
              ) : (
                <img src={banner.url} alt={splitBannerTitle(banner.title).title || "MAQAMY feature"} className="h-full w-full object-cover" />
              )}
              {banner.title ? <BannerTitle title={banner.title} raised={banner.kind === "video"} /> : null}
            </div>
          );
        })}
        {current.kind === "video" ? (
          <button
            type="button"
            data-banner-sound
            aria-label={soundOn ? "Mute video sound" : "Turn video sound on"}
            onClick={(e) => { e.stopPropagation(); setInteracted(true); setSoundFor((prev) => ({ ...prev, [current.id]: !soundOn })); }}
            className={`absolute bottom-4 left-5 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all duration-300 sm:left-8 ${dark ? "bg-brand-forest/10 text-brand-forest hover:bg-brand-forest/20" : "bg-brand-cream/15 text-brand-cream hover:bg-brand-cream/30"}`}
          >
            {soundOn ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></svg>
            )}
          </button>
        ) : null}
        {count > 1 ? (
          <div className="absolute bottom-4 right-5 flex gap-1.5 sm:right-8">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${i === index % count ? "w-6 bg-brand-gold" : `w-2 ${dark ? "bg-brand-forest/30" : "bg-brand-cream/40"}`}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Caption in Aime: short gold rule, white title, smaller gold subtitle. */
function BannerTitle({ title: stored, raised }: { title: string; raised: boolean }) {
  const { title, subtitle } = splitBannerTitle(stored);
  if (!title && !subtitle) return null;
  return (
    <div className={`maqamy-banner-title pointer-events-none absolute left-5 right-5 font-sans sm:left-8 sm:right-8 lg:left-12 ${raised ? "bottom-16" : "bottom-8"}`}>
      <span className="block h-px w-6 bg-brand-gold sm:w-12" aria-hidden="true" />
      {title ? <p className="type-banner mt-1.5 break-words text-[11px] font-normal leading-tight text-white sm:mt-3 sm:text-3xl">{title}</p> : null}
      {subtitle ? <p className="mt-0.5 break-words text-[8px] font-normal uppercase leading-3 tracking-[0.1em] text-brand-gold-soft sm:mt-2 sm:text-xs sm:leading-5">{subtitle}</p> : null}
    </div>
  );
}
