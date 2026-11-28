import { createFileRoute } from "@tanstack/react-router";

import { isZoneCode, normaliseWeek } from "@/lib/waktu-solat";

const SOURCE = "https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=week&zone=";

/** Seven days of official prayer times for one zone, cached for an hour. */
export const Route = createFileRoute("/api/public/waktu-solat")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const zone = new URL(request.url).searchParams.get("zone") ?? "";
        if (!isZoneCode(zone)) return Response.json({ error: "Unknown zone." }, { status: 400 });
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 10_000);
          const res = await fetch(SOURCE + zone, { signal: controller.signal, headers: { accept: "application/json" } });
          clearTimeout(timer);
          if (!res.ok) throw new Error(String(res.status));
          const week = normaliseWeek(zone, await res.json());
          if (!week.days.length) throw new Error("empty");
          return Response.json(week, { headers: { "cache-control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400" } });
        } catch {
          return Response.json({ error: "Prayer times are temporarily unavailable." }, { status: 502, headers: { "cache-control": "no-store" } });
        }
      },
    },
  },
});
