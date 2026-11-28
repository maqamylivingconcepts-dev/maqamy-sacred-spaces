import { Link } from "@tanstack/react-router";
import { LocateFixed, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useLang } from "@/lib/i18n";
import { QIBLAH_ENABLED, ZONES, inMalaysia, nearestZone, zoneByCode } from "@/lib/waktu-solat";

const STATES = [...new Set(ZONES.map((z) => z.state))];

/** Short place name for the header, e.g. "Kuala Lumpur" from "Kuala Lumpur, Putrajaya". */
export const zoneShortName = (code: string) => zoneByCode(code).name.split(",")[0]!.trim();

/** Qiblah icon: a compass-like teardrop, as in the app's tab bar. */
function QiblahGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 4.5c2.6 3 3.4 5.6 3.4 7.5a3.4 3.4 0 0 1-6.8 0c0-1.9.8-4.5 3.4-7.5Z" />
      <path d="M12 12v7" />
    </svg>
  );
}

function ClockGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5V12l3.5 2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Full-screen app frame shared by the Qiblah and Watch screens:
 * MAQAMY header with BM/EN and location, content, and a Qiblah | Watch tab bar.
 */
export function PrayerAppShell({ active, zone, onZone, children }: {
  active: "qiblah" | "watch";
  zone: string;
  onZone: (code: string) => void;
  children: ReactNode;
}) {
  const { lang, t, setLang } = useLang();
  const [picker, setPicker] = useState(false);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const locate = () => {
    if (!navigator.geolocation) { setNotice(t("Location isn't available on this device.", "Lokasi tidak tersedia pada peranti ini.")); return; }
    setLocating(true);
    setNotice(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        if (!inMalaysia(coords.latitude, coords.longitude)) { setNotice(t("Prayer times are available for Malaysia only. Please choose a zone.", "Waktu solat tersedia untuk Malaysia sahaja. Sila pilih zon.")); return; }
        onZone(nearestZone(coords.latitude, coords.longitude).code);
        setPicker(false);
      },
      () => { setLocating(false); setNotice(t("We couldn't get your location. Please choose a zone.", "Lokasi anda tidak dapat diperoleh. Sila pilih zon.")); },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 600_000 },
    );
  };

  const tab = (key: "qiblah" | "watch") =>
    `flex flex-col items-center gap-1.5 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${active === key ? "text-brand-gold" : "text-brand-gold/55 hover:text-brand-gold/80"}`;

  return (
    <main className="maqamy-prayer-app relative flex min-h-svh flex-col text-brand-cream">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 border-b border-brand-gold/25 px-5 py-5 sm:px-8">
        <Link to="/" aria-label="MAQAMY" className="block w-32 sm:w-36">
          <img src="/maqamy-logo.png" alt="MAQAMY" className="h-auto w-full brightness-0 invert" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex rounded-full border border-brand-gold/50 p-0.5 text-[11px] font-semibold" role="group" aria-label="Language">
            {(["ms", "en"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={`rounded-full px-3 py-1.5 ${lang === l ? "bg-brand-gold text-brand-forest" : "text-brand-cream/70"}`}>{l === "ms" ? "BM" : "EN"}</button>
            ))}
          </div>
          <button type="button" onClick={() => setPicker(true)} className="text-right">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-brand-gold">{t("Location", "Lokasi")}</span>
            <span className="block max-w-36 truncate font-display text-sm text-brand-cream">{zoneShortName(zone)}</span>
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-5 pb-6 sm:px-8">{children}</div>

      <nav className="sticky bottom-0 mx-auto flex w-full max-w-5xl justify-center gap-10 border-t border-brand-gold/25 bg-[#0b2417]/90 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:gap-24" aria-label={t("Prayer tools", "Alat solat")}>
        {QIBLAH_ENABLED || active === "qiblah" ? (
          <Link to="/qiblah" className={tab("qiblah")} aria-current={active === "qiblah" ? "page" : undefined}><QiblahGlyph className="size-6" />{t("Qiblah", "Kiblat")}</Link>
        ) : (
          <span role="img" aria-label={`${t("Qiblah", "Kiblat")} — ${t("coming soon", "akan datang")}`} title={t("Coming soon", "Akan datang")} className="relative flex cursor-not-allowed flex-col items-center gap-1.5 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold/30">
            <span className="relative flex items-center justify-center"><QiblahGlyph className="size-6" /><span aria-hidden="true" className="absolute h-0.5 w-8 rotate-45 rounded-full bg-brand-gold/50" /></span>
            <span className="line-through">{t("Qiblah", "Kiblat")}</span>
          </span>
        )}
        <Link to="/waktu-solat" className={tab("watch")} aria-current={active === "watch" ? "page" : undefined}><ClockGlyph className="size-6" />{t("Watch", "Jam")}</Link>
      </nav>

      {/* Portal: the page fade-in animation would otherwise trap a fixed overlay inside the page. */}
      {picker ? createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setPicker(false)}>
          <div role="dialog" aria-modal="true" aria-label={t("Choose location", "Pilih lokasi")} className="w-full max-w-md border border-brand-gold/40 bg-[#0b2417] p-6 text-brand-cream sm:rounded-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">{t("Location", "Lokasi")}</p>
              <button type="button" onClick={() => setPicker(false)} aria-label={t("Close", "Tutup")} className="text-brand-cream/70"><X className="size-5" /></button>
            </div>
            <button type="button" onClick={locate} disabled={locating} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-forest">
              <LocateFixed className="size-4" />{locating ? t("Locating…", "Mencari lokasi…") : t("Use my location", "Guna lokasi saya")}
            </button>
            {notice ? <p className="mt-3 text-sm text-brand-gold-soft">{notice}</p> : null}
            <label className="mt-6 block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-cream/60">{t("Or choose your zone", "Atau pilih zon anda")}</span>
              <select value={zone} onChange={(e) => { onZone(e.target.value); setPicker(false); }} className="mt-2 w-full border border-brand-gold/40 bg-[#0b2417] px-3 py-3 text-sm text-brand-cream">
                {STATES.map((state) => (
                  <optgroup key={state} label={state}>
                    {ZONES.filter((z) => z.state === state).map((z) => <option key={z.code} value={z.code}>{z.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>
        </div>,
        document.body,
      ) : null}
    </main>
  );
}
