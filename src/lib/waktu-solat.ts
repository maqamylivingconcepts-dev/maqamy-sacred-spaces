/**
 * Official Malaysian prayer times by zone, plus Qiblah direction.
 * Times come from the official national timetable service via our own
 * `/api/public/waktu-solat` endpoint; the site never names the source.
 */

export type Zone = { code: string; state: string; name: string; lat: number; lng: number; auto?: false };

/** Malaysian prayer zones with a representative point used to pick the nearest zone. */
export const ZONES: Zone[] = [
  { code: "JHR01", state: "Johor", name: "Pulau Aur, Pulau Pemanggil", lat: 2.45, lng: 104.52 },
  { code: "JHR02", state: "Johor", name: "Johor Bahru, Kota Tinggi, Mersing, Kulai", lat: 1.49, lng: 103.74 },
  { code: "JHR03", state: "Johor", name: "Kluang, Pontian", lat: 2.03, lng: 103.32 },
  { code: "JHR04", state: "Johor", name: "Batu Pahat, Muar, Segamat, Gemas, Tangkak", lat: 1.85, lng: 102.93 },
  { code: "KDH01", state: "Kedah", name: "Kota Setar, Kubang Pasu, Pokok Sena", lat: 6.12, lng: 100.37 },
  { code: "KDH02", state: "Kedah", name: "Kuala Muda, Yan, Pendang", lat: 5.65, lng: 100.49 },
  { code: "KDH03", state: "Kedah", name: "Padang Terap, Sik", lat: 6.03, lng: 100.68 },
  { code: "KDH04", state: "Kedah", name: "Baling", lat: 5.68, lng: 100.92 },
  { code: "KDH05", state: "Kedah", name: "Bandar Baharu, Kulim", lat: 5.37, lng: 100.56 },
  { code: "KDH06", state: "Kedah", name: "Langkawi", lat: 6.35, lng: 99.8 },
  { code: "KDH07", state: "Kedah", name: "Puncak Gunung Jerai", lat: 5.79, lng: 100.43, auto: false },
  { code: "KTN01", state: "Kelantan", name: "Kota Bharu, Bachok, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai", lat: 6.12, lng: 102.24 },
  { code: "KTN02", state: "Kelantan", name: "Gua Musang, Jeli, Lojing", lat: 4.88, lng: 101.97 },
  { code: "MLK01", state: "Melaka", name: "Seluruh Melaka", lat: 2.19, lng: 102.25 },
  { code: "NGS01", state: "Negeri Sembilan", name: "Tampin, Jempol", lat: 2.47, lng: 102.23 },
  { code: "NGS02", state: "Negeri Sembilan", name: "Jelebu, Kuala Pilah, Rembau", lat: 2.74, lng: 102.25 },
  { code: "NGS03", state: "Negeri Sembilan", name: "Seremban, Port Dickson", lat: 2.72, lng: 101.94 },
  { code: "PHG01", state: "Pahang", name: "Pulau Tioman", lat: 2.79, lng: 104.17 },
  { code: "PHG02", state: "Pahang", name: "Kuantan, Pekan, Muadzam Shah", lat: 3.81, lng: 103.33 },
  { code: "PHG03", state: "Pahang", name: "Jerantut, Temerloh, Maran, Bera, Chenor, Jengka", lat: 3.45, lng: 102.42 },
  { code: "PHG04", state: "Pahang", name: "Bentong, Lipis, Raub", lat: 3.52, lng: 101.91 },
  { code: "PHG05", state: "Pahang", name: "Genting Sempah, Janda Baik, Bukit Tinggi", lat: 3.4, lng: 101.8 },
  { code: "PHG06", state: "Pahang", name: "Cameron Highlands, Genting Highlands, Bukit Fraser", lat: 4.47, lng: 101.38 },
  { code: "PHG07", state: "Pahang", name: "Rompin", lat: 2.8, lng: 103.48 },
  { code: "PLS01", state: "Perlis", name: "Kangar, Padang Besar, Arau", lat: 6.44, lng: 100.2 },
  { code: "PNG01", state: "Pulau Pinang", name: "Seluruh Pulau Pinang", lat: 5.41, lng: 100.33 },
  { code: "PRK01", state: "Perak", name: "Tapah, Slim River, Tanjung Malim", lat: 4.2, lng: 101.26 },
  { code: "PRK02", state: "Perak", name: "Ipoh, Kuala Kangsar, Sungai Siput, Batu Gajah, Kampar", lat: 4.6, lng: 101.08 },
  { code: "PRK03", state: "Perak", name: "Lenggong, Pengkalan Hulu, Gerik", lat: 5.43, lng: 101.13 },
  { code: "PRK04", state: "Perak", name: "Temengor, Belum", lat: 5.55, lng: 101.35 },
  { code: "PRK05", state: "Perak", name: "Teluk Intan, Bagan Datuk, Seri Iskandar, Lumut, Sitiawan, Pangkor", lat: 4.02, lng: 101.02 },
  { code: "PRK06", state: "Perak", name: "Taiping, Selama, Bagan Serai, Parit Buntar", lat: 4.85, lng: 100.74 },
  { code: "PRK07", state: "Perak", name: "Bukit Larut", lat: 4.86, lng: 100.8, auto: false },
  { code: "SBH01", state: "Sabah", name: "Sandakan (Timur), Sukau", lat: 5.84, lng: 118.12 },
  { code: "SBH02", state: "Sabah", name: "Beluran, Telupid, Pinangah, Kuamut", lat: 5.89, lng: 117.55 },
  { code: "SBH03", state: "Sabah", name: "Lahad Datu, Kunak, Semporna, Tawau (Timur)", lat: 5.03, lng: 118.33 },
  { code: "SBH04", state: "Sabah", name: "Tawau, Balong, Merotai, Kalabakan", lat: 4.24, lng: 117.89 },
  { code: "SBH05", state: "Sabah", name: "Kudat, Kota Marudu, Pitas, Pulau Banggi", lat: 6.88, lng: 116.84 },
  { code: "SBH06", state: "Sabah", name: "Gunung Kinabalu", lat: 6.07, lng: 116.56, auto: false },
  { code: "SBH07", state: "Sabah", name: "Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan", lat: 5.98, lng: 116.07 },
  { code: "SBH08", state: "Sabah", name: "Keningau, Tambunan, Nabawan, Pensiangan", lat: 5.34, lng: 116.16 },
  { code: "SBH09", state: "Sabah", name: "Beaufort, Kuala Penyu, Sipitang, Tenom, Membakut, Weston", lat: 5.35, lng: 115.75 },
  { code: "SGR01", state: "Selangor", name: "Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Shah Alam", lat: 3.07, lng: 101.52 },
  { code: "SGR02", state: "Selangor", name: "Kuala Selangor, Sabak Bernam", lat: 3.34, lng: 101.25 },
  { code: "SGR03", state: "Selangor", name: "Klang, Kuala Langat", lat: 2.98, lng: 101.42 },
  { code: "SWK01", state: "Sarawak", name: "Limbang, Lawas, Sundar, Trusan", lat: 4.75, lng: 115.01 },
  { code: "SWK02", state: "Sarawak", name: "Miri, Niah, Bekenu, Sibuti, Marudi", lat: 4.4, lng: 113.99 },
  { code: "SWK03", state: "Sarawak", name: "Bintulu, Pandan, Belaga, Suai, Tatau, Sebauh", lat: 3.17, lng: 113.04 },
  { code: "SWK04", state: "Sarawak", name: "Sibu, Mukah, Dalat, Song, Kanowit, Kapit", lat: 2.3, lng: 111.82 },
  { code: "SWK05", state: "Sarawak", name: "Sarikei, Matu, Julau, Daro, Bintangor", lat: 2.13, lng: 111.52 },
  { code: "SWK06", state: "Sarawak", name: "Sri Aman, Lubok Antu, Betong, Saratok, Roban", lat: 1.24, lng: 111.46 },
  { code: "SWK07", state: "Sarawak", name: "Serian, Simunjan, Samarahan, Sebuyau", lat: 1.17, lng: 110.57 },
  { code: "SWK08", state: "Sarawak", name: "Kuching, Bau, Lundu, Sematan", lat: 1.55, lng: 110.36 },
  { code: "SWK09", state: "Sarawak", name: "Zon Khas (Kampung Patarikan)", lat: 4.6, lng: 115.3, auto: false },
  { code: "TRG01", state: "Terengganu", name: "Kuala Terengganu, Marang, Kuala Nerus", lat: 5.33, lng: 103.14 },
  { code: "TRG02", state: "Terengganu", name: "Besut, Setiu", lat: 5.83, lng: 102.56 },
  { code: "TRG03", state: "Terengganu", name: "Hulu Terengganu", lat: 5.07, lng: 102.95 },
  { code: "TRG04", state: "Terengganu", name: "Dungun, Kemaman", lat: 4.75, lng: 103.42 },
  { code: "WLY01", state: "Wilayah Persekutuan", name: "Kuala Lumpur, Putrajaya", lat: 3.14, lng: 101.69 },
  { code: "WLY02", state: "Wilayah Persekutuan", name: "Labuan", lat: 5.28, lng: 115.24 },
];

