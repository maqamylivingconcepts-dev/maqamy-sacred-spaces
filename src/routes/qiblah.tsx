import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Compass } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/maqamy/site-chrome";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/lib/i18n";
import { distanceToKaaba, qiblahBearing } from "@/lib/waktu-solat";

export const Route = createFileRoute("/qiblah")({
  head: () => ({ meta: [
    { title: "Qiblah Direction — MAQAMY" },
    { name: "description", content: "Find the Qiblah from where you are, with a live compass on your phone." },
    { property: "og:title", content: "Qiblah Direction — MAQAMY" },
    { property: "og:description", content: "A live Qiblah compass on your phone." },
  ] }),
  component: QiblahPage,
});

const KL = { lat: 3.139, lng: 101.6869 };
const diff = (a: number, b: number) => { const d = Math.abs(((a - b) % 360) + 360) % 360; return d > 180 ? 360 - d : d; };

type OrientationWithCompass = DeviceOrientationEvent & { webkitCompassHeading?: number };
type OrientationPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

/** Live compass heading (degrees from north) when the device has one. */
function useHeading(active: boolean) {
  const [heading, setHeading] = useState<number | null>(null);
  useEffect(() => {
    if (!active) return;
    const onAbsolute = (e: DeviceOrientationEvent) => {
      if (e.alpha == null) return;
      const screen = (window.screen.orientation?.angle ?? 0);
      setHeading((360 - e.alpha + screen) % 360);
    };
    const onIOS = (e: Event) => {
      const h = (e as OrientationWithCompass).webkitCompassHeading;
      if (typeof h === "number") setHeading((h + (window.screen.orientation?.angle ?? 0)) % 360);
    };
    const hasAbsolute = "ondeviceorientationabsolute" in window;
    if (hasAbsolute) window.addEventListener("deviceorientationabsolute", onAbsolute as EventListener);
    else window.addEventListener("deviceorientation", onIOS);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onAbsolute as EventListener);
      window.removeEventListener("deviceorientation", onIOS);
    };
  }, [active]);
  return heading;
}

