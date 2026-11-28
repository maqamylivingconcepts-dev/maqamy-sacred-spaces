import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { KUALA_LUMPUR, distanceToKaaba, nextPrayer, prayerTimes, qiblahBearing } from "./prayer-times";

const hm = (d: Date) => d.getHours() * 60 + d.getMinutes();
const at = (h: number, m: number) => h * 60 + m;

describe("Qiblah", () => {
  test("Kuala Lumpur faces about 292.5° from north, roughly 7,000 km away", () => {
    const b = qiblahBearing(KUALA_LUMPUR.lat, KUALA_LUMPUR.lng);
    assert.ok(Math.abs(b - 292.5) < 0.5, `bearing ${b}`);
    const km = distanceToKaaba(KUALA_LUMPUR.lat, KUALA_LUMPUR.lng);
    assert.ok(km > 6900 && km < 7100, `distance ${km}`);
  });
  test("London faces about 119° from north", () => {
    assert.ok(Math.abs(qiblahBearing(51.5074, -0.1278) - 119) < 1);
  });
});

describe("Prayer times (Kuala Lumpur, UTC+8)", () => {
  // JAKIM WLY01 published times are within a few minutes of these checks.
  const times = prayerTimes(new Date(2026, 10, 28), KUALA_LUMPUR.lat, KUALA_LUMPUR.lng, 8);
  test("are in order through the day", () => {
    const seq = [times.fajr, times.sunrise, times.dhuhr, times.asr, times.maghrib, times.isha].map(hm);
    assert.deepEqual([...seq].sort((a, b) => a - b), seq);
  });
  test("fall within a few minutes of the published Kuala Lumpur timetable", () => {
    const within = (d: Date, h: number, m: number, tol = 5) => assert.ok(Math.abs(hm(d) - at(h, m)) <= tol, `${d.toTimeString().slice(0, 5)} vs ${h}:${m}`);
    within(times.fajr, 5, 51);
    within(times.dhuhr, 12, 59);
    within(times.asr, 16, 21);
    within(times.maghrib, 18, 58);
    within(times.isha, 20, 12);
  });
  test("next prayer rolls over to tomorrow's Fajr after Isha", () => {
    const late = new Date(2026, 10, 28, 23, 30);
    assert.equal(nextPrayer(late, KUALA_LUMPUR.lat, KUALA_LUMPUR.lng).key, "fajr");
    const noon = new Date(2026, 10, 28, 12, 0);
    assert.equal(nextPrayer(noon, KUALA_LUMPUR.lat, KUALA_LUMPUR.lng).key, "dhuhr");
  });
});
