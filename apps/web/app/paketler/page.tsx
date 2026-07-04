import Link from "next/link";
import {
  BookOpenCheck,
  Boxes,
  Check,
  Crown,
  ExternalLink,
  Home,
  Phone,
  ScanLine,
  ShieldCheck,
  Smartphone,
  WalletCards,
  Wifi,
} from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { PlanModuleOrder } from "@/components/PlanModuleOrder";
import { PublicPanelLink } from "@/components/PublicPanelLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { callLink } from "@/lib/contact";
import { hardwareOptions } from "@/lib/content/hardware";
import { plans } from "@/lib/content/plans";

export const metadata = {
  title: "Paketler | Buneka",
  description: "Buneka lisans paketlerinin tüm özelliklerini karşılaştırın.",
};

const PLAN_CODES: Record<string, "PRICE" | "CASH" | "STOCK" | "PATRON"> = {
  "Buneka Fiyat": "PRICE",
  "Buneka Kasa": "CASH",
  "Buneka Stok": "STOCK",
  "Buneka Patron": "PATRON",
};

const PLAN_ICONS: Record<string, typeof ScanLine> = {
  PRICE: ScanLine,
  CASH: WalletCards,
  STOCK: Boxes,
  PATRON: Crown,
};

const PLAN_HIGHLIGHTS: Record<string, string[]> = {
  PRICE: [
    "Barkodla fiyat sorgulama",
    "Hızlı ürün ekleme",
    "TCMB kuruyla USD fiyat girişi",
    "PC barkod okuyucu hediyeli",
    "Android el terminali opsiyonu",
    "Toplu fiyat güncelleme",
    "Sorgu raporu",
  ],
  CASH: [
    "Fiyat sorgulama paketinin tümü",
    "Satış Yapıldı kaydı",
    "Günlük kasa raporu",
    "En çok sorgulanan ürün",
    "PC barkod okuyucu hediyeli",
    "Android el terminali opsiyonu",
    "Sepetli çoklu ürün satışı",
  ],
  STOCK: [
    "Kasa paketinin tümü",
    "Stokta kalan / minimum stok uyarısı",
    "Stok giriş-çıkış hareketleri",
    "Kar / marj görünürlüğü",
    "PC barkod okuyucu hediyeli",
    "Android el terminali opsiyonu",
    "Detaylı raporlar",
  ],
  PATRON: [
    "Stok paketinin tümü",
    "Çoklu cihaz senkronizasyonu",
    "Kampanya erişimi",
    "Haftalık/aylık özet raporlar",
    "Tüm ek modüller aktif",
    "PC barkod okuyucu hediyeli",
    "Android el terminali opsiyonu",
    "Patron görünümü",
  ],
};

