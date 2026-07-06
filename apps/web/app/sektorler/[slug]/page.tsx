import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenCheck, CheckCircle2 } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ClientIpBadge } from "@/components/ClientIpBadge";
import { PublicPanelLink } from "@/components/PublicPanelLink";
import { SectorPackageBuilder } from "@/components/SectorPackageBuilder";
import { ThemeToggle } from "@/components/ThemeToggle";
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
          <PublicPanelLink
            authenticatedLabel="Yönetim Platformu"
            className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] md:flex"
          />
          <Link
            href="/kullanici-rehberi"
            className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] lg:flex"
          >
            <BookOpenCheck size={14} /> Rehber
          </Link>
          <BunekaNedirButton />
          <ThemeToggle className="hidden border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex" />
        </div>
        <PublicPanelLink
          iconSize={17}
          className="cta-primary-animated inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[color:var(--home-glow)] to-emerald-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_36px_rgba(62,207,142,0.18)] sm:hidden"
        />
      </header>

      <main className="relative z-10 flex flex-col gap-4 px-3 pb-24 sm:px-6 sm:pb-6">
        <section className="glow-border overflow-visible rounded-xl bg-[color:var(--home-surface)]/78 p-4 backdrop-blur-xl sm:rounded-2xl sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
            <div>
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:text-xs">
                <sector.icon size={12} />
                {sector.title}
              </div>
              <h1 className="font-display max-w-2xl text-2xl font-bold leading-[1.12] tracking-tight sm:text-3xl lg:text-4xl">
                {sector.headline}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--home-muted)]">{sector.description}</p>
            </div>

            <ul className="hidden grid-cols-1 gap-2 sm:grid sm:grid-cols-2">
              {sector.features.map((feature) => (
                <li
                  key={feature}
                  className="flex min-h-12 items-start gap-2 rounded-lg border border-[color:var(--home-border)] p-3 text-xs text-[color:var(--home-ink)] sm:text-sm"
                >
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SectorPackageBuilder
          sectorTitle={sector.title}
          sectorHeadline={sector.headline}
          sectorDescription={sector.description}
          sectorFeatures={sector.features}
          workflow={sector.workflow}
          modules={sector.modules}
          planName={recommendedPlan.name}
          planPrice={recommendedPlan.price}
        />
      </main>

      <footer className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5 text-[10px] text-[color:var(--home-muted)] sm:px-6 sm:text-xs">
        <Link href="/sektorler" className="flex items-center gap-1.5 font-bold hover:text-[color:var(--home-ink)]">
          <ArrowLeft size={12} /> Sektörlere dön
        </Link>
        <span className="flex items-center gap-2">
          BUNEKA © 2026 · Ankara, TR · <ClientIpBadge />
        </span>
      </footer>
    </main>
  );
}
