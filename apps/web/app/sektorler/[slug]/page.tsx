import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Barcode,
  CheckCircle2,
  Layers3,
  Route,
} from "lucide-react";
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
    <main className="min-h-screen bg-[#F7F4ED] text-[#20231F]">
      <header className="border-b border-[#E4DED2] bg-[#F7F4ED]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-black">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2F4A35] text-white">
              <Barcode size={19} strokeWidth={2.5} />
            </span>
            Buneka
          </Link>
          <Link
            href="/demo"
            className="inline-flex min-h-11 items-center rounded-full bg-[#4F6F52] px-5 text-sm font-black text-white"
          >
            Demo Paneli Aç
          </Link>
        </div>
      </header>

      <section className="border-b border-[#E4DED2] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <Link
              href="/#sektorler"
              className="mb-8 inline-flex items-center gap-2 text-sm font-black text-[#667064] hover:text-[#20231F]"
            >
              <ArrowLeft size={16} />
              Sektörlere dön
            </Link>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#E4DED2] bg-white px-4 py-2 text-sm font-black text-[#2F4A35]">
              <sector.icon size={18} />
              {sector.title}
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1] tracking-tight md:text-7xl">
              {sector.headline}
            </h1>
            <p className="mt-8 max-w-3xl text-lg font-medium leading-8 text-[#667064] md:text-xl">
              {sector.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#4F6F52] px-7 text-base font-black text-white"
              >
                Demo Paneli Aç
                <ArrowRight size={18} />
              </Link>
              <a
                href="#paket"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#D8B46A] bg-white px-7 text-base font-black text-[#2F4A35]"
              >
                Paketi Gör
              </a>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#E4DED2] bg-white p-7 shadow-[0_24px_70px_rgba(32,35,31,0.08)]">
            <BadgeCheck className="mb-6 text-[#C8913A]" size={30} />
            <h2 className="text-2xl font-black">Bu sektörde öne çıkanlar</h2>
            <ul className="mt-6 space-y-4">
              {sector.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm font-bold leading-6">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#4F6F52]" size={18} />
                  {feature}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-[28px] border border-[#E4DED2] bg-white p-8 shadow-[0_18px_50px_rgba(32,35,31,0.05)]">
            <Route className="mb-6 text-[#4F6F52]" size={30} />
            <h2 className="text-3xl font-black">Günlük akış</h2>
            <div className="mt-8 grid gap-4">
              {sector.workflow.map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl bg-[#F7F4ED] p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2F4A35] text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span className="font-bold">{step}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#E4DED2] bg-white p-8 shadow-[0_18px_50px_rgba(32,35,31,0.05)]">
            <Layers3 className="mb-6 text-[#C8913A]" size={30} />
            <h2 className="text-3xl font-black">Önerilen modüller</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {sector.modules.map((module) => (
                <span
                  key={module}
                  className="rounded-full border border-[#E4DED2] bg-[#F7F4ED] px-5 py-3 text-sm font-black text-[#2F4A35]"
                >
                  {module}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="paket" className="border-t border-[#E4DED2] bg-white px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#C8913A]">Paket önerisi</p>
            <h2 className="text-4xl font-black tracking-tight">
              {sector.title} için genelde Buneka Kasa veya Stok ile başlanır.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.name} className="rounded-[24px] border border-[#E4DED2] bg-[#F7F4ED] p-6">
                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-[#667064]">{plan.summary}</p>
                <p className="mt-5 text-3xl font-black">{plan.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
