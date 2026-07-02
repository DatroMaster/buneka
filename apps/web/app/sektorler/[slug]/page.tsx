import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Layers3,
  Route,
} from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaWordmark } from "@/components/BunekaWordmark";
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

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[color:var(--color-text)]">
      <header className="border-b border-[color:var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <BunekaMark size={22} />
            <BunekaWordmark className="text-sm text-[color:var(--color-text)]" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/demo" className="premium-button-primary text-sm">
              Demo Paneli Aç
            </Link>
            <ThemeToggle className="border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-cyan-400" />
          </div>
        </div>
      </header>

      <section className="border-b border-[color:var(--color-border)] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <Link
              href="/#sektorler"
              className="mb-8 inline-flex items-center gap-2 text-sm font-black text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]"
            >
              <ArrowLeft size={16} />
              Sektörlere dön
            </Link>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-2 text-sm font-black text-cyan-600 dark:text-cyan-300">
              <sector.icon size={18} />
              {sector.title}
            </div>
            <h1 className="font-display max-w-4xl text-5xl font-black leading-[1] tracking-tight md:text-7xl">
              {sector.headline}
            </h1>
            <p className="mt-8 max-w-3xl text-lg font-medium leading-8 text-[color:var(--color-muted)] md:text-xl">
              {sector.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/demo" className="premium-button-primary min-h-14 px-7 text-base">
                Demo Paneli Aç
                <ArrowRight size={18} />
              </Link>
              <a href="#paket" className="premium-button-secondary min-h-14 px-7 text-base">
                Paketi Gör
              </a>
            </div>
          </div>

          <aside className="data-card p-7">
            <BadgeCheck className="mb-6 text-amber-500" size={30} />
            <h2 className="font-display text-2xl font-black">Bu sektörde öne çıkanlar</h2>
            <ul className="mt-6 space-y-4">
              {sector.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm font-bold leading-6">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={18} />
                  {feature}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
          <article className="data-card p-8">
            <Route className="mb-6 text-cyan-500" size={30} />
            <h2 className="font-display text-3xl font-black">Günlük akış</h2>
            <div className="mt-8 grid gap-4">
              {sector.workflow.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl bg-[color:var(--color-bg-secondary)] p-4"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span className="font-bold">{step}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="data-card p-8">
            <Layers3 className="mb-6 text-amber-500" size={30} />
            <h2 className="font-display text-3xl font-black">Önerilen modüller</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {sector.modules.map((module) => (
                <span
                  key={module}
                  className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-5 py-3 text-sm font-black text-cyan-700 dark:text-cyan-300"
                >
                  {module}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section
        id="paket"
        className="border-t border-[color:var(--color-border)] bg-[color:var(--color-card)] px-5 py-20 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-amber-500">Paket önerisi</p>
            <h2 className="font-display text-4xl font-black tracking-tight">
              {sector.title} için genelde Buneka Kasa veya Stok ile başlanır.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.name} className="data-card p-6">
                <h3 className="font-display text-xl font-black">{plan.name}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-[color:var(--color-muted)]">
                  {plan.summary}
                </p>
                <p className="mt-5 text-3xl font-black text-cyan-600 dark:text-cyan-300">{plan.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