function QiblahPage() {
  const { itemCount, userEmail, signOut } = useCart();
  const { t } = useLang();
  const [place, setPlace] = useState<{ lat: number; lng: number } | null>(null);
  const [started, setStarted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const heading = useHeading(started);
  const buzzed = useRef(false);

  const here = place ?? KL;
  const bearing = qiblahBearing(here.lat, here.lng);
  const km = Math.round(distanceToKaaba(here.lat, here.lng));
  const facing = heading != null && diff(heading, bearing) <= 4;

  useEffect(() => {
    if (facing && !buzzed.current) { buzzed.current = true; navigator.vibrate?.(40); }
    if (!facing) buzzed.current = false;
  }, [facing]);

  const start = async () => {
    setNotice(null);
    const Orientation = (window as unknown as { DeviceOrientationEvent?: OrientationPermission }).DeviceOrientationEvent;
    if (Orientation?.requestPermission) {
      try { if ((await Orientation.requestPermission()) !== "granted") setNotice(t("Compass access was not allowed. The direction below is still correct.", "Akses kompas tidak dibenarkan. Arah di bawah masih tepat.")); } catch { /* ignore */ }
    }
    setStarted(true);
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setPlace({ lat: coords.latitude, lng: coords.longitude }),
      () => setNotice(t("We couldn't get your location, so this shows the direction from Kuala Lumpur.", "Lokasi anda tidak dapat diperoleh, jadi ini menunjukkan arah dari Kuala Lumpur.")),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 600_000 },
    );
  };

  // The dial turns so its N matches real north; the top marker is where the phone points.
  const dialRotation = heading != null ? -heading : 0;

  return (
    <main className="min-h-screen bg-brand-cream text-brand-forest">
      <SiteHeader tone="dark" itemCount={itemCount} userEmail={userEmail} onSignOut={signOut} />
      <section className="bg-brand-forest px-5 py-14 text-center text-brand-cream sm:px-8 lg:py-20">
        <p className="type-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold-soft">{t("Qiblah", "Kiblat")}</p>
        <h1 className="type-heading mt-4 font-display text-4xl font-light sm:text-5xl">{t("Find the Qiblah", "Cari arah kiblat")}</h1>

        <div className="relative mx-auto mt-10 aspect-square w-full max-w-[20rem]">
          {/* Phone direction marker */}
          <span className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-2 border-x-[9px] border-t-[14px] border-x-transparent ${facing ? "border-t-brand-gold" : "border-t-brand-cream"}`} aria-hidden="true" />
          <div className="h-full w-full overflow-hidden rounded-full">
          <svg viewBox="0 0 300 300" className="h-full w-full transition-transform duration-200 ease-out" style={{ transform: `rotate(${dialRotation}deg)` }} role="img" aria-label={t(`Qiblah is ${Math.round(bearing)} degrees from north`, `Kiblat ${Math.round(bearing)} darjah dari utara`)}>
            <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            <circle cx="150" cy="150" r="118" fill="none" className={facing ? "stroke-brand-gold" : ""} stroke="currentColor" strokeOpacity={facing ? 1 : 0.15} strokeWidth={facing ? 2 : 1} />
            {Array.from({ length: 72 }, (_, i) => (
              <line key={i} x1="150" y1={i % 18 === 0 ? 14 : i % 2 === 0 ? 18 : 21} x2="150" y2="26" stroke="currentColor" strokeOpacity={i % 18 === 0 ? 0.9 : 0.35} transform={`rotate(${i * 5} 150 150)`} />
            ))}
            {(["N", "E", "S", "W"] as const).map((c, i) => (
              <text key={c} x="150" y="48" textAnchor="middle" fontSize="16" fill="currentColor" fillOpacity={c === "N" ? 1 : 0.6} transform={`rotate(${i * 90} 150 150)`} className="font-display">{c}</text>
            ))}
            {/* Qiblah needle */}
            <g transform={`rotate(${bearing} 150 150)`}>
              <line x1="150" y1="150" x2="150" y2="62" className="stroke-brand-gold" strokeWidth="3" strokeLinecap="round" />
              <rect x="139" y="40" width="22" height="22" rx="2" className="fill-brand-gold" />
              <rect x="139" y="46" width="22" height="3" fill="#0b1a10" fillOpacity="0.55" />
            </g>
            <circle cx="150" cy="150" r="6" className="fill-brand-gold" />
          </svg>
          </div>
        </div>

        <p className={`mt-8 font-display text-2xl ${facing ? "text-brand-gold" : ""}`} aria-live="polite">
          {facing ? t("You're facing the Qiblah", "Anda menghadap kiblat") : heading != null ? t("Turn until the gold Kaaba is at the top", "Pusing sehingga Kaabah emas berada di atas") : t(`${Math.round(bearing)}° from North`, `${Math.round(bearing)}° dari Utara`)}
        </p>
        <p className="mt-2 text-sm text-brand-cream/70">
          {t(`${Math.round(bearing)}° from North · ${km.toLocaleString("en")} km to Makkah`, `${Math.round(bearing)}° dari Utara · ${km.toLocaleString("en")} km ke Makkah`)}
          {place ? "" : t(" · from Kuala Lumpur", " · dari Kuala Lumpur")}
        </p>

        {!started ? (
          <Button type="button" variant="gold" size="lg" onClick={() => void start()} className="mt-8 rounded-none"><Compass /> {t("Start compass", "Mulakan kompas")}</Button>
        ) : heading == null ? (
          <p className="mx-auto mt-6 max-w-sm text-sm text-brand-cream/70">{t("No compass detected. On a phone, hold it flat; on a computer, use the direction in degrees above.", "Tiada kompas dikesan. Pada telefon, pegang mendatar; pada komputer, gunakan arah dalam darjah di atas.")}</p>
        ) : null}
        {notice && heading == null ? <p className="mx-auto mt-4 max-w-sm text-sm text-brand-gold-soft">{notice}</p> : null}
      </section>

      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm leading-7 text-brand-forest/70">{t("For the best accuracy, hold your phone flat and away from metal or magnets. If the needle seems off, move your phone in a figure-of-eight to calibrate.", "Untuk ketepatan terbaik, pegang telefon mendatar dan jauh dari logam atau magnet. Jika jarum kelihatan tersasar, gerakkan telefon dalam bentuk angka lapan untuk menentukur.")}</p>
          <Button asChild variant="maqamy" size="lg" className="mt-8 rounded-none"><Link to="/waktu-solat"><Clock /> {t("Prayer times", "Waktu solat")}</Link></Button>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
