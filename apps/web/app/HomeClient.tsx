"use client";

import { ArrowRight, LogIn, PhoneCall, PhoneOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { ClientIpBadge } from "@/components/ClientIpBadge";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaExplainerCard } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { callLink } from "@/lib/contact";

const STARS = [
  { top: 10, left: 15, size: 2, delay: 0 },
  { top: 20, left: 82, size: 2, delay: 0.8 },
  { top: 35, left: 92, size: 2, delay: 1.6 },
  { top: 48, left: 6, size: 2, delay: 0.4 },
  { top: 62, left: 88, size: 2, delay: 1.2 },
  { top: 78, left: 18, size: 2, delay: 2.0 },
  { top: 88, left: 60, size: 2, delay: 0.6 },
  { top: 6, left: 45, size: 2, delay: 1.8 },
];

function useLiveClock() {
  const cachedMs = useRef(0);

  const subscribe = useCallback((callback: () => void) => {
    cachedMs.current = Date.now();
    const id = setInterval(() => {
      cachedMs.current = Date.now();
      callback();
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const getSnapshot = useCallback(() => cachedMs.current, []);
  const getServerSnapshot = useCallback(() => 0, []);

  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return ms ? new Date(ms) : null;
}

export default function HomeClient() {
  const now = useLiveClock();

  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("tr-TR", { weekday: "long", day: "2-digit", month: "long" })
    : "";

  return (
    <div className="home-viewport relative flex h-[100dvh] w-full flex-col overflow-hidden">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {STARS.map((star, index) => (
          <span
            key={index}
            className="home-star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-3">
          <BunekaMark size={32} />
          <BunekaWordmark className="text-sm text-[color:var(--home-ink)] sm:text-base" />
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-lg border border-[color:var(--home-border)] px-3.5 py-2 text-xs font-bold text-[color:var(--home-ink)] transition-colors hover:border-[color:var(--home-glow)] sm:inline-flex"
          >
            <LogIn size={14} /> Sisteme Giriş Yap
          </Link>
          <Link
            href={callLink()}
            className="cta-call-spark group inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-black transition-transform duration-300 ease-out sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <PhoneCall size={14} />
            Hemen Arayın
          </Link>
          <div className="text-right font-mono leading-tight text-[color:var(--home-glow)]">
            <div className="text-xs tracking-wider sm:text-sm">{time}</div>
            <div className="hidden text-[10px] text-[color:var(--home-muted)] sm:block">{date}</div>
          </div>
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
      </header>

      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-3 px-3 pb-3 sm:gap-4 sm:px-6 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="glow-border flex min-h-0 flex-col justify-center rounded-xl bg-[color:var(--home-surface)]/70 p-5 backdrop-blur-xl sm:rounded-2xl sm:p-6 md:p-7">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:text-xs">
            <ShieldCheck size={12} /> Kurulumsuz başlar
          </p>
          <h1 className="font-display text-2xl font-bold leading-[1.15] tracking-tight text-[color:var(--home-ink)] sm:text-3xl md:text-4xl lg:text-[2.75rem]">
            Dükkanın fiyat, kasa ve stok hafızası{" "}
            <span className="text-[color:var(--home-glow)]">tek ekranda</span> toplansın.
          </h1>
          <p className="glow-border mt-4 flex items-center gap-2.5 rounded-lg bg-[color:var(--home-glow)]/10 px-4 py-3 text-sm font-bold text-[color:var(--home-ink)] sm:text-base">
            <PhoneOff size={18} className="shrink-0 text-[color:var(--home-glow)]" />
            Sen dükkanda yokken fiyat için seni aramasınlar.
          </p>
          <p className="mt-3 hidden text-sm leading-relaxed text-[color:var(--home-muted)] sm:block md:mt-4 md:text-base">
            Buneka barkoddan fiyatı bulur, kasa hareketini kaydeder ve stok durumunu aynı akışta
            gösterir.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="group relative inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--home-muted)] transition-colors duration-500 ease-out hover:text-[color:var(--home-ink)] sm:text-sm"
            >
              <span className="relative">
                Zaten müşterimisiniz? Giriş yapın
                <span className="cta-login-underline absolute -bottom-0.5 left-0 h-px w-full bg-[color:var(--home-glow)]" />
              </span>
              <ArrowRight size={14} className="cta-login-arrow" />
            </Link>
          </div>
        </section>

        <section className="glow-border grid min-h-0 place-items-center overflow-hidden rounded-xl bg-[color:var(--home-surface)]/70 p-4 backdrop-blur-xl sm:rounded-2xl sm:p-6">
          <BunekaExplainerCard />
        </section>
      </main>

      <footer className="relative z-10 flex shrink-0 flex-col gap-1 px-4 py-2.5 text-[10px] text-[color:var(--home-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-xs">
        <span>
          Buneka resmi yazarkasa veya mali belge sistemi değildir; küçük işletme operasyon
          hafızasıdır.
        </span>
        <span className="flex items-center gap-2">
          BUNEKA © 2026 · Ankara, TR · <ClientIpBadge />
        </span>
      </footer>
    </div>
  );
}
