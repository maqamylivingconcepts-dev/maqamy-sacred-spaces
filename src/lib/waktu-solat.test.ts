import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import {
  HOLY_CITIES, ZONES, distanceToKaaba, formatHijri, noonUTC3, malaysiaDate, nearestZone, nextPrayer, normaliseWeek, parseSourceDate, qiblahBearing,
} from "./waktu-solat";

const sample = {
  prayerTime: [
    { hijri: "1448-06-18", date: "28-Nov-2026", imsak: "05:41:00", fajr: "05:51:00", syuruk: "07:02:00", dhuhr: "13:04:00", asr: "16:26:00", maghrib: "19:01:00", isha: "20:15:00" },
    { hijri: "1448-06-19", date: "29-Nov-2026", imsak: "05:41:00", fajr: "05:51:00", syuruk: "07:02:00", dhuhr: "13:04:00", asr: "16:26:00", maghrib: "19:01:00", isha: "20:15:00" },
    { hijri: "1448-06-25", date: "05-Dis-2026", imsak: "05:43:00", fajr: "05:53:00", syuruk: "07:04:00", dhuhr: "13:07:00", asr: "16:29:00", maghrib: "19:04:00", isha: "20:18:00" },
    { date: "broken" },
  ],
};

describe("source data", () => {
  test("reads Malay month abbreviations", () => {
    assert.equal(parseSourceDate("05-Dis-2026"), "2026-12-05");
    assert.equal(parseSourceDate("01-Ogo-2026"), "2026-08-01");
    assert.equal(parseSourceDate("nonsense"), null);
  });
  test("keeps well-formed days and trims seconds", () => {
    const week = normaliseWeek("WLY01", sample);
    assert.equal(week.days.length, 3);
    assert.equal(week.days[0]!.fajr, "05:51");
    assert.equal(week.days[2]!.date, "2026-12-05");
  });
});

describe("next prayer (Malaysia time)", () => {
  const week = normaliseWeek("WLY01", sample);
  test("midday is before Dhuhr", () => {
    const r = nextPrayer(week, new Date("2026-11-28T12:30:00+08:00"));
    assert.equal(r?.key, "dhuhr");
  });
  test("after Isha rolls over to tomorrow's Fajr", () => {
    const r = nextPrayer(week, new Date("2026-11-28T22:00:00+08:00"));
    assert.equal(r?.key, "fajr");
    assert.equal(r?.at.toISOString(), "2026-11-28T21:51:00.000Z");
  });
  test("Malaysian date is used regardless of device time zone", () => {
    assert.equal(malaysiaDate(new Date("2026-11-28T17:00:00Z")), "2026-11-29");
  });
});

describe("zones and Qiblah", () => {
  test("every zone code is unique", () => {
    assert.equal(new Set(ZONES.map((z) => z.code)).size, ZONES.length);
  });
  test("picks sensible nearest zones", () => {
    assert.equal(nearestZone(3.1478, 101.6953).code, "WLY01"); // KLCC
    assert.equal(nearestZone(1.4927, 103.7414).code, "JHR02"); // Johor Bahru
    assert.equal(nearestZone(5.9804, 116.0735).code, "SBH07"); // Kota Kinabalu
    assert.equal(nearestZone(1.5533, 110.3592).code, "SWK08"); // Kuching
    assert.equal(nearestZone(5.4164, 100.3327).code, "PNG01"); // George Town
  });
  test("Kuala Lumpur faces 292°31′ (as published), about 7,000 km", () => {
    assert.ok(Math.abs(qiblahBearing(3.139, 101.6869) - 292.52) < 0.2);
    const km = distanceToKaaba(3.139, 101.6869);
    assert.ok(km > 6900 && km < 7100);
  });
  test("formats the Hijri date", () => {
    assert.equal(formatHijri("1448-06-18", "ms"), "18 Jamadilakhir 1448H");
    assert.equal(formatHijri("1448-06-18", "en"), "18 Jumada al-Akhirah 1448H");
  });
});

describe("Makkah and Madinah Zohor", () => {
  test("Makkah Zohor on 28 Nov 2026 is about 12:09 local time", () => {
    const z = noonUTC3(new Date("2026-11-28T04:00:00Z"), HOLY_CITIES[0].lng);
    const local = new Date(z.getTime() + 3 * 3600_000);
    const mins = local.getUTCHours() * 60 + local.getUTCMinutes();
    assert.ok(Math.abs(mins - (12 * 60 + 9)) <= 2, local.toISOString());
  });
});
