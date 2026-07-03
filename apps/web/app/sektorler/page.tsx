import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { sectors } from "@/lib/content/sectors";

export const metadata = {
  title: "Sektörler | Buneka",
  description: "Buneka'nın sektörünüze özel kurgusunu keşfedin.",
};

const COLORS = [
  "from-cyan-600 to-blue-700",
  "from-emerald-600 to-teal-700",
  "from-amber-500 to-orange-700",
  "from-rose-600 to-pink-700",
  "from-violet-600 to-purple-700",
  "from-sky-600 to-indigo-700",
  "from-lime-600 to-green-700",
  "from-orange-600 to-red-700",
  "from-teal-600 to-cyan-700",
  "from-fuchsia-600 to-pink-700",
  "from-indigo-600 to-blue-700",
];

export default function SektorlerIndexPage() {
  return (
    <main className="home-viewport relative flex min-h-screen w-full flex-col overflow-x-hidden text-[color:var(--home-ink)] lg:h-[100dvh] lg:overflow-hidden">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BunekaMark size={26} />
          <BunekaWordmark className="text-sm text-[color:var(--home-ink)]" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-xs font-bold text-[color:var(--home-muted)] hover:text-[color:var(--home-ink)] sm:flex"
          >
            <ArrowLeft size={14} /> Ana sayfa
          </Link>
          <BunekaNedirButton />
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
      </header>

      <section className="relative z-10 flex min-h-0 flex-1 flex-col px-3 pb-4 sm:px-6">
        <div className="mb-3 shrink-0 sm:mb-4">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Sektörünüzü seçin</h1>
          <p className="mt-1 max-w-2xl text-xs text-[color:var(--home-muted)] sm:text-sm">
            Buneka her sektörün günlük akışına göre kurgulanır. Kartın üzerine gelin, tıklayınca o sektörün
            sayfasına gidin.
          </p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2.5 overflow-y-auto sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
          {sectors.map((sector, index) => (
            <Link
              key={sector.slug}
              href={`/sektorler/${sector.slug}`}
              className={`group flex flex-col gap-1.5 rounded-xl bg-gradient-to-br p-3.5 text-white shadow-md ring-1 ring-black/15 transition-transform hover:-translate-y-0.5 sm:p-4 ${COLORS[index % COLORS.length]}`}
            >
              <sector.icon size={24} className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]" />
              <p className="font-display text-sm font-extrabold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-base">
                {sector.title}
              </p>
              <p className="line-clamp-2 text-[11px] leading-snug text-white/85 sm:text-xs">{sector.short}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[11px] font-bold text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                İncele <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5 text-[10px] text-[color:var(--home-muted)] sm:px-6 sm:text-xs">
        <Link href="/" className="flex items-center gap-1.5 font-bold hover:text-[color:var(--home-ink)]">
          <ArrowLeft size={12} /> Ana sayfaya dön
        </Link>
        <span>BUNEKA © 2026 · Ankara, TR</span>
      </footer>
    </main>
  );
}
