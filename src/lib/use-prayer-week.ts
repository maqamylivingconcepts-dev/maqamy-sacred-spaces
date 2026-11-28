import { useEffect, useState } from "react";

import { DEFAULT_ZONE, isZoneCode, normaliseWeek, type PrayerWeek } from "@/lib/waktu-solat";

const ZONE_KEY = "maqamy-prayer-zone";
const cacheKey = (zone: string) => `maqamy-prayer-week-${zone}`;

function read<T>(key: string): T | null {
  try { const v = window.localStorage.getItem(key); return v ? (JSON.parse(v) as T) : null; } catch { return null; }
}
function write(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

/** The visitor's chosen prayer zone, remembered on this device. */
export function useZone(): [string, (zone: string) => void] {
  const [zone, setZone] = useState(DEFAULT_ZONE);
  useEffect(() => { const saved = read<string>(ZONE_KEY); if (saved && isZoneCode(saved)) setZone(saved); }, []);
  return [zone, (z: string) => { if (isZoneCode(z)) { setZone(z); write(ZONE_KEY, z); } }];
}

async function load(zone: string): Promise<PrayerWeek> {
  // Our own endpoint first; the public timetable directly as a fallback.
  try {
    const r = await fetch(`/api/public/waktu-solat?zone=${zone}`);
    if (r.ok) { const w = (await r.json()) as PrayerWeek; if (w.days?.length) return w; }
  } catch { /* fall through */ }
  const r = await fetch(`https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=week&zone=${zone}`);
  if (!r.ok) throw new Error("unavailable");
  const w = normaliseWeek(zone, await r.json());
  if (!w.days.length) throw new Error("unavailable");
  return w;
}

/** A week of prayer times for a zone, shown instantly from this device's last copy while refreshing. */
export function usePrayerWeek(zone: string) {
  const [week, setWeek] = useState<PrayerWeek | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    setError(false);
    const cached = read<PrayerWeek>(cacheKey(zone));
    setWeek(cached?.zone === zone ? cached : null);
    load(zone)
      .then((w) => { if (alive) { setWeek(w); write(cacheKey(zone), w); } })
      .catch(() => { if (alive && !cached) setError(true); });
    return () => { alive = false; };
  }, [zone]);
  return { week, error };
}
