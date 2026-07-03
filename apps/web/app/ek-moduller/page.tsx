import Link from "next/link";
import { ArrowLeft, BookOpenCheck, Home, LayoutDashboard, LogIn } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ModuleAccordionExplorer } from "@/components/ModuleAccordionExplorer";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Ek Modüller | Buneka",
  description: "Buneka lisansınıza ekleyebileceğiniz tüm ek modüller ve yıllık ücretleri.",
};

export default function EkModullerPage() {
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
          <Link href="/" className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]">
            <Home size={14} /> Ana Menü
          </Link>
          <Link href="/app" className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex">
            <LayoutDashboard size={14} /> Panele Dön
          </Link>
          <Link href="/kullanici-rehberi" className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] lg:flex">
            <BookOpenCheck size={14} /> Rehber
          </Link>
          <BunekaNedirButton />
          <ThemeToggle className="hidden border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex" />
        </div>
        <Link
          href="/login"
          className="cta-primary-animated inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.18)] sm:hidden"
        >
          <LogIn size={17} /> Sisteme Giriş Yap
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 gap-4 px-3 pb-24 sm:px-6 sm:pb-6">
        <div className="glow-border shrink-0 rounded-2xl bg-[color:var(--home-surface)]/70 p-4 backdrop-blur-xl">
          <Link href="/" className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--home-muted)] hover:text-[color:var(--home-ink)]">
            <ArrowLeft size={13} /> Ana sayfa
          </Link>
          <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">Ek modüller</h1>
          <p className="mt-1 max-w-3xl text-sm text-[color:var(--home-muted)]">
            Soldan modül seçin; sağda ne işe yaradığını, fiyatını ve talep aksiyonunu görün.
          </p>
        </div>

        <ModuleAccordionExplorer />
      </section>
    </main>
  );
}
