import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Minus } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { ThemeToggle } from "@/components/ThemeToggle";
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

const FEATURES: { code: string; label: string }[] = [
  { code: "price_query", label: "Barkodla fiyat sorgulama" },
  { code: "product_create", label: "Ürün ekleme" },
  { code: "sale_create", label: "Satış kaydı (Satış Yap)" },
  { code: "daily_cash", label: "Günlük kasa raporu" },
  { code: "stock_tracking", label: "Stok takibi ve uyarı" },
  { code: "profit_details", label: "Kâr / marj görünürlüğü" },
  { code: "reports", label: "Raporlar" },
  { code: "multi_device", label: "Çoklu cihaz" },
  { code: "campaign_access", label: "Kampanya erişimi" },
];

const PLAN_FEATURES: Record<string, string[]> = {
  PRICE: ["price_query", "product_create", "reports"],
  CASH: ["price_query", "product_create", "sale_create", "daily_cash", "reports"],
  STOCK: [
    "price_query",
    "product_create",
    "sale_create",
    "daily_cash",
    "stock_tracking",
    "profit_details",
    "reports",
  ],
  PATRON: [
    "price_query",
    "product_create",
    "sale_create",
    "daily_cash",
    "stock_tracking",
    "profit_details",
    "reports",
    "multi_device",
    "campaign_access",
  ],
};

export default function PaketlerPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[color:var(--color-text)]">
      <header className="border-b border-[color:var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-black">
            <BunekaMark size={22} />
            Buneka
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/demo" className="premium-button-primary text-sm">
              Demo Paneli Aç
            </Link>
            <ThemeToggle className="border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-cyan-400" />
          </div>
        </div>
      </header>

      <section className="px-5 py-14 md:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-black text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]"
          >
            <ArrowLeft size={16} /> Ana sayfaya dön
          </Link>
          <h1 className="font-display max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Hangi pakette ne var, tek bakışta.
          </h1>
          <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
            Tüm paketler yıllık lisanslıdır, ihtiyaç büyüdükçe bir üst pakete geçebilirsiniz. Soru işareti
            bırakmadan, dört paketin tüm özellikleri aşağıda yan yana.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.name} className="data-card p-6">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-black">{plan.name}</h2>
                  {plan.badge && (
                    <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-3xl font-black text-cyan-600 dark:text-cyan-300">{plan.price}</p>
                <p className="mt-1 text-xs text-[color:var(--color-muted)]">/yıl</p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{plan.summary}</p>
                <Link href="/login" className="premium-button-secondary mt-5 w-full text-sm">
                  Bu paketi seç <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          <div className="data-card mt-10 overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-sm text-[color:var(--color-muted)]">
                  <th className="px-6 py-4 font-medium">Özellik</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="px-4 py-4 text-center font-bold text-[color:var(--color-text)]">
                      {plan.name.replace("Buneka ", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {FEATURES.map((feature) => (
                  <tr key={feature.code}>
                    <td className="px-6 py-3.5 text-sm font-medium">{feature.label}</td>
                    {plans.map((plan) => {
                      const code = PLAN_CODES[plan.name];
                      const included = PLAN_FEATURES[code]?.includes(feature.code);
                      return (
                        <td key={plan.name} className="px-4 py-3.5 text-center">
                          {included ? (
                            <Check size={18} className="mx-auto text-emerald-500" />
                          ) : (
                            <Minus size={16} className="mx-auto text-slate-300 dark:text-slate-700" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