export default function PaketlerPage() {
  return (
    <main className="package-page-shell relative flex min-h-screen w-full flex-col overflow-x-hidden text-[color:var(--home-ink)]">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />

      <header className="relative z-10 grid shrink-0 gap-3 px-4 py-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <BunekaMark size={26} className="shrink-0" />
            <BunekaWordmark className="whitespace-nowrap text-xs text-[color:var(--home-ink)] sm:text-sm" />
          </Link>
          <ThemeToggle className="shrink-0 border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:hidden" />
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/" className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]">
            <Home size={14} /> Ana Menü
          </Link>
          <PublicPanelLink
            authenticatedLabel="Yönetim Platformu"
            className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex"
          />
          <Link href="/kullanici-rehberi" className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] lg:flex">
            <BookOpenCheck size={14} /> Rehber
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:flex">
            <ShieldCheck size={12} /> Yıllık lisans · Şeffaf fiyat
          </span>
          <BunekaNedirButton />
          <ThemeToggle className="hidden border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex" />
        </div>
        <PublicPanelLink
          iconSize={17}
          className="cta-primary-animated inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[color:var(--home-glow)] to-emerald-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_36px_rgba(62,207,142,0.18)] sm:hidden"
        />
      </header>

      <div className="relative z-10 grid gap-9 px-3 pb-24 sm:px-6 sm:pb-8">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight md:text-4xl">
            Hangi pakette ne var, tek bakışta.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--home-muted)]">
            Finansal netlikte paket karşılaştırması: yıllık fiyat, destek ve modül seçenekleri aynı tabloda.
          </p>
        </div>

        <section className="grid gap-4 rounded-2xl border border-emerald-400/20 bg-[#050505]/92 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.25fr] lg:p-5">
          <div className="flex gap-4">
            <div className="relative hidden h-48 w-32 shrink-0 rounded-[1.65rem] border border-emerald-300/35 bg-neutral-950 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:block">
              <div className="h-full rounded-[1.2rem] border border-white/10 bg-gradient-to-b from-slate-900 via-neutral-950 to-black p-3">
                <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-white/20" />
                <div className="grid h-28 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 via-sky-300 to-amber-300 text-slate-950">
                  <ScanLine size={34} />
                </div>
                <div className="mt-3 grid gap-1.5">
                  <span className="h-1.5 rounded-full bg-emerald-300/70" />
                  <span className="h-1.5 w-2/3 rounded-full bg-white/20" />
                  <span className="h-1.5 w-1/2 rounded-full bg-amber-300/70" />
                </div>
              </div>
              <span className="absolute -right-2 top-16 h-8 w-1 rounded-full bg-amber-300" />
            </div>
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">
                <Smartphone size={13} /> Donanım teslim seçeneği
              </p>
              <h2 className="font-display mt-3 text-2xl font-black tracking-tight text-[color:var(--home-ink)]">
                Barkod okuyucu hediye, Android el terminali opsiyonel.
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--home-muted)]">
                Standart kurulumda bilgisayara bağlanan barkod okuyucu ücretsiz sunulur. İsteyen müşteriye Buneka,
                Android Wi-Fi + Bluetooth el terminali ile teslim edilebilir.
              </p>
              <div className="mt-3 grid gap-2 text-xs font-bold text-[color:var(--home-ink)] sm:grid-cols-2">
                <span className="rounded-lg border border-[color:var(--home-border)] px-3 py-2">
                  {hardwareOptions.standardScanner.label}:{" "}
                  <b className="text-[color:var(--home-glow)]">{hardwareOptions.standardScanner.priceLabel}</b>
                </span>
                <span className="rounded-lg border border-amber-300/35 bg-amber-300/10 px-3 py-2">
                  {hardwareOptions.androidTerminal.model}:{" "}
                  <b className="text-amber-200">{hardwareOptions.androidTerminal.livePriceLabel}</b>
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-xl border border-[color:var(--home-border)] bg-black/10 p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">Özellikler</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {hardwareOptions.androidTerminal.specs.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--home-border)] px-3 py-2 text-[11px] font-bold text-[color:var(--home-ink)]"
                  >
                    <Wifi size={13} className="shrink-0 text-[color:var(--home-glow)]" /> {spec}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-amber-200">Canlı fiyat kontrolü</p>
              <div className="mt-2 grid gap-1.5 text-[11px] font-semibold leading-5 text-[color:var(--home-muted)]">
                {hardwareOptions.androidTerminal.marketNotes.map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
              <a
                href={hardwareOptions.androidTerminal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-black text-[color:var(--home-glow)]"
              >
                Güncel internet fiyatını kontrol et <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const code = PLAN_CODES[plan.name];
            const Icon = PLAN_ICONS[code];
            const isPremium = code === "PATRON";

            return (
              <article
                key={plan.name}
                  className={`relative flex min-h-[660px] flex-col overflow-hidden rounded-2xl border shadow-[0_22px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl ${
                  isPremium
                    ? "border-amber-300/50 bg-[#050505] text-white [--home-border:rgba(242,184,75,0.26)] [--home-glow:#F2B84B] [--home-ink:#F8FAFC] [--home-muted:#CBD5E1]"
                    : "border-emerald-400/22 bg-[#050505]/94 text-white [--home-border:rgba(62,207,142,0.20)] [--home-glow:#3ECF8E] [--home-ink:#F8FAFC] [--home-muted:#B7C3D0]"
                }`}
              >
                <div className={`flex h-8 items-center justify-center px-3 text-center text-[10px] font-black uppercase tracking-wide ${
                  plan.badge
                    ? "bg-gradient-to-r from-emerald-600 to-[color:var(--home-glow)] text-slate-950"
                    : "bg-white/5 text-transparent"
                }`}>
                  {plan.badge || "Buneka"}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--home-glow)]/12 text-[color:var(--home-glow)] ring-1 ring-[color:var(--home-border)]">
                      <Icon size={20} />
                    </div>
                    <h2 className="font-display text-lg font-bold text-[color:var(--home-ink)]">{plan.name}</h2>
                  </div>

                  <div className="mt-5">
                    <p className="text-[11px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">Yıllık lisans</p>
                    <p className="mt-1 text-4xl font-black tracking-tight text-[color:var(--home-glow)]">
                      {plan.price}
                      <span className="ml-1 text-xs font-semibold text-[color:var(--home-muted)]">/yıl</span>
                    </p>
                    <p className="mt-1 min-h-8 text-[11px] font-semibold leading-4 text-[color:var(--home-muted)]">
                      Kurulum, geçiş ve temel eğitim desteğiyle.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-1.5 rounded-xl border border-[color:var(--home-border)] bg-white/[0.03] px-3 py-3 text-[11px] font-bold text-[color:var(--home-ink)]">
                    <span>Ücretsiz ilk kurulum</span>
                    <span>PC barkod okuyucu hediyeli</span>
                  </div>

                  <div className="my-4 h-px bg-[color:var(--home-border)]" />

                  <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">
                    Pakete dahil
                  </p>
                  <ul className="flex-1 space-y-2 pr-1">
                    {PLAN_HIGHLIGHTS[code].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs leading-snug text-[color:var(--home-ink)]">
                        <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <PlanModuleOrder planName={plan.name} planPrice={plan.price} />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <footer className="relative z-10 shrink-0 px-3 pb-3 sm:px-6">
        <div className="glow-border flex flex-col items-center justify-between gap-3 rounded-xl bg-[color:var(--home-surface)]/70 p-4 backdrop-blur-xl sm:flex-row">
          <div>
            <p className="font-display text-sm font-bold sm:text-base">Kararsız mısınız? Hemen arayın, birlikte karar verelim.</p>
            <p className="text-xs text-[color:var(--home-muted)]">İşletmenizi dinleyip size en uygun paketi öneririz.</p>
          </div>
          <a
            href={callLink()}
            className="glow-border inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-[color:var(--home-ink)]"
          >
            <Phone size={16} className="text-emerald-400" /> Hemen Arayın
          </a>
        </div>
      </footer>
    </main>
  );
}
