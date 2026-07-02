"use client";

import {
  ArrowRight,
  BookUser,
  ChevronDown,
  Clock,
  CloudUpload,
  FileSpreadsheet,
  Layers,
  Ruler,
  ShieldCheck,
  Smartphone,
  Store,
  Tag,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { plans } from "@/lib/content/plans";
import { sectors } from "@/lib/content/sectors";

const modules = [
  { icon: Clock, label: "Son kullanma tarihi takibi" },
  { icon: Tag, label: "Raf etiketi yazdırma" },
  { icon: FileSpreadsheet, label: "Excel toplu ürün aktarımı" },
  { icon: Smartphone, label: "Çoklu cihaz senkronizasyonu" },
  { icon: BookUser, label: "Cari müşteri ve veresiye defteri" },
  { icon: CloudUpload, label: "Bulut yedekleme" },
  { icon: Store, label: "Beden ve renk varyantı" },
  { icon: Ruler, label: "Metre, kilo ve birim takibi" },
  { icon: Wrench, label: "Uzaktan / yerinde kurulum desteği" },
];

const STARS = [
  { top: 8, left: 12, size: 2, delay: 0 },
  { top: 15, left: 78, size: 3, delay: 0.6 },
  { top: 22, left: 45, size: 2, delay: 1.2 },
  { top: 30, left: 90, size: 2, delay: 1.8 },
  { top: 38, left: 6, size: 3, delay: 0.3 },
  { top: 44, left: 60, size: 2, delay: 2.1 },
  { top: 52, left: 25, size: 2, delay: 0.9 },
  { top: 60, left: 82, size: 3, delay: 1.5 },
  { top: 68, left: 15, size: 2, delay: 2.4 },
  { top: 74, left: 55, size: 2, delay: 0.4 },
  { top: 80, left: 92, size: 2, delay: 1.1 },
  { top: 86, left: 35, size: 3, delay: 1.9 },
  { top: 12, left: 60, size: 2, delay: 2.6 },
  { top: 26, left: 8, size: 2, delay: 0.8 },
  { top: 48, left: 40, size: 2, delay: 1.4 },
  { top: 64, left: 68, size: 2, delay: 2.0 },
  { top: 90, left: 20, size: 2, delay: 0.2 },
  { top: 5, left: 35, size: 2, delay: 1.7 },
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

type SectionId = "sektorler" | "moduller" | "paketler";

export default function HomeClient() {
  const now = useLiveClock();
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("tr-TR", { weekday: "long", day: "2-digit", month: "long" })
    : "";

  const sections: { id: SectionId; label: string; icon: typeof Store; content: React.ReactNode }[] = [
    {
      id: "sektorler",
      label: "Sektörler",
      icon: Store,
      content: (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sectors.map((sector) => (
            <Link
              key={sector.slug}
              href={`/sektorler/${sector.slug}`}
              className="glow-border flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[color:var(--home-ink)] transition-colors hover:bg-[color:var(--home-surface-soft)] sm:text-sm"
            >
              <sector.icon size={14} className="shrink-0 text-[color:var(--home-glow)]" />
              <span className="truncate">{sector.title}</span>
            </Link>
          ))}
        </div>
      ),
    },
    {
      id: "moduller",
      label: "Ek Modüller",
      icon: Layers,
      content: (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {modules.map((module) => (
            <div
              key={module.label}
              className="glow-border flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[color:var(--home-ink)] sm:text-sm"
            >
              <module.icon size={14} className="shrink-0 text-[color:var(--home-glow)]" />
              <span className="truncate">{module.label}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "paketler",
      label: "Lisanslama Paketleri",
      icon: ShieldCheck,
      content: (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.name} className="glow-border rounded-xl px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-xs font-bold text-[color:var(--home-ink)] sm:text-sm">
                  {plan.name}
                </span>
                {plan.badge && (
                  <span className="shrink-0 rounded-full bg-[color:var(--home-glow)]/15 px-2 py-0.5 text-[9px] font-bold text-[color:var(--home-glow)]">
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="mt-1 text-base font-black text-[color:var(--home-glow)] sm:text-lg">
                {plan.price}
                <span className="text-[10px] font-medium text-[color:var(--home-muted)]"> /yıl</span>
              </div>
              <p className="mt-1 text-[11px] text-[color:var(--home-muted)] sm:text-xs">{plan.summary}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="home-viewport relative flex h-[100dvh] w-full flex-col overflow-hidden">
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

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <div className="font-mono leading-tight text-[color:var(--home-glow)]">
          <div className="text-xs tracking-wider sm:text-sm">{time}</div>
          <div className="hidden text-[10px] text-[color:var(--home-muted)] sm:block">{date}</div>
        </div>

        <Link href="/" className="flex items-center gap-2">
          <BunekaMark size={26} />
          <span className="font-display text-sm font-bold tracking-[0.25em] text-[color:var(--home-ink)] sm:text-base">
            BUNEKA
          </span>
        </Link>

        <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
      </header>

      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-4 px-4 pb-3 sm:gap-6 sm:px-8 md:grid-cols-2">
        <section className="glow-border flex min-h-0 flex-col justify-center rounded-2xl bg-[color:var(--home-surface)]/60 p-5 backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:text-xs">
            <ShieldCheck size={12} /> Kurulumsuz başlar
          </p>
          <h1 className="font-display text-2xl font-extrabold leading-[1.1] tracking-tight text-[color:var(--home-ink)] sm:text-3xl md:text-4xl lg:text-5xl">
            Sadece satışları değil,{" "}
            <span className="text-[color:var(--home-glow)]">kaçan satışları</span> da görün.
          </h1>
          <p className="mt-3 hidden text-sm leading-relaxed text-[color:var(--home-muted)] sm:block md:mt-4 md:text-base">
            Dükkanın hafızası artık cebinizde. Barkodu okut, fiyatı gör, satışını bil — kasa ve
            stok da aynı ekranda seni bekliyor.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              href="/demo"
              className="glow-border group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(0,242,254,0.35)] transition-transform hover:scale-[1.02] active:scale-95 sm:text-base"
            >
              Hemen Başlat
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-[color:var(--home-muted)] transition-colors hover:text-[color:var(--home-ink)] sm:text-sm"
            >
              Zaten müşterimisiniz? Giriş yapın →
            </Link>
          </div>
        </section>

        <section className="glow-border flex min-h-0 flex-col overflow-hidden rounded-2xl bg-[color:var(--home-surface)]/60 backdrop-blur-xl sm:rounded-3xl">
          {sections.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div
                key={section.id}
                className="flex min-h-0 flex-col border-b border-[color:var(--home-border)] last:border-b-0"
                style={{ flex: isOpen ? "1 1 auto" : "0 0 auto" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="flex w-full shrink-0 items-center justify-between gap-3 px-4 py-3 text-left sm:px-6 sm:py-4"
                >
                  <span className="font-display flex items-center gap-2 text-sm font-bold text-[color:var(--home-ink)] sm:gap-3 sm:text-base">
                    <section.icon size={16} className="text-[color:var(--home-glow)]" />
                    {section.label}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[color:var(--home-glow)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>

      <footer className="relative z-10 flex shrink-0 flex-col gap-1 px-4 py-3 text-[10px] text-[color:var(--home-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-xs">
        <span>
          Buneka resmi yazarkasa veya mali belge sistemi değildir; küçük işletme operasyon
          hafızasıdır.
        </span>
        <span>BUNEKA © 2026 · Ankara, TR</span>
      </footer>
    </div>
  );
}
