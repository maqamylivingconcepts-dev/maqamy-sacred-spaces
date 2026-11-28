import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { PrayerAppShell } from "@/components/maqamy/prayer-app-shell";
import { useLang } from "@/lib/i18n";
import { usePrayerWeek, useZone } from "@/lib/use-prayer-week";
import {
  HOLY_CITIES, PRAYER_LABELS, formatHijri, malaysiaDate, momentOf, nextPrayer, noonUTC3, type PrayerKey,
} from "@/lib/waktu-solat";

export const Route = createFileRoute("/waktu-solat")({
  head: () => ({ meta: [
    { title: "Waktu Solat — MAQAMY" },
    { name: "description", content: "Today's prayer times for your area in Malaysia, with a live clock and countdown to the next prayer." },
    { property: "og:title", content: "Waktu Solat — MAQAMY" },
    { property: "og:description", content: "Today's prayer times, a live clock and the next prayer." },
  ] }),
  component: WatchPage,
});

/** Prayer names stay in Malay in both languages, as in the MAQAMY app. */
const GRID: PrayerKey[] = ["fajr", "syuruk", "dhuhr", "asr", "maghrib", "isha"];

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id); }, []);
  return now;
}

/** Wall-clock parts of `date` in a time zone. */
function partsIn(date: Date, timeZone: string) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(date).map((x) => [x.type, x.value]));
  return { h: Number(p["hour"]) % 24, m: Number(p["minute"]), s: Number(p["second"]) };
}

const time12 = (date: Date, timeZone: string) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone }).replace("AM", "am").replace("PM", "pm");

/** "13:04" (Malaysia) → "1:04 pm". */
const hm12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number) as [number, number];
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

const C = 200;
const polar = (r: number, deg: number) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)] as const;

function Hand({ deg, length, width, tail = 0, fill = "url(#w-gold)" }: { deg: number; length: number; width: number; tail?: number; fill?: string }) {
  return (
    <g transform={`rotate(${deg} ${C} ${C})`}>
      <path d={`M${C} ${C - length} L${C + width / 2} ${C - length + 14} L${C + width / 2} ${C + tail} L${C - width / 2} ${C + tail} L${C - width / 2} ${C - length + 14} Z`} fill={fill} />
    </g>
  );
}

function SubDial({ cx, cy, label, h, m }: { cx: number; cy: number; label: string; h: number; m: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="34" fill="#0d2c1d" stroke="url(#w-gold)" strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={cx + 27 * Math.sin(a)} y1={cy - 27 * Math.cos(a)} x2={cx + 31 * Math.sin(a)} y2={cy - 31 * Math.cos(a)} stroke="#c9a24c" strokeWidth={i % 3 === 0 ? 1.6 : 0.8} />;
      })}
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize="5.5" letterSpacing="1" fill="#e8c879">{label}</text>
      <g transform={`rotate(${(h % 12) * 30 + m / 2} ${cx} ${cy})`}><rect x={cx - 1.2} y={cy - 15} width="2.4" height="15" fill="#f3dc9b" /></g>
      <g transform={`rotate(${m * 6} ${cx} ${cy})`}><rect x={cx - 0.8} y={cy - 23} width="1.6" height="23" fill="#f3dc9b" /></g>
      <circle cx={cx} cy={cy} r="2.5" fill="#e8c879" />
    </g>
  );
}

