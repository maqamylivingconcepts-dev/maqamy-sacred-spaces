import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/maqamy/site-chrome";
import { Button } from "@/components/ui/button";
import { SiteImg } from "@/components/maqamy/site-img";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/lib/i18n";
import { brandStory } from "@/lib/brand-story";

export const Route = createFileRoute("/story")({
  head: () => ({ meta: [
    { title: "The MAQAMY Story — Designed for the Presence of the Heart" },
    { name: "description", content: "Discover MAQAMY, a Malaysian design house bringing together design excellence, cultural identity and spiritual meaning through mindful living." },
    { property: "og:title", content: "The MAQAMY Story — Designed for the Presence of the Heart" },
    { property: "og:description", content: "Contemporary Islamic living, rooted in Malaysia and inspired by Ḥuḍūr al-Qalb — the presence of the heart." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: StoryPage,
});

const NUMERALS = ["I", "II", "III", "IV", "V"];

/** Eight-point star — a quiet nod to Islamic geometric ornament. */
function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="5" y="5" width="14" height="14" />
      <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
    </svg>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-brand-gold ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-current opacity-50" />
      <Star className="h-4 w-4" />
      <span className="h-px w-16 bg-current opacity-50" />
    </div>
  );
}

function StoryPage() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);
  const { itemCount, userEmail, signOut } = useCart();
  const { t } = useLang();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number(entry.target.getAttribute("data-index") ?? 0));
    }, { rootMargin: "-35% 0px -35% 0px", threshold: 0 });
    refs.current.forEach((node) => { if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  /** Props that register a chapter paragraph for the reading-focus highlight. */
  const chapter = (index: number) => ({
    ref: (node: HTMLElement | null) => { refs.current[index] = node; },
    "data-index": index,
    "data-active": active === index ? "true" : undefined,
  });
  const focus = (index: number) => `transition-opacity duration-700 ${active === index ? "opacity-100" : "opacity-60"}`;
  const [lede, , , presence, horizon] = brandStory;
  const title = (index: number) => t(brandStory[index]!.title.en, brandStory[index]!.title.ms);

  return (
    <main className="bg-brand-cream text-brand-forest">
      <div className="bg-brand-forest"><SiteHeader itemCount={itemCount} userEmail={userEmail} onSignOut={signOut} /></div>

      {/* Opening */}
      <section className="relative overflow-hidden px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="maqamy-arrival order-2 text-center lg:order-1 lg:text-left">
            <p className="type-label text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">{t("Malaysian design house", "Rumah reka bentuk Malaysia")}</p>
            <h1 className="type-heading mt-6 text-balance font-display text-5xl font-light leading-[1.02] sm:text-6xl lg:text-7xl">{t("The MAQAMY", "Kisah")}<br /><span className="italic text-brand-gold">{t("Story", "MAQAMY")}</span></h1>
            <div className="mx-auto mt-8 h-px w-20 bg-brand-gold/60 lg:mx-0" aria-hidden="true" />
            <p className="type-body mx-auto mt-8 max-w-md font-display text-xl italic leading-8 text-brand-forest/75 sm:text-2xl lg:mx-0">{t("Designed for the presence of the heart.", "Direka untuk kehadiran hati.")}</p>
            <a href="#story-begin" className="type-control mt-12 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-forest/70 hover:text-brand-gold">
              {t("Begin reading", "Mula membaca")} <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" />
            </a>
          </div>
          <div className="maqamy-arrival-late order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
            <div className="relative">
              <div className="absolute -inset-3 rounded-t-full border border-brand-gold/40 sm:-inset-4" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-brand-mist shadow-maqamy">
                <SiteImg slot="story" alt={t("A complete MAQAMY prayer space", "Ruang solat MAQAMY yang lengkap")} className="maqamy-landscape h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter I — lede */}
      <section id="story-begin" className="scroll-mt-10 border-t border-brand-gold/20 px-5 py-24 sm:px-8 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <Ornament />
          <p className="type-label mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">{NUMERALS[0]} · {title(0)}</p>
          <p {...chapter(0)} className={`type-storyBody mt-10 text-balance font-display text-2xl font-light leading-[1.55] sm:text-3xl sm:leading-[1.5] ${focus(0)}`}>{t(lede!.en, lede!.ms)}</p>
        </div>
      </section>

      {/* Chapters II & III — craft */}
      <section className="bg-brand-mist px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream shadow-maqamy">
              <SiteImg slot="storyCraft" alt={t("MAQAMY craftsmanship in detail", "Perincian pertukangan MAQAMY")} className="h-full w-full object-cover" />
            </div>
            <p className="type-label mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-forest/60">{t("Form · Material · Proportion · Craft", "Bentuk · Bahan · Perkadaran · Pertukangan")}</p>
          </div>
          <div className="flex flex-col justify-center gap-20 lg:py-16">
            {([1, 2] as const).map((i) => {
              const p = brandStory[i]!;
              return (
                <article key={i} {...chapter(i)} className={focus(i)}>
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-5xl font-light italic text-brand-gold sm:text-6xl">{NUMERALS[i]}</span>
                    <h2 className="type-heading font-display text-3xl font-light sm:text-4xl">{title(i)}</h2>
                  </div>
                  <div className="mt-6 h-px w-full bg-brand-gold/30" aria-hidden="true" />
                  <p className="type-storyBody mt-6 text-lg leading-9 text-brand-forest/85 sm:text-xl sm:leading-10">{t(p.en, p.ms)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapter IV — Ḥuḍūr al-Qalb */}
      <section className="relative isolate overflow-hidden bg-brand-forest px-5 py-28 text-brand-cream sm:px-8 lg:py-40">
        <SiteImg slot="storyPhilosophy" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-forest via-brand-forest/80 to-brand-forest" aria-hidden="true" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="type-label text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold-soft">{NUMERALS[3]} · {t("Our philosophy", "Falsafah kami")}</p>
          <p lang="ar" dir="rtl" className="mt-10 font-display text-5xl leading-none text-brand-gold-soft sm:text-6xl">حضور القلب</p>
          <h2 className="type-heading mt-6 font-display text-4xl font-light sm:text-6xl">Ḥuḍūr al-Qalb</h2>
          <p className="type-body mt-4 font-display text-xl italic text-brand-cream/70">{title(3)}</p>
          <Ornament className="mt-12 text-brand-gold-soft" />
          <p {...chapter(3)} className={`type-storyBody mx-auto mt-12 max-w-3xl text-balance text-lg leading-9 sm:text-2xl sm:leading-[1.7] ${focus(3)}`}>{t(presence!.en, presence!.ms)}</p>
        </div>
      </section>

      {/* Chapter V — horizon */}
      <section className="px-5 py-24 sm:px-8 lg:py-36">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="type-label text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">{NUMERALS[4]}</p>
            <h2 className="type-heading mt-4 text-balance font-display text-3xl font-light leading-tight sm:text-4xl">{title(4)}</h2>
          </div>
          <p {...chapter(4)} className={`type-storyBody text-lg leading-9 text-brand-forest/85 sm:text-2xl sm:leading-10 ${focus(4)}`}>{t(horizon!.en, horizon!.ms)}</p>
        </div>
      </section>

      {/* Invitation */}
      <section className="border-t border-brand-gold/20 bg-brand-cream-deep/30 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Star className="h-6 w-6 text-brand-gold" />
          <h2 className="type-heading mt-8 text-balance font-display text-3xl font-light leading-tight sm:text-5xl">{t("Designed for the presence", "Direka untuk kehadiran")} <span className="italic text-brand-gold">{t("of the heart.", "hati.")}</span></h2>
          <p className="type-body mt-6 max-w-md text-base leading-7 text-brand-forest/70">{t("Discover Noor and Janna — prayer spaces made to be returned to.", "Terokai Noor dan Janna — ruang solat untuk sentiasa kembali.")}</p>
          <Button asChild variant="gold" size="lg" className="group mt-10 rounded-none"><Link to="/collections">{t("Explore Noor & Janna", "Terokai Noor & Janna")} <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link></Button>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
