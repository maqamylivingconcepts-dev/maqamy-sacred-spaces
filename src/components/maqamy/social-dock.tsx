import { Link } from "@tanstack/react-router";
import { AtSign, Clock, Compass, Facebook, Instagram, Smartphone, X, Youtube, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";

import { useLang } from "@/lib/i18n";
import { QIBLAH_ENABLED } from "@/lib/waktu-solat";

/* MAQAMY contact channels. */
const WHATSAPP_NUMBER = "60186693631";
const FACEBOOK_URL = "https://www.facebook.com/people/Maqamy-Living-Concepts/61596819247001/";
const INSTAGRAM_URL = "https://www.instagram.com/maqamylivingconcepts/";
const THREADS_URL = "https://www.threads.com/@maqamylivingconcepts";
const YOUTUBE_URL = "https://www.youtube.com/@MaqamyLC";

/** WhatsApp glyph (Simple Icons, CC0). */
function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type Channel = { key: string; label: string; href: string; icon: LucideIcon | ComponentType<{ className?: string }> };

/** Floating contact button: Prayer times and Qiblah, then the social links, slide up above it. */
export function SocialDock() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onPointer = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [open]);

  const message = t("Hi MAQAMY, I'd like to know more about your collections.", "Hai MAQAMY, saya ingin tahu lebih lanjut tentang koleksi anda.");
  const channels: Channel[] = [
    { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, icon: WhatsAppGlyph },
    { key: "facebook", label: "Facebook", href: FACEBOOK_URL, icon: Facebook },
    { key: "instagram", label: "Instagram", href: INSTAGRAM_URL, icon: Instagram },
    { key: "threads", label: "Threads", href: THREADS_URL, icon: AtSign },
    { key: "youtube", label: "YouTube", href: YOUTUBE_URL, icon: Youtube },
  ];
  const tools: { to: "/waktu-solat" | "/qiblah"; label: string; icon: LucideIcon }[] = [
    { to: "/waktu-solat", label: t("Prayer times", "Waktu solat"), icon: Clock },
    { to: "/qiblah", label: t("Qiblah", "Kiblat"), icon: Compass },
  ];

  return (
    <div ref={root} className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3 sm:bottom-8 sm:right-8">
      <ul id="maqamy-social-links" aria-hidden={!open} className="flex flex-col items-center gap-3">
        {/* Prayer times and Qiblah (gold) sit on top, above the social links. */}
        {[...tools.map((tool) => ({ kind: "tool" as const, ...tool })), ...channels.map((c) => ({ kind: "link" as const, ...c }))].map((item, i, all) => {
          const Icon = item.icon;
          const delay = `${(all.length - 1 - i) * 40}ms`;
          const disabled = item.kind === "tool" && item.to === "/qiblah" && !QIBLAH_ENABLED;
          const circle = disabled
            ? "bg-brand-forest text-brand-gold-soft/40"
            : item.kind === "tool"
              ? "bg-brand-gold text-brand-forest"
              : "bg-brand-forest text-brand-gold-soft";
          const face = (
            <span className={`relative flex size-12 items-center justify-center rounded-full ${circle} ring-1 ring-brand-gold/50 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.45)] ${disabled ? "" : "group-hover:scale-105"}`}>
              <Icon className="size-5" />
              {disabled ? <span aria-hidden="true" className="absolute h-0.5 w-9 rotate-45 rounded-full bg-brand-gold-soft/80" /> : null}
            </span>
          );
          return (
            <li
              key={item.kind === "tool" ? item.to : item.key}
              style={{ transitionDelay: open ? delay : "0ms" }}
              className={`transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
            >
              {disabled ? (
                <span role="img" aria-label={`${item.label} — ${t("coming soon", "akan datang")}`} title={t("Coming soon", "Akan datang")} className="flex cursor-not-allowed">{face}</span>
              ) : item.kind === "tool" ? (
                <Link to={item.to} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} aria-label={item.label} title={item.label} className="group flex">{face}</Link>
              ) : (
                <a href={item.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} aria-label={item.label} title={item.label} className="group flex">{face}</a>
              )}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="maqamy-social-links"
        aria-label={open ? t("Close contact links", "Tutup pautan hubungan") : t("Contact MAQAMY", "Hubungi MAQAMY")}
        onClick={() => setOpen((v) => !v)}
        className="flex size-14 items-center justify-center rounded-full bg-brand-forest text-brand-gold-soft ring-1 ring-brand-gold/50 shadow-[0_10px_30px_-8px_rgb(0_0_0/0.45)] hover:scale-105"
      >
        <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>{open ? <X className="size-6" /> : <Smartphone className="size-6" />}</span>
      </button>
    </div>
  );
}