function WatchFace({ now, hijriDay, label }: { now: Date; hijriDay: string; label: string }) {
  const my = partsIn(now, "Asia/Kuala_Lumpur");
  const mk = partsIn(now, "Asia/Riyadh");
  return (
    <div className="mx-auto aspect-square w-full max-w-[21rem]">
      <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label={label}>
        <defs>
          <linearGradient id="w-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3dc9b" /><stop offset="0.35" stopColor="#c9a24c" /><stop offset="0.65" stopColor="#8f6a24" /><stop offset="1" stopColor="#e8c879" />
          </linearGradient>
          <radialGradient id="w-dial" cx="0.5" cy="0.4" r="0.65">
            <stop offset="0" stopColor="#2a6b48" /><stop offset="0.6" stopColor="#164a31" /><stop offset="1" stopColor="#0c2a1b" />
          </radialGradient>
        </defs>
        {/* Bezel */}
        <circle cx={C} cy={C} r="194" fill="url(#w-gold)" />
        <circle cx={C} cy={C} r="178" fill="#0b2417" />
        {Array.from({ length: 60 }, (_, i) => {
          const d = i * 6;
          const [x1, y1] = polar(i % 5 === 0 ? 162 : 168, d); const [x2, y2] = polar(175, d);
          return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e8c879" strokeWidth={i % 5 === 0 ? 2 : 0.8} strokeOpacity={i % 5 === 0 ? 1 : 0.6} />;
        })}
        {[10, 20, 30, 40, 50].map((n) => {
          const d = n * 6; const [x, y] = polar(186, d);
          return <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="15" fill="#0b2417" className="font-display" transform={`rotate(${d} ${x} ${y})`}>{n}</text>;
        })}
        <path d={`M${C - 8} 8 L${C + 8} 8 L${C} 20 Z`} fill="#0b2417" />

        {/* Dial */}
        <circle cx={C} cy={C} r="158" fill="url(#w-dial)" stroke="url(#w-gold)" strokeWidth="2" />
        {Array.from({ length: 12 }, (_, i) => {
          const d = i * 30;
          if (i === 0) return (
            <g key={d}>
              <rect x={C - 9} y={C - 148} width="6" height="30" fill="url(#w-gold)" />
              <rect x={C + 3} y={C - 148} width="6" height="30" fill="url(#w-gold)" />
            </g>
          );
          if (i === 3 || i === 9) return <g key={d} transform={`rotate(${d} ${C} ${C})`}><rect x={C - 3} y={C - 148} width="6" height="22" fill="url(#w-gold)" /></g>;
          return <g key={d} transform={`rotate(${d} ${C} ${C})`}><rect x={C - 3.5} y={C - 148} width="7" height="30" fill="url(#w-gold)" /></g>;
        })}
        <text x={C} y={C - 92} textAnchor="middle" fontSize="13" letterSpacing="4" fill="#f6efe0" className="font-display">MAQAMY</text>

        <SubDial cx={C - 60} cy={C - 10} label="MAKKAH" h={mk.h} m={mk.m} />
        <SubDial cx={C + 60} cy={C - 10} label="MADINAH" h={mk.h} m={mk.m} />

        {/* Mini rose */}
        <g transform={`translate(${C} ${C + 72})`}>
          <circle r="24" fill="#0d2c1d" stroke="url(#w-gold)" strokeWidth="1.2" />
          <circle r="16" fill="none" stroke="#c9a24c" strokeOpacity="0.6" />
          {[0, 45, 90, 135].map((a) => <line key={a} x1="0" y1="-20" x2="0" y2="20" stroke="#c9a24c" strokeWidth="0.8" transform={`rotate(${a})`} />)}
          <path d="M0 -14 L4 0 L0 14 L-4 0 Z" fill="url(#w-gold)" />
        </g>

        {/* Hijri day window */}
        <rect x={C + 46} y={C + 52} width="26" height="22" rx="2" fill="#f6efe0" stroke="url(#w-gold)" strokeWidth="1.5" />
        <text x={C + 59} y={C + 67} textAnchor="middle" fontSize="12" fill="#0b2417" className="font-display">{hijriDay}</text>
        <text x={C + 59} y={C + 84} textAnchor="middle" fontSize="5" letterSpacing="1" fill="#e8c879">HIJRI</text>

        {/* Hands (Malaysia time) */}
        <Hand deg={(my.h % 12) * 30 + my.m / 2} length={92} width={10} tail={12} />
        <Hand deg={my.m * 6 + my.s / 10} length={136} width={7} tail={14} />
        <g transform={`rotate(${my.s * 6} ${C} ${C})`}>
          <line x1={C} y1={C + 26} x2={C} y2={C - 146} stroke="#f3dc9b" strokeWidth="1.4" />
          <circle cx={C} cy={C + 22} r="4" fill="#e8c879" />
        </g>
        <circle cx={C} cy={C} r="7" fill="url(#w-gold)" />
        <circle cx={C} cy={C} r="2.5" fill="#0b2417" />
      </svg>
    </div>
  );
}

