import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/maqamy/site-chrome";
import { Button } from "@/components/ui/button";
import { SiteImg } from "@/components/maqamy/site-img";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/lib/i18n";
import { brandStory } from "@/lib/brand-story";
import { DrawnArabic, MeaningWord, RevealText } from "@/components/maqamy/story-interactive";

const NUMERALS = ["I", "II", "III", "IV", "V"];
const GOLD_PHRASES = [
  "bring the heart into presence", "a place to return", "the presence of the heart", "From Malaysia, for the world.",
  "menghadirkan hati", "tempat untuk kembali", "kehadiran hati", "Dari Malaysia, untuk dunia.",
];

export const Route = createFileRoute("/story")({
  head: () => ({ meta: [
    { title: "The MAQAMY Story — Designed for the Presence of the Heart" },
    { name: "description", content: "Discover MAQAMY, a design house creating prayer spaces and furnishings that bring the heart into presence." },
    { property: "og:title", content: "The MAQAMY Story — Designed for the Presence of the Heart" },
    { property: "og:description", content: "Contemporary Islamic living, inspired by Ḥuḍūr al-Qalb — the presence of the heart." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: StoryPage,
});

function StoryPage() {
  const { itemCount, userEmail, signOut } = useCart();
  const { t } = useLang();

  return (
    <main className="bg-brand-cream text-brand-forest">
      <div className="bg-brand-forest"><SiteHeader itemCount={itemCount} userEmail={userEmail} onSignOut={signOut} /></div>
      <section className="grid min-h-[78svh] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-20 sm:px-8 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-12">
          <p className="type-label text-xs font-semibold uppercase text-brand-gold">{t("A design house for the heart", "Rumah reka bentuk untuk hati")}</p>
          <h1 className="type-heading mt-5 max-w-xl font-display text-3xl font-light leading-[1.1] sm:text-4xl">{t("The MAQAMY Story", "Kisah MAQAMY")}</h1>
          <p className="type-body mt-8 max-w-lg font-display text-2xl italic leading-8 text-muted-foreground">{t("Designed for the presence of the heart.", "Direka untuk kehadiran hati.")}</p>
        </div>
        <div className="min-h-[55svh] bg-brand-mist p-5 sm:p-8 lg:p-12">
          <SiteImg slot="story" alt="A complete MAQAMY prayer space" className="h-full w-full object-contain" />
        </div>
      </section>
      {/* Chapters I–III: words light up as you read */}
      <section className="overflow-x-clip px-5 py-24 sm:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl space-y-24 lg:space-y-32">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <p className="font-display text-2xl italic text-brand-gold">{NUMERALS[i]}</p>
              <RevealText
                text={t(brandStory[i]!.en, brandStory[i]!.ms)}
                gold={GOLD_PHRASES}
                specials={["maqām"]}
                renderSpecial={(word) => <MeaningWord word={word} arabic="مقام" meaning={t("a place to return", "tempat untuk kembali")} label={t("Meaning of maqām", "Maksud maqām")} />}
                className="type-storyBody mt-5 text-lg leading-9 sm:text-2xl sm:leading-10"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Chapter IV: Ḥuḍūr al-Qalb drawn in calligraphy */}
      <section className="bg-brand-forest px-5 py-24 text-brand-cream sm:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <p className="type-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold-soft">{NUMERALS[3]} · {t("Our philosophy", "Falsafah kami")}</p>
          <DrawnArabic text="حضور القلب" className="mt-8 text-brand-gold-soft" />
          <h2 className="type-heading mt-2 font-display text-4xl font-light sm:text-5xl">Ḥuḍūr al-Qalb</h2>
          <p className="mt-3 font-display text-lg italic text-brand-cream/70">{t("The presence of the heart.", "Kehadiran hati.")}</p>
          <RevealText
            text={t(brandStory[3]!.en, brandStory[3]!.ms)}
            gold={GOLD_PHRASES}
            className="type-storyBody mx-auto mt-14 text-lg leading-9 sm:text-2xl sm:leading-10"
          />
        </div>
      </section>

      {/* Chapter V */}
      <section className="px-5 py-24 sm:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl">
          <p className="font-display text-2xl italic text-brand-gold">{NUMERALS[4]}</p>
          <RevealText
            text={t(brandStory[4]!.en, brandStory[4]!.ms)}
            gold={GOLD_PHRASES}
            className="type-storyBody mt-5 text-lg leading-9 sm:text-2xl sm:leading-10"
          />
        </div>
      </section>
      <section className="bg-brand-forest px-5 py-20 text-brand-cream sm:px-8 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="type-heading max-w-3xl font-display text-2xl font-light leading-tight sm:text-3xl">{t("MAQAMY — Designed for the presence of the heart.", "MAQAMY — Direka untuk kehadiran hati.")}</h2>
          <Button asChild variant="gold" size="lg"><Link to="/collections">{t("Explore Collections", "Terokai Koleksi")} <ArrowRight /></Link></Button>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