export const DEFAULT_ZONE = "WLY01";
export const isZoneCode = (code: string) => ZONES.some((z) => z.code === code);
export const zoneByCode = (code: string) => ZONES.find((z) => z.code === code) ?? ZONES.find((z) => z.code === DEFAULT_ZONE)!;

/** Roughly within Malaysia (Peninsular, Sabah, Sarawak, Labuan). */
export const inMalaysia = (lat: number, lng: number) => lat > 0.8 && lat < 7.5 && lng > 99.5 && lng < 119.5;

/** Nearest zone by representative point; special summit/zone-khas codes are only chosen manually. */
export function nearestZone(lat: number, lng: number): Zone {
  let best = zoneByCode(DEFAULT_ZONE);
  let bestD = Infinity;
  for (const z of ZONES) {
    if (z.auto === false) continue;
    const d = (z.lat - lat) ** 2 + ((z.lng - lng) * Math.cos((lat * Math.PI) / 180)) ** 2;
    if (d < bestD) { bestD = d; best = z; }
  }
  return best;
}

/* ---------- Prayer times ---------- */

export type PrayerKey = "imsak" | "fajr" | "syuruk" | "dhuhr" | "asr" | "maghrib" | "isha";
export const PRAYER_KEYS: PrayerKey[] = ["imsak", "fajr", "syuruk", "dhuhr", "asr", "maghrib", "isha"];
/** Prayers counted for "next prayer" (Imsak and Syuruk are shown but not prayers). */
export const COUNTDOWN_KEYS: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
export const PRAYER_LABELS: Record<PrayerKey, { en: string; ms: string }> = {
  imsak: { en: "Imsak", ms: "Imsak" },
  fajr: { en: "Fajr", ms: "Subuh" },
  syuruk: { en: "Sunrise", ms: "Syuruk" },
  dhuhr: { en: "Dhuhr", ms: "Zohor" },
  asr: { en: "Asr", ms: "Asar" },
  maghrib: { en: "Maghrib", ms: "Maghrib" },
  isha: { en: "Isha", ms: "Isyak" },
};

