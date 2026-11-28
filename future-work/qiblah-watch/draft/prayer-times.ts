/**
 * Qiblah direction and prayer-time calculations, done entirely in the browser.
 * Prayer times follow JAKIM-style parameters (Fajr 20°, Isha 18°, Shafi'i Asr)
 * with a small safety margin; they are guidance only — mosques and JAKIM's
 * official zones remain the reference.
 */

export const KAABA = { lat: 21.422487, lng: 39.826206 };
/** Default location when the visitor has not shared theirs. */
export const KUALA_LUMPUR = { lat: 3.139, lng: 101.6869 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const fix = (a: number, b: number) => { const r = a - b * Math.floor(a / b); return r < 0 ? r + b : r; };

/** Bearing from true north (0–360°) to the Kaaba. */
export function qiblahBearing(lat: number, lng: number): number {
  const p1 = rad(lat), p2 = rad(KAABA.lat), dl = rad(KAABA.lng - lng);
  const y = Math.sin(dl);
  const x = Math.cos(p1) * Math.tan(p2) - Math.sin(p1) * Math.cos(dl);
  return fix(deg(Math.atan2(y, x)), 360);
}

/** Great-circle distance to the Kaaba in kilometres. */
export function distanceToKaaba(lat: number, lng: number): number {
  const R = 6371;
  const dLat = rad(KAABA.lat - lat), dLng = rad(KAABA.lng - lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
export const PRAYER_ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

function julian(year: number, month: number, day: number) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * D, 360);
  const q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360);
  const e = 23.439 - 0.00000036 * D;
  const RA = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15;
  const eqt = q / 15 - fix(RA, 24);
  const decl = deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L))));
  return { decl, eqt };
}

/**
 * Prayer times for a calendar date at a location, as Date objects in the
 * visitor's own time zone (`tzHours` = offset from UTC, e.g. 8 for Malaysia).
 */
export function prayerTimes(date: Date, lat: number, lng: number, tzHours = -date.getTimezoneOffset() / 60): Record<PrayerKey, Date> {
  const jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lng / (15 * 24);
  const midDay = (t: number) => fix(12 - sunPosition(jd + t).eqt, 24);
  const sunAngleTime = (angle: number, t: number, ccw: boolean) => {
    const { decl } = sunPosition(jd + t);
    const noon = midDay(t);
    const cosT = (-Math.sin(rad(angle)) - Math.sin(rad(decl)) * Math.sin(rad(lat))) / (Math.cos(rad(decl)) * Math.cos(rad(lat)));
    const T = deg(Math.acos(Math.max(-1, Math.min(1, cosT)))) / 15;
    return noon + (ccw ? -T : T);
  };
  const asrTime = (factor: number, t: number) => {
    const { decl } = sunPosition(jd + t);
    const angle = -deg(Math.atan(1 / (factor + Math.tan(rad(Math.abs(lat - decl))))));
    return sunAngleTime(angle, t, false);
  };

  // Two passes refine the sun position for each time of day.
  let t = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 18 };
  for (let i = 0; i < 2; i++) {
    const d = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, v / 24])) as typeof t;
    t = {
      fajr: sunAngleTime(20, d.fajr, true),
      sunrise: sunAngleTime(0.833, d.sunrise, true),
      dhuhr: midDay(d.dhuhr),
      asr: asrTime(1, d.asr),
      maghrib: sunAngleTime(0.833, d.maghrib, false),
      isha: sunAngleTime(18, d.isha, false),
    };
  }

  // Ihtiyat (safety margin) in minutes, as Malaysian timetables apply.
  const margin: Record<PrayerKey, number> = { fajr: 2, sunrise: -2, dhuhr: 2, asr: 2, maghrib: 2, isha: 2 };
  const out = {} as Record<PrayerKey, Date>;
  for (const key of PRAYER_ORDER) {
    const hours = t[key] + tzHours - lng / 15 + margin[key] / 60;
    const ms = Math.round(hours * 60) * 60_000; // round to the minute
    out[key] = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, ms);
  }
  return out;
}

/** The next prayer (sunrise excluded) after `now`, rolling over to tomorrow's Fajr. */
export function nextPrayer(now: Date, lat: number, lng: number): { key: PrayerKey; at: Date } {
  const today = prayerTimes(now, lat, lng);
  for (const key of PRAYER_ORDER) {
    if (key === "sunrise") continue;
    if (today[key] > now) return { key, at: today[key] };
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { key: "fajr", at: prayerTimes(tomorrow, lat, lng).fajr };
}
