import Link from "next/link";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { sectors } from "@/lib/content/sectors";

export const metadata = {
  title: "Sektörler | Buneka",
  description: "Buneka'nın desteklediği sektör ve firma kategorilerini inceleyin.",
};

const COLORS = [
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-sky-400 to-indigo-500",
  "from-lime-400 to-green-500",
  "from-orange-400 to-red-500",
  "from-teal-400 to-cyan-500",
  "from-fuchsia-400 to-pink-500",
  "from-indigo-400 to-blue-500",
];

export default function SektorlerPage() {
  return (
    <main className="home-viewport relative flex min-h-screen w-full flex-col overflow-x-hidden text-[color:var(--home-ink)] xl:h-[100dvh] xl:overflow-hidden">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BunekaMark size={26} />
          <BunekaWordmark className="text-sm text-[color:var(--home-ink)]" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" aria-label="Ana sayfa">
            <Home size={16} />
          </Link>
          <BunekaNedirButton />
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-3 pb-3 sm:px-6">
        <div className="mb-4 flex shrink-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--home-muted)] hover:text-[color:var(--home-ink)]">
              <ArrowLeft size={13} /> Ana sayfa
            </Link>
            <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">Sektörler ve firma kategorileri</h1>
            <p className="mt-1 text-sm text-[color:var(--home-muted)]">
              Kendi işletmenize en yakın kategoriyi seçin, önerilen akışı ve modülleri görün.
            </p>
          </div>
        </div>

        <div className="glow-border grid min-h-0 flex-1 grid-cols-2 gap-3 rounded-2xl bg-[color:var(--home-surface)]/70 p-4 backdrop-blur-xl sm:grid-cols-3 lg:grid-cols-5">
          {sectors.map((sector, index) => (
            <Link
              key={sector.slug}
              href={`/sektorler/${sector.slug}`}
              className={`group flex min-h-0 flex-col justify-between rounded-xl bg-gradient-to-br ${COLORS[index % COLORS.length]} p-4 text-white shadow-lg transition-transform hover:-translate-y-1 active:scale-[0.98]`}
            >
              <sector.icon size={24} />
              <span>
                <span className="font-display block text-base font-black leading-tight">{sector.title}</span>
                <span className="mt-2 line-clamp-2 block text-xs font-semibold text-white/85">{sector.short}</span>
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-black">
                İncele <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