/** One day of times: `date` is YYYY-MM-DD (Malaysia), times are HH:MM. */
export type PrayerDay = { date: string; hijri: string } & Record<PrayerKey, string>;
export type PrayerWeek = { zone: string; days: PrayerDay[] };

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mac: "03", mar: "03", apr: "04", mei: "05", may: "05", jun: "06", jul: "07",
  ogo: "08", aug: "08", sep: "09", okt: "10", oct: "10", nov: "11", dis: "12", dec: "12",
};

/** "05-Dis-2026" → "2026-12-05". */
export function parseSourceDate(value: string): string | null {
  const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/.exec(value.trim());
  const month = m ? MONTHS[m[2]!.toLowerCase()] : undefined;
  return m && month ? `${m[3]}-${month}-${m[1]!.padStart(2, "0")}` : null;
}

const hhmm = (v: unknown) => (typeof v === "string" && /^\d{2}:\d{2}/.test(v) ? v.slice(0, 5) : null);

/** Turn the source's weekly response into our own shape, dropping anything malformed. */
export function normaliseWeek(zone: string, raw: unknown): PrayerWeek {
  const list = (raw as { prayerTime?: unknown[] } | null)?.prayerTime ?? [];
  const days: PrayerDay[] = [];
  for (const item of list) {
    const r = item as Record<string, unknown>;
    const date = typeof r["date"] === "string" ? parseSourceDate(r["date"]) : null;
    const times = PRAYER_KEYS.map((k) => [k, hhmm(r[k])] as const);
    if (!date || times.some(([, v]) => !v)) continue;
    days.push({ date, hijri: typeof r["hijri"] === "string" ? r["hijri"] : "", ...(Object.fromEntries(times) as Record<PrayerKey, string>) });
  }
  return { zone, days };
}

