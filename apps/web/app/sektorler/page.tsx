import Link from "next/link";
import { ArrowLeft, Home, LayoutDashboard, LogIn, PackagePlus, ShieldCheck } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ClientIpBadge } from "@/components/ClientIpBadge";
import { SectorAccordionExplorer } from "@/components/SectorAccordionExplorer";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Sektörler | Buneka",
  description: "Buneka'nın desteklediği sektör ve firma kategorilerini inceleyin.",
};

export default function SektorlerPage() {
  return (
    <main className="home-viewport relative flex min-h-screen w-full flex-col overflow-x-hidden text-[color:var(--home-ink)]">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BunekaMark size={26} />
          <BunekaWordmark className="text-sm text-[color:var(--home-ink)]" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]">
            <Home size={14} /> Ana Menü
          </Link>
          <Link href="/app" className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex">
            <LayoutDashboard size={14} /> Panele Dön
          </Link>
          <BunekaNedirButton />
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
        <Link
          href="/login"
          className="cta-primary-animated inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.18)] sm:hidden"
        >
          <LogIn size={17} /> Sisteme Giriş Yap
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 gap-4 px-3 pb-6 sm:px-6">
        <div className="glow-border grid shrink-0 grid-cols-1 gap-3 rounded-2xl bg-[color:var(--home-surface)]/70 p-4 backdrop-blur-xl lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Link href="/" className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--home-muted)] hover:text-[color:var(--home-ink)]">
              <ArrowLeft size={13} /> Ana sayfa
            </Link>
            <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">Sektörler ve firma kategorileri</h1>
            <p className="mt-1 max-w-3xl text-sm text-[color:var(--home-muted)]">
              Soldan sektör seçin; sağda kullanım akışını, ihtiyaçları ve paket detayına geçişi görün.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Link href="/paketler" className="glow-border inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-black text-[color:var(--home-ink)]">
              <PackagePlus size={14} /> Paketler
            </Link>
            <Link href="/ek-moduller" className="glow-border inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-black text-[color:var(--home-ink)]">
              <ShieldCheck size={14} /> Ek Modüller
            </Link>
          </div>
        </div>

        <SectorAccordionExplorer />
      </section>

      <footer className="relative z-10 flex shrink-0 items-center justify-end px-4 py-2 text-[10px] text-[color:var(--home-muted)] sm:px-6 sm:text-xs">
        BUNEKA © 2026 · Ankara, TR · <ClientIpBadge />
      </footer>
    </main>
  );
}
