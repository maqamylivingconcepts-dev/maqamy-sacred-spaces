# Qiblah & Watch

**Built** (on branch `claude/maqamy-website-j59osq`; goes live once merged to `main`).

- The phone contact button slides **Prayer times** (clock) and **Qiblah**
  (compass) out to the left in gold; social icons still slide up.
- `/waktu-solat` — live Malaysia clock, Gregorian and Hijri date, Imsak ·
  Subuh · Syuruk · Zohor · Asar · Maghrib · Isyak, next prayer with countdown,
  zone picker (all Malaysian zones) and "Use my location" (nearest zone).
- `/qiblah` — compass with the Kaaba needle; on phones the dial follows the
  device compass and says "You're facing the Qiblah" (with a short vibration);
  on computers it shows degrees from north and distance to Makkah.

Official zone times are fetched by our own `/api/public/waktu-solat` endpoint
(cached one hour); the site never names the source. The earlier on-device
calculation draft was dropped — it ran up to 9 minutes early for Subuh.
