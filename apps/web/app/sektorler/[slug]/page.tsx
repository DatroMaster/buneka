import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Route } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";
import { getSector, sectors } from "@/lib/content/sectors";
import { plans } from "@/lib/content/plans";

type SectorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSector(slug);

  if (!sector) {
    return {};
  }

  return {
    title: `${sector.title} | Buneka Sektör Paketi`,
    description: sector.short,
  };
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSector(slug);

  if (!sector) {
    notFound();
  }

  const recommendedPlan = plans[1];

  return (
    <main className="home-viewport relative flex h-[100dvh] w-full flex-col overflow-hidden text-[color:var(--home-ink)]">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BunekaMark size={26} />
          <BunekaWordmark className="text-sm text-[color:var(--home-ink)]" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#sektorler"
            className="hidden items-center gap-1.5 text-xs font-bold text-[color:var(--home-muted)] hover:text-[color:var(--home-ink)] sm:flex"
          >
            <ArrowLeft size={14} /> Sektörler
          </Link>
          <Link href="/demo" className="premium-button-primary text-xs sm:text-sm">
            Demo Paneli Aç
          </Link>
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
      </header>

      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-3 px-3 pb-3 sm:gap-4 sm:px-6 md:grid-cols-2">
        <section className="glow-border flex min-h-0 flex-col justify-center rounded-xl bg-[color:var(--home-surface)]/70 p-5 backdrop-blur-xl sm:rounded-2xl sm:p-7 md:p-9">
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:text-xs">
            <sector.icon size={12} />
            {sector.title}
          </div>
          <h1 className="font-display text-2xl font-bold leading-[1.15] tracking-tight sm:text-3xl md:text-4xl">
            {sector.headline}
          </h1>
          <p className="mt-3 hidden text-sm leading-relaxed text-[color:var(--home-muted)] sm:block md:text-base">
            {sector.description}
          </p>

          <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {sector.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-[color:var(--home-ink)] sm:text-sm">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/demo"
              className="glow-border group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 transition-transform hover:scale-[1.02] active:scale-95"
            >
              Demo Paneli Aç
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappLink(`Merhaba, ${sector.title} sektörü için Buneka lisansı almak istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-border inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-[color:var(--home-ink)]"
            >
              <MessageCircle size={16} className="text-emerald-400" /> WhatsApp&apos;tan Satın Al
            </a>
          </div>
        </section>

        <section className="glow-border flex min-h-0 flex-col divide-y divide-[color:var(--home-border)] overflow-hidden rounded-xl bg-[color:var(--home-surface)]/70 backdrop-blur-xl sm:rounded-2xl">
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
            <p className="font-display mb-3 flex items-center gap-2 text-sm font-bold text-[color:var(--home-ink)] sm:text-base">
              <Route size={16} className="text-[color:var(--home-glow)]" /> Günlük akış
            </p>
            <div className="grid grid-cols-2 gap-2">
              {sector.workflow.map((step, index) => (
                <div key={step} className="glow-border flex items-center gap-2 rounded-lg p-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-[11px] font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-[color:var(--home-ink)]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 p-4 sm:p-5">
            <p className="font-display mb-3 text-sm font-bold text-[color:var(--home-ink)] sm:text-base">Önerilen modüller</p>
            <div className="flex flex-wrap gap-1.5">
              {sector.modules.map((module) => (
                <span
                  key={module}
                  className="glow-border rounded-full px-3 py-1.5 text-[11px] font-bold text-[color:var(--home-ink)]"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 p-4 sm:p-5">
            <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">
              Paket önerisi
            </p>
            <div className="glow-border flex items-center justify-between rounded-lg p-3">
              <div>
                <p className="font-display text-sm font-bold text-[color:var(--home-ink)]">{recommendedPlan.name}</p>
                <p className="text-xs text-[color:var(--home-muted)]">{recommendedPlan.price} /yıl</p>
              </div>
              <Link href="/paketler" className="text-xs font-bold text-[color:var(--home-glow)]">
                Tüm paketler →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5 text-[10px] text-[color:var(--home-muted)] sm:px-6 sm:text-xs">
        <Link href="/#sektorler" className="flex items-center gap-1.5 font-bold hover:text-[color:var(--home-ink)]">
          <ArrowLeft size={12} /> Sektörlere dön
        </Link>
        <span>BUNEKA © 2026 · Ankara, TR</span>
      </footer>
    </main>
  );
}
