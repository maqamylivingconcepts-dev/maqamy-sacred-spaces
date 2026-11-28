import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { PrayerAppShell } from "@/components/maqamy/prayer-app-shell";
import { useLang } from "@/lib/i18n";
import { useZone } from "@/lib/use-prayer-week";
import { distanceToKaaba, qiblahBearing, zoneByCode } from "@/lib/waktu-solat";

export const Route = createFileRoute("/qiblah")({
  head: () => ({ meta: [
    { title: "Qiblah — MAQAMY" },
    { name: "description", content: "Find the Qiblah from where you are, with a live compass on your phone." },
    { property: "og:title", content: "Qiblah — MAQAMY" },
    { property: "og:description", content: "A live Qiblah compass on your phone." },
  ] }),
  component: QiblahPage,
});

const diff = (a: number, b: number) => { const d = (((a - b) % 360) + 360) % 360; return d > 180 ? 360 - d : d; };
type OrientationWithCompass = DeviceOrientationEvent & { webkitCompassHeading?: number };
type OrientationPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

/** Live compass heading (degrees from north) once started, when the device has one. */
function useHeading(active: boolean) {
  const [heading, setHeading] = useState<number | null>(null);
  useEffect(() => {
    if (!active) return;
    const angle = () => window.screen.orientation?.angle ?? 0;
    const onAbsolute = (e: DeviceOrientationEvent) => { if (e.alpha != null) setHeading((360 - e.alpha + angle()) % 360); };
    const onIOS = (e: Event) => { const h = (e as OrientationWithCompass).webkitCompassHeading; if (typeof h === "number") setHeading((h + angle()) % 360); };
    const absolute = "ondeviceorientationabsolute" in window;
    if (absolute) window.addEventListener("deviceorientationabsolute", onAbsolute as EventListener);
    else window.addEventListener("deviceorientation", onIOS);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onAbsolute as EventListener);
      window.removeEventListener("deviceorientation", onIOS);
    };
  }, [active]);
  return heading;
}

const C = 200; // compass centre in SVG units
const polar = (r: number, deg: number) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)] as const;

function Compass({ bearing, heading, facing, label }: { bearing: number; heading: number | null; facing: boolean; label: string }) {
  const rotate = heading != null ? -heading : 0;
  const cardinal: Record<number, string> = { 0: "N", 90: "E", 180: "S", 270: "W" };
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[24rem]">
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" role="img" aria-label={label}>
        <defs>
          <linearGradient id="q-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3dc9b" /><stop offset="0.35" stopColor="#c9a24c" /><stop offset="0.65" stopColor="#8f6a24" /><stop offset="1" stopColor="#e8c879" />
          </linearGradient>
          <radialGradient id="q-face" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#1f5a3c" /><stop offset="0.7" stopColor="#123826" /><stop offset="1" stopColor="#0b2417" />
          </radialGradient>
          <linearGradient id="q-needle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f6e6b8" /><stop offset="1" stopColor="#c9a24c" />
          </linearGradient>
        </defs>

        {/* Fixed marker: where the phone is pointing */}
        <path d={`M${C - 11} 0 L${C + 11} 0 L${C} 18 Z`} fill={facing ? "#f3dc9b" : "#c9a24c"} />

        <g style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "200px 200px", transition: "transform 0.25s ease-out" }}>
          <circle cx={C} cy={C} r="182" fill="url(#q-gold)" />
          <circle cx={C} cy={C} r="170" fill="#0b2417" />
          <circle cx={C} cy={C} r="140" fill="url(#q-face)" stroke="url(#q-gold)" strokeWidth="2" />
          {/* Degree ticks */}
          {Array.from({ length: 180 }, (_, i) => {
            const d = i * 2;
            const long = d % 30 === 0, mid = d % 10 === 0;
            const [x1, y1] = polar(long ? 146 : mid ? 152 : 158, d);
            const [x2, y2] = polar(166, d);
            return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={long ? "#f3dc9b" : "#c9a24c"} strokeOpacity={long ? 1 : mid ? 0.85 : 0.5} strokeWidth={long ? 2.2 : 1} />;
          })}
          {/* Cardinal letters and degree numbers */}
          {Array.from({ length: 12 }, (_, i) => {
            const d = i * 30;
            const [x, y] = polar(cardinal[d] ? 120 : 124, d);
            return cardinal[d] ? (
              <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="26" fill="#f6efe0" className="font-display" transform={`rotate(${d} ${x} ${y})`}>{cardinal[d]}</text>
            ) : (
              <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="13" fill="#e8c879" className="font-display" transform={`rotate(${d} ${x} ${y})`}>{d}</text>
            );
          })}
          {/* Fine rings */}
          {[100, 88, 76].map((r) => <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#c9a24c" strokeOpacity="0.12" />)}

          {/* Qiblah needle with Kaaba badge */}
          <g transform={`rotate(${bearing} ${C} ${C})`}>
            <path d={`M${C} ${C - 152} L${C + 9} ${C - 112} L${C + 4} ${C - 66} L${C - 4} ${C - 66} L${C - 9} ${C - 112} Z`} fill="url(#q-needle)" stroke="#8f6a24" strokeWidth="0.8" />
            <circle cx={C} cy={C - 92} r="12" fill="#0b2417" stroke="url(#q-gold)" strokeWidth="2.5" />
            <rect x={C - 6} y={C - 98} width="12" height="12" rx="1" fill="#e8c879" />
            <rect x={C - 6} y={C - 95} width="12" height="2" fill="#0b2417" />
          </g>
        </g>

        {/* Centre medallion (does not rotate) */}
        <circle cx={C} cy={C} r="64" fill="#0b2417" stroke="url(#q-gold)" strokeWidth="2" />
        <circle cx={C} cy={C} r="58" fill="none" stroke="#c9a24c" strokeOpacity="0.35" />
        <text x={C} y={C - 2} textAnchor="middle" fontSize="44" fill="#f6efe0" className="font-display">{Math.round(bearing)}°</text>
        <text x={C} y={C + 28} textAnchor="middle" fontSize="10" letterSpacing="3" fill="#e8c879">BEARING</text>
      </svg>
    </div>
  );
}