function WatchPage() {
  const { t, lang } = useLang();
  const now = useNow();
  const [zone, setZone] = useZone();
  const { week, error } = usePrayerWeek(zone);

  const today = now && week ? week.days.find((d) => d.date === malaysiaDate(now)) ?? null : null;
  const next = useMemo(() => (week && now ? nextPrayer(week, now) : null), [week, now]);

  if (!now) return <PrayerAppShell active="watch" zone={zone} onZone={setZone}><div className="min-h-[70vh]" /></PrayerAppShell>;

  const my = partsIn(now, "Asia/Kuala_Lumpur");
  const pad = (n: number) => String(n).padStart(2, "0");
  const gregorian = now.toLocaleDateString(lang === "ms" ? "ms-MY" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kuala_Lumpur" });
  const left = next ? Math.max(0, Math.floor((next.at.getTime() - now.getTime()) / 1000)) : 0;
  const hijriDay = today?.hijri ? String(Number(today.hijri.slice(8, 10))) : "";

  return (
    <PrayerAppShell active="watch" zone={zone} onZone={setZone}>
      <section className="flex flex-col items-center pt-6 text-center">
        <WatchFace now={now} hijriDay={hijriDay} label={t(`Time in Malaysia ${pad(my.h)}:${pad(my.m)}`, `Waktu Malaysia ${pad(my.h)}:${pad(my.m)}`)} />

        <div className="mt-5 grid w-full max-w-md grid-cols-2 divide-x divide-brand-gold/25 border-y border-brand-gold/25">
          {HOLY_CITIES.map((city) => (
            <div key={city.key} className="px-2 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">{t(city.en, city.ms)}</p>
              <p className="mt-1 font-display text-lg text-brand-cream">{time12(now, "Asia/Riyadh")}</p>
              <p className="text-[11px] text-brand-cream/65">Zohor {time12(noonUTC3(now, city.lng), "Asia/Riyadh")}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 font-display text-6xl tabular-nums tracking-wide text-brand-cream sm:text-7xl">{pad(my.h)}:{pad(my.m)}:{pad(my.s)}</p>
        {today?.hijri ? <p className="mt-2 font-display text-lg text-brand-gold">{formatHijri(today.hijri, lang)}</p> : null}
        <p className="text-sm text-brand-cream/70">{gregorian}</p>

        {next ? (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold">{t("Next", "Seterusnya")} · {PRAYER_LABELS[next.key].ms} {t("at", "pada")} {time12(next.at, "Asia/Kuala_Lumpur")}</p>
            <p className="mt-1 font-display text-3xl tabular-nums text-brand-cream">{Math.floor(left / 3600)}h {pad(Math.floor((left % 3600) / 60))}m {pad(left % 60)}s</p>
          </div>
        ) : null}

        <ul className="mt-6 grid w-full max-w-md grid-cols-3 gap-2">
          {GRID.map((key) => {
            const isNext = !!(next && today && next.key === key && next.at.getTime() === momentOf(today.date, today[key]).getTime());
            return (
              <li key={key} className={`border px-2 py-3 ${isNext ? "border-brand-gold bg-brand-gold/15" : "border-brand-gold/30"}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-gold">{PRAYER_LABELS[key].ms}</p>
                <p className="mt-1 font-display text-xl text-brand-cream">{today ? hm12(today[key]) : "—"}</p>
              </li>
            );
          })}
        </ul>
        {error ? <p className="mt-4 text-sm text-brand-gold-soft">{t("Prayer times couldn't be loaded right now. Please try again shortly.", "Waktu solat tidak dapat dimuatkan sekarang. Sila cuba sebentar lagi.")}</p> : null}
      </section>
    </PrayerAppShell>
  );
}
