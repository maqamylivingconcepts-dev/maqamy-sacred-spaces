import { createFileRoute } from "@tanstack/react-router";
import {
  Check, CreditCard, FileText, Hand, Landmark, Lock, Mail, Package, PenLine,
  ShieldCheck, Smartphone, Trash2, Truck, UserRound, Users, type LucideIcon,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/maqamy/site-chrome";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MAQAMY Living Concepts" },
      { name: "description", content: "How MAQAMY Living Concepts collects, uses and protects your personal data under Malaysia's Personal Data Protection Act 2010." },
      { property: "og:title", content: "Privacy Policy — MAQAMY Living Concepts" },
      { property: "og:description", content: "What we collect, why, who can see it, how long we keep it, and how to exercise your rights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const CONTACT_EMAIL = "maqamylivingconcepts@gmail.com";
/** Registered name and SSM number, e.g. "MAQAMY Living Concepts (SSM 123456-X)". */
const COMPANY_NAME = "MAQAMY Living Concepts";
const LAST_UPDATED = { en: "22 November 2026", ms: "22 November 2026" };

type Bi = { en: string; ms: string };
type Item = { icon: LucideIcon; title: Bi; text: Bi };

const promises: Item[] = [
  { icon: ShieldCheck, title: { en: "Never sold", ms: "Tidak dijual" }, text: { en: "Your details are never sold or used for advertising.", ms: "Butiran anda tidak dijual atau digunakan untuk pengiklanan." } },
  { icon: CreditCard, title: { en: "Cards stay with Stripe", ms: "Kad kekal dengan Stripe" }, text: { en: "We never see or store your card number.", ms: "Kami tidak melihat atau menyimpan nombor kad anda." } },
  { icon: Trash2, title: { en: "Yours to remove", ms: "Hak anda untuk dipadam" }, text: { en: "Ask us to delete your data at any time.", ms: "Minta kami memadam data anda bila-bila masa." } },
];

const collected: Item[] = [
  { icon: UserRound, title: { en: "Your account", ms: "Akaun anda" }, text: { en: "Name, email, phone number, delivery address and an encrypted password.", ms: "Nama, e-mel, nombor telefon, alamat penghantaran dan kata laluan yang disulitkan." } },
  { icon: Package, title: { en: "Your orders", ms: "Pesanan anda" }, text: { en: "The collections and packages you choose, order number, invoice and delivery details.", ms: "Koleksi dan pakej pilihan anda, nombor pesanan, invois dan butiran penghantaran." } },
  { icon: CreditCard, title: { en: "Your payment", ms: "Bayaran anda" }, text: { en: "Only whether it was paid and the amount. Card details go straight to Stripe.", ms: "Hanya status dan jumlah bayaran. Butiran kad terus ke Stripe." } },
  { icon: Smartphone, title: { en: "Your device", ms: "Peranti anda" }, text: { en: "Your language choice and sign-in, remembered in your browser.", ms: "Pilihan bahasa dan log masuk anda, diingati dalam pelayar anda." } },
];

const uses: Bi[] = [
  { en: "Create your account and keep your cart saved", ms: "Mencipta akaun dan menyimpan troli anda" },
  { en: "Process your order, payment and invoice", ms: "Memproses pesanan, bayaran dan invois anda" },
  { en: "Deliver and install your prayer space", ms: "Menghantar dan memasang ruang solat anda" },
  { en: "Send account emails, like a password reset", ms: "Menghantar e-mel akaun, seperti tetapan semula kata laluan" },
  { en: "Keep the records Malaysian law requires", ms: "Menyimpan rekod yang dikehendaki undang-undang Malaysia" },
];

const viewers: Item[] = [
  { icon: UserRound, title: { en: "You", ms: "Anda" }, text: { en: "Only your own profile, cart and orders.", ms: "Hanya profil, troli dan pesanan anda sendiri." } },
  { icon: Users, title: { en: "The MAQAMY team", ms: "Pasukan MAQAMY" }, text: { en: "Authorised staff who prepare and support your order.", ms: "Kakitangan yang diberi kuasa untuk menyediakan dan menyokong pesanan anda." } },
  { icon: CreditCard, title: { en: "Stripe", ms: "Stripe" }, text: { en: "Our payment provider, to process payment securely.", ms: "Penyedia pembayaran kami, untuk memproses bayaran dengan selamat." } },
  { icon: Truck, title: { en: "Delivery partners", ms: "Rakan penghantaran" }, text: { en: "Only the details needed to deliver and install your order.", ms: "Hanya butiran yang diperlukan untuk menghantar dan memasang pesanan anda." } },
  { icon: Landmark, title: { en: "Authorities", ms: "Pihak berkuasa" }, text: { en: "Only when the law requires it.", ms: "Hanya apabila dikehendaki undang-undang." } },
];

const rights: Item[] = [
  { icon: FileText, title: { en: "See it", ms: "Melihatnya" }, text: { en: "Ask for a copy of the data we hold about you.", ms: "Minta salinan data yang kami simpan tentang anda." } },
  { icon: PenLine, title: { en: "Correct it", ms: "Membetulkannya" }, text: { en: "Fix anything inaccurate or out of date.", ms: "Betulkan apa-apa yang tidak tepat atau lapuk." } },
  { icon: Trash2, title: { en: "Delete it", ms: "Memadamnya" }, text: { en: "Close your account and erase your data, apart from records the law requires.", ms: "Tutup akaun dan padam data anda, kecuali rekod yang wajib disimpan." } },
  { icon: Hand, title: { en: "Say no", ms: "Menolak" }, text: { en: "Withdraw consent for any optional use.", ms: "Tarik balik persetujuan bagi sebarang penggunaan pilihan." } },
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`type-label text-[11px] font-semibold uppercase tracking-[0.25em] ${light ? "text-brand-gold-soft" : "text-brand-gold"}`}>{children}</p>;
}

