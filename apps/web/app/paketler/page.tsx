import Link from "next/link";
import { Boxes, Check, Crown, Home, LayoutDashboard, Phone, ScanLine, ShieldCheck, WalletCards } from "lucide-react";
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

const PLAN_BORDER_COLORS: Record<string, string> = {
  PRICE: "glow-border-turquoise",
  CASH: "glow-border-amber",
  STOCK: "glow-border-green",
  PATRON: "glow-border-violet",
};

const PLAN_HIGHLIGHTS: Record<string, string[]> = {
  PRICE: [
    "Barkodla fiyat sorgulama",
    "Hızlı ürün ekleme",
    "TCMB kuruyla USD fiyat girişi",
    "Toplu fiyat güncelleme",
    "Sorgu raporu",
  ],
  CASH: [
    "Fiyat sorgulama paketinin tümü",
    "Satış Yapıldı kaydı",
    "Günlük kasa raporu",
    "En çok sorgulanan ürün",
    "Sepetli çoklu ürün satışı",
  ],
  STOCK: [
    "Kasa paketinin tümü",
    "Stokta kalan / minimum stok uyarısı",
    "Stok giriş-çıkış hareketleri",
    "Kâr / marj görünürlüğü",
    "Detaylı raporlar",
  ],
  PATRON: [
    "Stok paketinin tümü",
    "Çoklu cihaz senkronizasyonu",
    "Kampanya erişimi",
    "Haftalık/aylık özet raporlar",
    "Patron görünümü",
  ],
};

export default function PaketlerPage() {
  return (
    <main className="home-viewport relative flex min-h-screen w-full flex-col overflow-x-hidden text-[color:var(--home-ink)]">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BunekaMark size={26} />
          <BunekaWordmark className="text-sm text-[color:var(--home-ink)]" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]">
            <Home size={14} /> Ana Menü
          </Link>
          <Link href="/app" className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex">
            <LayoutDashboard size={14} /> Panele Dön
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:flex">
            <ShieldCheck size={12} /> Yıllık lisans · Şeffaf fiyat
          </span>
          <BunekaNedirButton />
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
      </header>

      <div className="relative z-10 grid flex-1 gap-5 px-3 pb-4 sm:px-6">
        <div>
        <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          Hangi pakette ne var, tek bakışta.
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-[color:var(--home-muted)] sm:text-sm">
          İhtiyaç büyüdükçe bir üst pakete geçebilirsiniz — kurulum ücreti veya sözleşme süresi yoktur.
        </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const code = PLAN_CODES[plan.name];
            const Icon = PLAN_ICONS[code];
            return (
              <div
                key={plan.name}
                className={`relative flex min-h-[360px] flex-col rounded-xl bg-[color:var(--home-surface)]/70 p-4 backdrop-blur-xl sm:p-5 ${PLAN_BORDER_COLORS[code]}`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[color:var(--home-glow)] to-blue-600 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-950 shadow-lg">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--home-glow)]/15 text-[color:var(--home-glow)]">
                    <Icon size={20} />
                  </div>
                  <h2 className="font-display text-base font-bold sm:text-lg">{plan.name}</h2>
                </div>
                <p className="mt-3 text-2xl font-black tracking-tight text-[color:var(--home-glow)] sm:text-3xl">
                  {plan.price}
                  <span className="text-xs font-medium text-[color:var(--home-muted)]"> /yıl</span>
                </p>

                <ul className="mt-3 flex-1 space-y-1.5 pr-1">
                  {PLAN_HIGHLIGHTS[code].map((feature) => (
                    <li key={feature} className="flex items-start gap-1.5 text-[11px] leading-snug text-[color:var(--home-ink)] sm:text-xs">
                      <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <PlanModuleOrder planName={plan.name} planPrice={plan.price} />
              </div>
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