/** Today's date (YYYY-MM-DD) in Malaysia, whatever the device's own time zone. */
export function malaysiaDate(now: Date, offsetDays = 0): string {
  const d = new Date(now.getTime() + 8 * 3600_000 + offsetDays * 86_400_000);
  return d.toISOString().slice(0, 10);
}

/** A prayer time on a Malaysian date as an absolute moment. */
export function momentOf(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+08:00`);
}

/** The next prayer from `now`, looking into tomorrow if needed. */
export function nextPrayer(week: PrayerWeek, now: Date): { key: PrayerKey; at: Date } | null {
  for (const offset of [0, 1]) {
    const day = week.days.find((d) => d.date === malaysiaDate(now, offset));
    if (!day) continue;
    for (const key of COUNTDOWN_KEYS) {
      const at = momentOf(day.date, day[key]);
      if (at > now) return { key, at };
    }
  }
  return null;
}

const HIJRI_MONTHS = {
  en: ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah"],
  ms: ["Muharam", "Safar", "Rabiulawal", "Rabiulakhir", "Jamadilawal", "Jamadilakhir", "Rejab", "Syaaban", "Ramadan", "Syawal", "Zulkaedah", "Zulhijah"],
};

/** "1448-06-18" → "18 Jamadilakhir 1448H". */
export function formatHijri(value: string, lang: "en" | "ms"): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return "";
  const month = HIJRI_MONTHS[lang][Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${m[1]}H` : "";
}

/* ---------- Qiblah ---------- */

export const KAABA = { lat: 21.422487, lng: 39.826206 };
const rad = (d: number) => (d * Math.PI) / 180;

/** Bearing from true north (0–360°) to the Kaaba. */
export function qiblahBearing(lat: number, lng: number): number {
  const p1 = rad(lat), p2 = rad(KAABA.lat), dl = rad(KAABA.lng - lng);
  const b = (Math.atan2(Math.sin(dl), Math.cos(p1) * Math.tan(p2) - Math.sin(p1) * Math.cos(dl)) * 180) / Math.PI;
  return (b + 360) % 360;
}

/** Great-circle distance to the Kaaba in kilometres. */
export function distanceToKaaba(lat: number, lng: number): number {
  const dLat = rad(KAABA.lat - lat), dLng = rad(KAABA.lng - lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

/* ---------- Makkah & Madinah ---------- */

export const HOLY_CITIES = [
  { key: "makkah", en: "Makkah", ms: "Makkah", lat: 21.4225, lng: 39.8262 },
  { key: "madinah", en: "Madinah", ms: "Madinah", lat: 24.4672, lng: 39.6111 },
] as const;

/**
 * Zohor (local solar noon) for a city on UTC+3, as an absolute moment.
 * Uses the equation of time; accurate to about a minute.
 */
export function noonUTC3(now: Date, lng: number): Date {
  const local = new Date(now.getTime() + 3 * 3600_000);
  const y = local.getUTCFullYear(), m = local.getUTCMonth(), d = local.getUTCDate();
  const jd = Date.UTC(y, m, d, 12) / 86_400_000 + 2440587.5;
  const D = jd - 2451545.0;
  const g = ((357.529 + 0.98560028 * D) % 360) * (Math.PI / 180);
  const q = (280.459 + 0.98564736 * D) % 360;
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * (Math.PI / 180);
  const e = (23.439 - 0.00000036 * D) * (Math.PI / 180);
  const RA = ((Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) * 180) / Math.PI / 15 + 24) % 24;
  let eqt = q / 15 - RA;
  eqt = ((eqt + 12) % 24 + 24) % 24 - 12;
  const hours = 12 + 3 - lng / 15 - eqt; // local clock hours on UTC+3
  const minutes = Math.ceil(hours * 60);
  return new Date(Date.UTC(y, m, d, 0, minutes) - 3 * 3600_000);
}