function IconBadge({ icon: Icon, light = false }: { icon: LucideIcon; light?: boolean }) {
  return (
    <span className={`flex size-11 items-center justify-center rounded-full border ${light ? "border-brand-gold-soft/40 text-brand-gold-soft" : "border-brand-gold/40 bg-brand-cream text-brand-gold"}`}>
      <Icon className="size-5" strokeWidth={1.5} />
    </span>
  );
}

function PrivacyPage() {
  const { itemCount, userEmail, signOut } = useCart();
  const { t } = useLang();
  const b = (text: Bi) => t(text.en, text.ms);

  return (
    <main className="min-h-screen bg-brand-cream text-brand-forest">
      <SiteHeader tone="dark" itemCount={itemCount} userEmail={userEmail} onSignOut={signOut} />

      {/* Welcome */}
      <section className="px-5 pb-16 pt-16 text-center sm:px-8 lg:pb-24 lg:pt-24">
        <div className="maqamy-arrival mx-auto max-w-3xl">
          <Eyebrow>{t("Privacy policy", "Dasar privasi")}</Eyebrow>
          <h1 className="type-heading mt-5 text-balance font-display text-4xl font-light leading-[1.1] sm:text-6xl">
            {t("Your privacy,", "Privasi anda,")} <span className="italic text-brand-gold">{t("held with care.", "dijaga dengan teliti.")}</span>
          </h1>
          <p className="type-body mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-forest/70">{t("A home is a place of trust. Here, in plain words, is what we keep when you shop with MAQAMY, why we keep it, and the choices that are always yours.", "Rumah ialah tempat amanah. Di sini, dengan bahasa mudah, ialah apa yang kami simpan apabila anda membeli dengan MAQAMY, sebabnya, dan pilihan yang sentiasa milik anda.")}</p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-brand-forest/50">{t("Last updated", "Kemas kini terakhir")} · {b(LAST_UPDATED)}</p>
        </div>
        <div className="maqamy-arrival-late mx-auto mt-14 grid max-w-5xl gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-brand-gold/25">
          {promises.map((p) => (
            <div key={p.title.en} className="flex flex-col items-center px-6">
              <IconBadge icon={p.icon} />
              <h2 className="mt-4 font-display text-xl">{b(p.title)}</h2>
              <p className="mt-2 max-w-60 text-sm leading-6 text-brand-forest/65">{b(p.text)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we collect */}
      <section className="bg-brand-mist px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <Eyebrow>01 · {t("What we collect", "Apa yang kami kumpul")}</Eyebrow>
            <h2 className="type-heading mt-4 font-display text-3xl font-light sm:text-4xl">{t("Only what your order needs.", "Hanya yang diperlukan pesanan anda.")}</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collected.map((c) => (
              <article key={c.title.en} className="group bg-brand-cream p-6 shadow-[0_14px_40px_-30px_rgb(0_0_0/0.35)] transition-transform duration-500 hover:-translate-y-1">
                <IconBadge icon={c.icon} />
                <h3 className="mt-6 font-display text-xl">{b(c.title)}</h3>
                <p className="type-body mt-3 text-sm leading-6 text-brand-forest/70">{b(c.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we use it */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow>02 · {t("How we use it", "Cara kami menggunakannya")}</Eyebrow>
            <h2 className="type-heading mt-4 font-display text-3xl font-light sm:text-4xl">{t("To bring your space home.", "Untuk membawa ruang anda pulang.")}</h2>
            <p className="type-body mt-5 text-base leading-7 text-brand-forest/70">{t("Nothing more. We don't build profiles, run ads or pass your details to marketers.", "Tidak lebih daripada itu. Kami tidak membina profil, menjalankan iklan atau menyerahkan butiran anda kepada pemasar.")}</p>
          </div>
          <ul className="divide-y divide-brand-gold/20 border-y border-brand-gold/20">
            {uses.map((u) => (
              <li key={u.en} className="flex items-center gap-4 py-5 text-base sm:text-lg">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold"><Check className="size-4" /></span>
                {b(u)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who can see it */}
      <section className="bg-brand-mist px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>03 · {t("Who can see it", "Siapa yang boleh melihatnya")}</Eyebrow>
            <h2 className="type-heading mt-4 font-display text-3xl font-light sm:text-4xl">{t("A small, trusted circle.", "Kalangan kecil yang dipercayai.")}</h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-brand-gold/20 bg-brand-gold/20 sm:grid-cols-2 lg:grid-cols-5">
            {viewers.map((v) => (
              <div key={v.title.en} className="flex flex-col items-center bg-brand-cream px-5 py-8 text-center">
                <IconBadge icon={v.icon} />
                <h3 className="mt-4 font-display text-lg">{b(v.title)}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-forest/65">{b(v.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keeping it safe */}
      <section className="bg-brand-forest px-5 py-20 text-brand-cream sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow light>04 · {t("Keeping it safe", "Menjaga keselamatannya")}</Eyebrow>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <IconBadge icon={Lock} light />
              <h3 className="mt-6 font-display text-2xl font-light sm:text-3xl">{t("Protected", "Dilindungi")}</h3>
              <p className="type-body mt-4 text-base leading-7 text-brand-cream/75">{t("Stored in a secure, access-controlled database and sent over encrypted connections. Team access is limited to named staff and checked every time. Our sign-up check is a simple click — nothing is sent to any AI service.", "Disimpan dalam pangkalan data selamat dengan kawalan akses dan dihantar melalui sambungan yang disulitkan. Akses pasukan terhad kepada kakitangan yang dinamakan dan disemak setiap kali. Semakan pendaftaran kami hanya satu klik — tiada apa dihantar kepada perkhidmatan AI.")}</p>
            </div>
            <div>
              <IconBadge icon={FileText} light />
              <h3 className="mt-6 font-display text-2xl font-light sm:text-3xl">{t("Kept only as long as needed", "Disimpan hanya selama perlu")}</h3>
              <p className="type-body mt-4 text-base leading-7 text-brand-cream/75">{t("Your account stays while it's open. Orders and invoices are kept only as long as Malaysian law requires, then deleted.", "Akaun anda kekal selagi dibuka. Pesanan dan invois disimpan hanya selama yang dikehendaki undang-undang Malaysia, kemudian dipadam.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your rights */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <Eyebrow>05 · {t("Your rights", "Hak anda")}</Eyebrow>
            <h2 className="type-heading mt-4 font-display text-3xl font-light sm:text-4xl">{t("Always yours to decide.", "Sentiasa hak anda untuk memutuskan.")}</h2>
            <p className="type-body mt-5 text-base leading-7 text-brand-forest/70">{t("Under Malaysia's Personal Data Protection Act 2010 you can, at any time:", "Di bawah Akta Perlindungan Data Peribadi 2010 Malaysia, anda boleh pada bila-bila masa:")}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rights.map((r) => (
              <article key={r.title.en} className="border-t-2 border-brand-gold bg-card p-6">
                <r.icon className="size-6 text-brand-gold" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-2xl font-light">{b(r.title)}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-forest/70">{b(r.text)}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm text-brand-forest/60">{t("We reply within 21 days, as the PDPA requires.", "Kami membalas dalam tempoh 21 hari, seperti yang dikehendaki PDPA.")}</p>
        </div>
      </section>

      {/* Contact */}
      <section className="px-5 pb-24 sm:px-8 lg:pb-32">
        <div className="mx-auto max-w-3xl border border-brand-gold/30 bg-card px-6 py-12 text-center shadow-[0_24px_60px_-44px_rgb(0_0_0/0.4)] sm:px-12">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-forest text-brand-gold-soft"><Mail className="size-6" strokeWidth={1.5} /></span>
          <h2 className="type-heading mt-6 font-display text-3xl font-light sm:text-4xl">{t("Questions? We're here.", "Ada soalan? Kami di sini.")}</h2>
          <p className="type-body mx-auto mt-4 max-w-md text-base leading-7 text-brand-forest/70">{t("Write to us about your data at any time. Please include the email address on your account.", "Hubungi kami tentang data anda bila-bila masa. Sila sertakan alamat e-mel akaun anda.")}</p>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20request`} className="mt-6 inline-block break-all border-b border-brand-gold pb-1 font-display text-xl text-brand-forest hover:text-brand-gold">{CONTACT_EMAIL}</a>
          <p className="mx-auto mt-10 max-w-lg text-xs leading-5 text-brand-forest/50">{t(`${COMPANY_NAME} is responsible for your personal data. If this policy changes, we'll update the date at the top of this page.`, `${COMPANY_NAME} bertanggungjawab ke atas data peribadi anda. Jika dasar ini berubah, kami akan mengemas kini tarikh di bahagian atas halaman ini.`)}</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
