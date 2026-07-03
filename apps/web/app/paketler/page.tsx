import Link from "next/link";
import {
  BookOpenCheck,
  Boxes,
  Check,
  Crown,
  Home,
  LayoutDashboard,
  LogIn,
  Phone,
  ScanLine,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { PlanModuleOrder } from "@/components/PlanModuleOrder";
import { ThemeToggle } from "@/components/ThemeToggle";
import { callLink } from "@/lib/contact";
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
    "Barkod okuyucu desteği ücretsiz",
    "Toplu fiyat güncelleme",
    "Sorgu raporu",
  ],
  CASH: [
    "Fiyat sorgulama paketinin tümü",
    "Satış Yapıldı kaydı",
    "Günlük kasa raporu",
    "En çok sorgulanan ürün",
    "Barkod okuyucu desteği ücretsiz",
    "Sepetli çoklu ürün satışı",
  ],
  STOCK: [
    "Kasa paketinin tümü",
    "Stokta kalan / minimum stok uyarısı",
    "Stok giriş-çıkış hareketleri",
    "Kar / marj görünürlüğü",
    "Barkod okuyucu desteği ücretsiz",
    "Detaylı raporlar",
  ],
  PATRON: [
    "Stok paketinin tümü",
    "Çoklu cihaz senkronizasyonu",
    "Kampanya erişimi",
    "Haftalık/aylık özet raporlar",
    "Tüm ek modüller aktif",
    "Barkod okuyucu desteği ücretsiz",
    "Patron görünümü",
  ],
};

export default function PaketlerPage() {
  return (
    <main className="home-viewport relative flex min-h-screen w-full flex-col overflow-x-hidden text-[color:var(--home-ink)]">
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
          <Link href="/app" className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex">
            <LayoutDashboard size={14} /> Panele Dön
          </Link>
          <Link href="/kullanici-rehberi" className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] lg:flex">
            <BookOpenCheck size={14} /> Rehber
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:flex">
            <ShieldCheck size={12} /> Yıllık lisans · Şeffaf fiyat
          </span>
          <BunekaNedirButton />
          <ThemeToggle className="hidden border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex" />
        </div>
        <Link
          href="/login"
          className="cta-primary-animated inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.18)] sm:hidden"
        >
          <LogIn size={17} /> Sisteme Giriş Yap
        </Link>
      </header>

      <div className="relative z-10 grid flex-1 gap-7 px-3 pb-24 sm:px-6 sm:pb-5">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight md:text-4xl">
            Hangi pakette ne var, tek bakışta.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--home-muted)]">
            Finansal netlikte paket karşılaştırması: yıllık fiyat, destek ve modül seçenekleri aynı tabloda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const code = PLAN_CODES[plan.name];
            const Icon = PLAN_ICONS[code];
            const isPremium = code === "PATRON";

            return (
              <article
                key={plan.name}
                className={`relative flex min-h-[560px] flex-col overflow-hidden rounded-2xl border shadow-[0_18px_50px_rgba(2,6,23,0.24)] backdrop-blur-xl ${
                  isPremium
                    ? "border-blue-400/45 bg-[#071528] text-white [--home-border:rgba(255,255,255,0.18)] [--home-glow:#22D3EE] [--home-ink:#F8FAFC] [--home-muted:#CBD5E1]"
                    : "border-[color:var(--home-border)] bg-[color:var(--home-surface)]/90"
                }`}
              >
                <div className={`flex h-8 items-center justify-center px-3 text-center text-[10px] font-black uppercase tracking-wide ${
                  plan.badge
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
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

                  <a
                    href={callLink()}
                    className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition-transform hover:scale-[1.01] active:scale-95 ${
                      isPremium
                        ? "bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 text-slate-950"
                        : "bg-slate-950 text-white shadow-[0_12px_24px_rgba(2,6,23,0.18)] dark:bg-white dark:text-slate-950"
                    }`}
                  >
                    Sizi Arayalım <Phone size={15} />
                  </a>

                  <div className="mt-4 grid gap-1.5 text-[11px] font-bold text-[color:var(--home-ink)]">
                    <span>7/24 destek hattı</span>
                    <span>Ücretsiz ilk kurulum</span>
                    <span>Barkod okuyucu desteği ücretsiz</span>
                  </div>

                  <div className="my-4 h-px bg-[color:var(--home-border)]" />

                  <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">
                    Pakete dahil
                  </p>
                  <ul className="flex-1 space-y-2 pr-1">
                    {PLAN_HIGHLIGHTS[code].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs leading-snug text-[color:var(--home-ink)]">
                        <Check size={13} className="mt-0.5 shrink-0 text-blue-400" />
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
