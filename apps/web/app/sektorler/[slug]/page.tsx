import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenCheck, CheckCircle2, LogIn, MessageCircle, Route } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ClientIpBadge } from "@/components/ClientIpBadge";
import { SectorPackageBuilder } from "@/components/SectorPackageBuilder";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";
import { getSector, getWorkflowDetail, sectors } from "@/lib/content/sectors";
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
          <Link
            href="/sektorler"
            className="hidden items-center gap-1.5 text-xs font-bold text-[color:var(--home-muted)] hover:text-[color:var(--home-ink)] sm:flex"
          >
            <ArrowLeft size={14} /> Sektörler
          </Link>
          <Link
            href="/kullanici-rehberi"
            className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] lg:flex"
          >
            <BookOpenCheck size={14} /> Rehber
          </Link>
          <BunekaNedirButton />
          <ThemeToggle className="hidden border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex" />
        </div>
        <Link
          href="/login"
          className="cta-primary-animated inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[color:var(--home-glow)] to-emerald-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_36px_rgba(62,207,142,0.18)] sm:hidden"
        >
          <LogIn size={17} /> Sisteme Giriş Yap
        </Link>
      </header>

      <main className="relative z-10 grid grid-cols-1 gap-4 px-3 pb-24 sm:px-6 sm:pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="glow-border grid overflow-visible rounded-xl bg-[color:var(--home-surface)]/78 backdrop-blur-xl sm:rounded-2xl">
          <div className="overflow-visible p-4 sm:p-6">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:text-xs">
              <sector.icon size={12} />
              {sector.title}
            </div>
            <h1 className="font-display max-w-2xl text-2xl font-bold leading-[1.12] tracking-tight sm:text-3xl lg:text-4xl">
              {sector.headline}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--home-muted)]">
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

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={whatsappLink(`Merhaba, ${sector.title} sektörü için Buneka lisansı almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-border inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-[color:var(--home-ink)]"
              >
                <MessageCircle size={16} className="text-emerald-400" /> Hemen Satın Al
              </a>
            </div>
          </div>

          <div className="flex flex-col border-t border-[color:var(--home-border)] p-4 sm:p-5">
            <p className="font-display mb-3 flex items-center gap-2 text-sm font-bold text-[color:var(--home-ink)] sm:text-base">
              <Route size={16} className="text-[color:var(--home-glow)]" /> Günlük akış
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sector.workflow.map((step, index) => (
                <div key={step} className="glow-border flex min-h-24 items-start gap-3 rounded-lg p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--home-glow)] text-[11px] font-black text-slate-950">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold leading-tight text-[color:var(--home-ink)]">
                      {step}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[color:var(--home-muted)]">
                      {getWorkflowDetail(step)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glow-border flex flex-col overflow-visible rounded-xl bg-[color:var(--home-surface)]/78 p-5 backdrop-blur-xl sm:rounded-2xl sm:p-6">
          <SectorPackageBuilder
            sectorTitle={sector.title}
            modules={sector.modules}
            planName={recommendedPlan.name}
            planPrice={recommendedPlan.price}
          />
        </section>
      </main>

      <footer className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5 text-[10px] text-[color:var(--home-muted)] sm:px-6 sm:text-xs">
        <Link href="/sektorler" className="flex items-center gap-1.5 font-bold hover:text-[color:var(--home-ink)]">
          <ArrowLeft size={12} /> Sektörlere dön
        </Link>
        <span className="flex items-center gap-2">BUNEKA © 2026 · Ankara, TR · <ClientIpBadge /></span>
      </footer>
    </main>
  );
}
