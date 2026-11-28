# Qiblah & Watch (in discussion)

Not live. Plan agreed so far:

- Tapping the phone contact button also slides **Watch** and **Qiblah** icons
  out **to the left**; social icons still slide up.
- **Watch** opens a new page (`/waktu-solat` proposed): live clock, Gregorian
  and Hijri date, Subuh · Syuruk · Zohor · Asar · Maghrib · Isyak, next prayer
  highlighted with a countdown; Kuala Lumpur until "Use my location".
- **Qiblah** opens a new page (`/qiblah`): gold compass needle to the Kaaba on
  phones (device compass), degrees from north + distance on desktop.

## Open decisions

1. Prayer-time source: official JAKIM zone times (recommended for Malaysia)
   vs on-device calculation (worldwide, may differ by minutes).
2. Page names: `waktu-solat` / `qiblah` or English.
3. Icon order to the left.

## Draft

`draft/prayer-times.ts` — Qiblah bearing/distance (verified: KL ≈ 292.5°,
~7,000 km) and an on-device prayer-time calculation (Fajr 20°, Isha 18°,
Shafi'i Asr, +2 min margin). The calculation is **not yet verified** against
the official JAKIM timetable — `draft/prayer-times.test.ts` has one failing
check against unconfirmed reference times. Do not use for live times until
checked.
