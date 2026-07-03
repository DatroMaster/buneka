import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MessageCircle, Route } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ClientIpBadge } from "@/components/ClientIpBadge";
import { SectorPackageBuilder } from "@/components/SectorPackageBuilder";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";
import { getModuleDetail, getSector, getWorkflowDetail, sectors } from "@/lib/content/sectors";
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
    <main className="home-viewport relative flex min-h-screen w-full flex-col overflow-x-hidden text-[color:var(--home-ink)] xl:h-[100dvh] xl:overflow-hidden">
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
          <BunekaNedirButton />
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
      </header>

      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-3 px-3 pb-3 sm:gap-4 sm:px-6 md:grid-cols-[minmax(0,0.618fr)_minmax(0,1fr)]">
        <section className="glow-border flex min-h-0 flex-col justify-center rounded-xl bg-[color:var(--home-surface)]/70 p-5 backdrop-blur-xl sm:rounded-2xl sm:p-6 md:p-7">
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
            <a
              href={whatsappLink(`Merhaba, ${sector.title} sektörü için Buneka lisansı almak istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-border inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-[color:var(--home-ink)]"
            >
              <MessageCircle size={16} className="text-emerald-400" /> WhatsApp&apos;tan Satın Al
            </a>
          </div>

          <SectorPackageBuilder
            sectorTitle={sector.title}
            modules={sector.modules}
            planName={recommendedPlan.name}
            planPrice={recommendedPlan.price}
          />
        </section>

        <section className="glow-border grid min-h-0 grid-rows-[1fr_1fr] overflow-hidden rounded-xl bg-[color:var(--home-surface)]/70 backdrop-blur-xl sm:rounded-2xl">
          <div className="flex min-h-0 flex-col border-b border-[color:var(--home-border)] p-4 sm:p-5">
            <p className="font-display mb-3 flex items-center gap-2 text-sm font-bold text-[color:var(--home-ink)] sm:text-base">
              <Route size={16} className="text-[color:var(--home-glow)]" /> Günlük akış
            </p>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
              {sector.workflow.map((step, index) => (
                <div key={step} className="glow-border flex h-full items-start gap-2 rounded-lg p-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-[11px] font-black text-white">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold leading-tight text-[color:var(--home-ink)]">
                      {step}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-[color:var(--home-muted)]">
                      {getWorkflowDetail(step)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col p-4 sm:p-5">
            <p className="font-display mb-3 text-sm font-bold text-[color:var(--home-ink)] sm:text-base">Önerilen modüller</p>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
              {sector.modules.map((module) => (
                <div key={module} className="glow-border flex h-full flex-col justify-center rounded-lg px-3 py-2.5">
                  <p className="text-[11px] font-bold text-[color:var(--home-ink)]">{module}</p>
                  <p className="text-[10px] leading-snug text-[color:var(--home-muted)]">{getModuleDetail(module)}</p>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      <footer className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5 text-[10px] text-[color:var(--home-muted)] sm:px-6 sm:text-xs">
        <Link href="/#sektorler" className="flex items-center gap-1.5 font-bold hover:text-[color:var(--home-ink)]">
          <ArrowLeft size={12} /> Sektörlere dön
        </Link>
        <span className="flex items-center gap-2">BUNEKA © 2026 · Ankara, TR · <ClientIpBadge /></span>
      </footer>
    </main>
  );
}