function QiblahPage() {
  const { t } = useLang();
  const [zone, setZone] = useZone();
  const [place, setPlace] = useState<{ lat: number; lng: number } | null>(null);
  const [started, setStarted] = useState(false);
  const [notice, setNotice] = useState<{ title: string; body: string } | null>(null);
  const heading = useHeading(started);
  const buzzed = useRef(false);

  const zonePoint = zoneByCode(zone);
  const here = place ?? { lat: zonePoint.lat, lng: zonePoint.lng };
  const bearing = qiblahBearing(here.lat, here.lng);
  const km = Math.round(distanceToKaaba(here.lat, here.lng));
  const facing = heading != null && diff(heading, bearing) <= 4;

  useEffect(() => {
    if (facing && !buzzed.current) { buzzed.current = true; navigator.vibrate?.(40); }
    if (!facing) buzzed.current = false;
  }, [facing]);

  // If no compass reading arrives shortly after starting, explain why.
  useEffect(() => {
    if (!started || heading != null) return;
    const id = window.setTimeout(() => setNotice((n) => n ?? {
      title: t("No compass detected.", "Tiada kompas dikesan."),
      body: t("On a phone, allow Motion & Orientation for this site and hold it flat. On a computer, follow the bearing shown.", "Pada telefon, benarkan Gerakan & Orientasi untuk laman ini dan pegang mendatar. Pada komputer, ikut arah darjah yang ditunjukkan."),
    }), 2500);
    return () => window.clearTimeout(id);
  }, [started, heading, t]);

  const start = async () => {
    setNotice(null);
    const Orientation = (window as unknown as { DeviceOrientationEvent?: OrientationPermission }).DeviceOrientationEvent;
    if (Orientation?.requestPermission) {
      try {
        if ((await Orientation.requestPermission()) !== "granted") setNotice({ title: t("Motion access was not allowed.", "Akses gerakan tidak dibenarkan."), body: t("Allow Motion & Orientation for this site in Settings, then try again.", "Benarkan Gerakan & Orientasi untuk laman ini dalam Tetapan, kemudian cuba lagi.") });
      } catch { /* ignore */ }
    }
    setStarted(true);
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setPlace({ lat: coords.latitude, lng: coords.longitude }),
      () => { /* keep the zone's location */ },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 600_000 },
    );
  };

  const status = facing
    ? { title: t("You're facing the Qiblah", "Anda menghadap kiblat"), body: "" }
    : heading != null
      ? { title: t("Turn until the Kaaba meets the marker", "Pusing sehingga Kaabah bertemu penanda"), body: "" }
      : notice;

  return (
    <PrayerAppShell active="qiblah" zone={zone} onZone={setZone}>
      <section className="flex flex-col items-center pt-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-gold">{t("Qiblah direction", "Arah kiblat")}</p>
        <div className="mt-3 w-full"><Compass bearing={bearing} heading={heading} facing={facing} label={t(`Qiblah is ${Math.round(bearing)} degrees from north`, `Kiblat ${Math.round(bearing)} darjah dari utara`)} /></div>

        <div className="mt-5 min-h-12" aria-live="polite">
          {status ? (
            <>
              <p className={`font-display text-lg ${facing ? "text-brand-gold" : "text-brand-cream"}`}>{status.title}</p>
              {status.body ? <p className="mt-1 max-w-sm text-xs text-brand-cream/60">{status.body}</p> : null}
            </>
          ) : null}
        </div>

        {!started || (heading == null && notice) ? (
          <button type="button" onClick={() => void start()} className="mt-4 rounded-full bg-brand-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-forest shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)]">
            {t("Start compass", "Mulakan kompas")}
          </button>
        ) : null}

        <dl className="mt-8 grid w-full max-w-md grid-cols-3 divide-x divide-brand-gold/25 border-y border-brand-gold/25">
          {[
            { v: `${bearing.toFixed(1)}°`, k: t("Qiblah", "Kiblat") },
            { v: heading != null ? `${Math.round(heading)}°` : "—", k: t("Heading", "Hala") },
            { v: `${km.toLocaleString("en")} km`, k: t("To Makkah", "Ke Makkah") },
          ].map((s) => (
            <div key={s.k} className="flex flex-col-reverse px-2 py-3">
              <dt className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-gold">{s.k}</dt>
              <dd className="font-display text-lg text-brand-cream">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </PrayerAppShell>
  );
}
