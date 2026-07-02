"use client";

import { ArrowRight, ChevronDown, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { modules } from "@/lib/content/modules";
import { plans } from "@/lib/content/plans";
import { sectors } from "@/lib/content/sectors";

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

type SectionId = "sektorler" | "moduller" | "paketler";

export default function HomeClient() {
  const now = useLiveClock();
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("tr-TR", { weekday: "long", day: "2-digit", month: "long" })
    : "";

  const activeSector = sectors.find((sector) => sector.slug === selectedSector);
  const activeModule = modules.find((module) => module.label === selectedModule);
  const activePlan = plans.find((plan) => plan.name === selectedPlan);

  const sections: { id: SectionId; label: string; icon: typeof Store; content: React.ReactNode }[] = [
    {
      id: "sektorler",
      label: "Sektörler",
      icon: Store,
      content: (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {sectors.map((sector) => (
              <button
                key={sector.slug}
                type="button"
                onClick={() => setSelectedSector(selectedSector === sector.slug ? null : sector.slug)}
                className={`glow-border flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[color:var(--home-ink)] sm:text-sm ${selectedSector === sector.slug ? "glow-border-selected" : ""}`}
              >
                <sector.icon size={14} className="shrink-0 text-[color:var(--home-glow)]" />
                <span className="truncate">{sector.title}</span>
              </button>
            ))}
          </div>
          {activeSector && (
            <div className="glow-border glow-border-selected rounded-lg p-3.5">
              <p className="font-display text-sm font-semibold text-[color:var(--home-ink)]">{activeSector.headline}</p>
              <ul className="mt-2 space-y-1">
                {activeSector.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="text-xs text-[color:var(--home-muted)]">
                    · {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={`/sektorler/${activeSector.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--home-glow)]"
              >
                Detaylı sayfa <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "moduller",
      label: "Ek Modüller",
      icon: ShieldCheck,
      content: (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {modules.map((module) => (
              <button
                key={module.label}
                type="button"
                onClick={() => setSelectedModule(selectedModule === module.label ? null : module.label)}
                className={`glow-border flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[color:var(--home-ink)] sm:text-sm ${selectedModule === module.label ? "glow-border-selected" : ""}`}
              >
                <module.icon size={14} className="shrink-0 text-[color:var(--home-glow)]" />
                <span className="truncate">{module.label}</span>
              </button>
            ))}
          </div>
          {activeModule && (
            <div className="glow-border glow-border-selected rounded-lg p-3.5">
              <p className="font-display text-sm font-semibold text-[color:var(--home-ink)]">{activeModule.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--home-muted)]">{activeModule.description}</p>
              <p className="mt-2 text-xs font-bold text-[color:var(--home-glow)]">{activeModule.price}</p>
            </div>
          )}
          <Link
            href="/ek-moduller"
            className="glow-border inline-flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold text-[color:var(--home-ink)]"
          >
            Tüm modülleri incele <ArrowRight size={12} />
          </Link>
        </div>
      ),
    },
    {
      id: "paketler",
      label: "Lisanslama Paketleri",
      icon: ShieldCheck,
      content: (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {plans.map((plan) => (
              <button
                key={plan.name}
                type="button"
                onClick={() => setSelectedPlan(selectedPlan === plan.name ? null : plan.name)}
                className={`glow-border rounded-lg px-3 py-2.5 text-left ${selectedPlan === plan.name ? "glow-border-selected" : ""}`}
              >
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
              </button>
            ))}
          </div>
          {activePlan && (
            <div className="glow-border glow-border-selected rounded-lg p-3.5">
              <p className="font-display text-sm font-semibold text-[color:var(--home-ink)]">{activePlan.summary}</p>
              <ul className="mt-2 space-y-1">
                {activePlan.features.map((feature) => (
                  <li key={feature} className="text-xs text-[color:var(--home-muted)]">
                    · {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href="/paketler"
            className="glow-border inline-flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold text-[color:var(--home-ink)]"
          >
            Paketleri İncele <ArrowRight size={12} />
          </Link>
        </div>
      ),
    },
  ];

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
        <Link href="/" className="flex items-center gap-2.5">
          <BunekaMark size={32} />
          <span className="font-display text-base font-bold tracking-[0.2em] text-[color:var(--home-ink)] sm:text-lg">
            BUNEKA
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="text-right font-mono leading-tight text-[color:var(--home-glow)]">
            <div className="text-xs tracking-wider sm:text-sm">{time}</div>
            <div className="hidden text-[10px] text-[color:var(--home-muted)] sm:block">{date}</div>
          </div>
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
      </header>

      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-3 px-3 pb-3 sm:gap-4 sm:px-6 md:grid-cols-2">
        <section className="glow-border flex min-h-0 flex-col justify-center rounded-xl bg-[color:var(--home-surface)]/70 p-5 backdrop-blur-xl sm:rounded-2xl sm:p-7 md:p-9">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--home-glow)] sm:text-xs">
            <ShieldCheck size={12} /> Kurulumsuz başlar
          </p>
          <h1 className="font-display text-2xl font-bold leading-[1.15] tracking-tight text-[color:var(--home-ink)] sm:text-3xl md:text-4xl lg:text-[2.75rem]">
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
              className="glow-border group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 transition-transform hover:scale-[1.02] active:scale-95 sm:text-base"
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

        <section className="glow-border flex min-h-0 flex-col overflow-hidden rounded-xl bg-[color:var(--home-surface)]/70 backdrop-blur-xl sm:rounded-2xl">
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
                  className="flex w-full shrink-0 items-center justify-between gap-3 px-4 py-3 text-left sm:px-5 sm:py-3.5"
                >
                  <span className="font-display flex items-center gap-2 text-sm font-semibold text-[color:var(--home-ink)] sm:gap-3 sm:text-base">
                    <section.icon size={16} className="text-[color:var(--home-glow)]" />
                    {section.label}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[color:var(--home-glow)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-5 sm:pb-5">{section.content}</div>
                )}
              </div>
            );
          })}
        </section>
      </main>

      <footer className="relative z-10 flex shrink-0 flex-col gap-1 px-4 py-2.5 text-[10px] text-[color:var(--home-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-xs">
        <span>
          Buneka resmi yazarkasa veya mali belge sistemi değildir; küçük işletme operasyon
          hafızasıdır.
        </span>
        <span>BUNEKA © 2026 · Ankara, TR</span>
      </footer>
    </div>
  );
}
