# Qiblah & Watch

**Built** (on branch `claude/maqamy-website-j59osq`; goes live once merged to `main`).

- Tapping the phone contact button slides up, top to bottom: **Prayer times**
  (gold clock), **Qiblah** (gold compass), then WhatsApp, Facebook, Instagram,
  Threads and YouTube.
- Both screens use the **MAQAMY app interface** (from the PC app design):
  deep-green app frame with MAQAMY logo, BM/EN pill and LOCATION (tap to use
  location or pick a zone), and a **Qiblah | Watch** tab bar at the bottom.
- `/qiblah` — gold ornate compass with degree ring, N/E/S/W, Kaaba needle and
  centre bearing; live on phones ("You're facing the Qiblah" + vibration);
  Qiblah · Heading · Distance strip.
- `/waktu-solat` (Watch) — gold watch face with Makkah and Madinah sub-dials and
  Hijri day window; Makkah/Madinah time with Zohor; large live clock, Hijri and
  Gregorian date, next prayer with live countdown; Subuh · Syuruk · Zohor ·
  Asar · Maghrib · Isyak (Malay names in both languages).

Official zone times are fetched by our own `/api/public/waktu-solat` endpoint
(cached one hour); the site never names the source. The earlier on-device
calculation draft was dropped — it ran up to 9 minutes early for Subuh.
