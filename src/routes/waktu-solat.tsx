import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, LocateFixed, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/maqamy/site-chrome";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/lib/i18n";
import { usePrayerWeek, useZone } from "@/lib/use-prayer-week";
import {
  PRAYER_KEYS, PRAYER_LABELS, ZONES, formatHijri, inMalaysia, malaysiaDate, momentOf, nearestZone, nextPrayer, zoneByCode,
} from "@/lib/waktu-solat";

export const Route = createFileRoute("/waktu-solat")({
  head: () => ({ meta: [
    { title: "Waktu Solat — MAQAMY" },
    { name: "description", content: "Today's prayer times for your area in Malaysia, with a live clock and countdown to the next prayer." },
    { property: "og:title", content: "Waktu Solat — MAQAMY" },
    { property: "og:description", content: "Today's prayer times, a live clock and the next prayer." },
  ] }),
  component: WaktuSolatPage,
});

const STATES = [...new Set(ZONES.map((z) => z.state))];

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id); }, []);
  return now;
}

function WaktuSolatPage() {
  const { itemCount, userEmail, signOut } = useCart();
  const { t, lang } = useLang();
  const now = useNow();
  const [zoneCode, setZone] = useZone();
  const zone = zoneByCode(zoneCode);
  const { week, error } = usePrayerWeek(zoneCode);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const today = week?.days.find((d) => d.date === malaysiaDate(now)) ?? null;
  const next = useMemo(() => (week ? nextPrayer(week, now) : null), [week, now]);
  const clock = now.toLocaleTimeString(lang === "ms" ? "ms-MY" : "en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kuala_Lumpur" });
  const gregorian = now.toLocaleDateString(lang === "ms" ? "ms-MY" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kuala_Lumpur" });

  const countdown = (() => {
    if (!next) return "";
    const mins = Math.max(0, Math.ceil((next.at.getTime() - now.getTime()) / 60_000));
    const h = Math.floor(mins / 60), m = mins % 60;
    return h ? t(`${h}h ${m}m`, `${h} jam ${m} minit`) : t(`${m} min`, `${m} minit`);
  })();

  const useLocation = () => {
    if (!navigator.geolocation) { setNotice(t("Location isn't available on this device.", "Lokasi tidak tersedia pada peranti ini.")); return; }
    setLocating(true);
    setNotice(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        if (!inMalaysia(coords.latitude, coords.longitude)) { setNotice(t("Prayer times are available for Malaysia only. Please choose a zone below.", "Waktu solat tersedia untuk Malaysia sahaja. Sila pilih zon di bawah.")); return; }
        setZone(nearestZone(coords.latitude, coords.longitude).code);
      },
      () => { setLocating(false); setNotice(t("We couldn't get your location. Please choose your zone below.", "Lokasi anda tidak dapat diperoleh. Sila pilih zon anda di bawah.")); },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 600_000 },
    );
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-forest">
      <SiteHeader tone="dark" itemCount={itemCount} userEmail={userEmail} onSignOut={signOut} />

      <section className="bg-brand-forest px-5 py-14 text-center text-brand-cream sm:px-8 lg:py-20">
        <p className="type-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold-soft">{t("Prayer times", "Waktu solat")}</p>
        <p className="mt-6 font-display text-6xl font-light tabular-nums tracking-wide sm:text-8xl" aria-live="off">{clock}</p>
        <p className="mt-4 text-sm text-brand-cream/75">{gregorian}</p>
        {today?.hijri ? <p className="mt-1 font-display text-lg italic text-brand-gold-soft">{formatHijri(today.hijri, lang)}</p> : null}
        {next ? (
          <div className="mx-auto mt-8 inline-flex flex-col items-center border border-brand-gold/40 px-6 py-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-brand-cream/60">{t("Next prayer", "Solat seterusnya")}</span>
            <span className="mt-1 font-display text-2xl">{t(PRAYER_LABELS[next.key].en, PRAYER_LABELS[next.key].ms)} · {next.at.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kuala_Lumpur" })}</span>
            <span className="mt-1 text-sm text-brand-gold-soft">{t("in", "dalam")} {countdown}</span>
          </div>
        ) : null}
      </section>

      <section className="px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-gold"><MapPin className="size-4" />{zone.state}</p>
              <p className="mt-2 font-display text-xl">{zone.name}</p>
            </div>
            <Button type="button" variant="cream" size="sm" onClick={useLocation} disabled={locating} className="self-start sm:self-auto"><LocateFixed /> {locating ? t("Locating…", "Mencari lokasi…") : t("Use my location", "Guna lokasi saya")}</Button>
          </div>
          {notice ? <p className="mt-3 text-sm text-brand-forest/70">{notice}</p> : null}

          <ul className="mt-8 divide-y divide-brand-gold/20 border-y border-brand-gold/20">
            {PRAYER_KEYS.map((key) => {
              const time = today?.[key];
              const isNext = next?.key === key && today && next.at.getTime() === momentOf(today.date, today[key]).getTime();
              const passed = today && time ? momentOf(today.date, time) < now : false;
              return (
                <li key={key} className={`flex items-center justify-between px-4 py-4 ${isNext ? "bg-brand-forest text-brand-cream" : ""}`}>
                  <span className={`font-display text-xl ${!isNext && (key === "imsak" || key === "syuruk") ? "text-brand-forest/60" : ""}`}>{t(PRAYER_LABELS[key].en, PRAYER_LABELS[key].ms)}</span>
                  <span className={`font-display text-2xl tabular-nums ${isNext ? "text-brand-gold-soft" : passed ? "text-brand-forest/45" : ""}`}>{time ?? "—"}</span>
                </li>
              );
            })}
          </ul>
          {error ? <p className="mt-4 text-sm text-brand-forest/70">{t("Prayer times couldn't be loaded right now. Please try again shortly.", "Waktu solat tidak dapat dimuatkan sekarang. Sila cuba sebentar lagi.")}</p> : null}

          <label className="mt-10 block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-gold">{t("Choose your zone", "Pilih zon anda")}</span>
            <select value={zoneCode} onChange={(e) => setZone(e.target.value)} className="mt-3 w-full border border-brand-gold/40 bg-card px-4 py-3 text-base">
              {STATES.map((state) => (
                <optgroup key={state} label={state}>
                  {ZONES.filter((z) => z.state === state).map((z) => <option key={z.code} value={z.code}>{z.name}</option>)}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="mt-12 text-center">
            <Button asChild variant="maqamy" size="lg" className="rounded-none"><Link to="/qiblah"><Compass /> {t("Find the Qiblah", "Cari arah kiblat")}</Link></Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
