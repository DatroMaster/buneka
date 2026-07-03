"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Route } from "lucide-react";
import { useState } from "react";
import { getWorkflowDetail, sectors } from "@/lib/content/sectors";

export function SectorAccordionExplorer() {
  const [activeSlug, setActiveSlug] = useState(sectors[0]?.slug || "");
  const active = sectors.find((sector) => sector.slug === activeSlug) || sectors[0];
  const Icon = active.icon;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
      <aside className="glow-border flex flex-col rounded-2xl bg-[color:var(--home-surface)]/75 p-3 backdrop-blur-xl">
        <p className="px-2 pb-2 text-[11px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">
          Sektörler
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {sectors.map((sector) => {
            const isActive = sector.slug === active.slug;
            const SectorIcon = sector.icon;
            return (
              <button
                key={sector.slug}
                type="button"
                onClick={() => setActiveSlug(sector.slug)}
                className={`flex min-h-[58px] items-center gap-3 rounded-xl border p-2.5 text-left transition-all ${
                  isActive
                    ? "border-[color:var(--home-glow)] bg-[color:var(--home-glow)]/12 text-[color:var(--home-ink)] shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                    : "border-[color:var(--home-border)] text-[color:var(--home-muted)] hover:border-[color:var(--home-glow)] hover:text-[color:var(--home-ink)]"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/10 text-[color:var(--home-glow)]">
                  <SectorIcon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight">{sector.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="glow-border grid rounded-2xl bg-[color:var(--home-surface)]/78 p-4 backdrop-blur-xl sm:p-6">
        <div>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/10 text-[color:var(--home-glow)]">
            <Icon size={26} />
          </div>
          <p className="text-[11px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">{active.title}</p>
          <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-[color:var(--home-ink)] sm:text-3xl">{active.headline}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--home-muted)]">{active.description}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-black text-[color:var(--home-ink)]">Öne çıkan ihtiyaçlar</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {active.features.map((feature) => (
                <div key={feature} className="flex min-h-[84px] items-center gap-2 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/60 p-3">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                  <span className="text-sm font-bold text-[color:var(--home-ink)]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-black text-[color:var(--home-ink)]">
              <Route size={16} className="text-[color:var(--home-glow)]" /> Günlük akış
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {active.workflow.map((step, index) => (
                <div key={step} className="flex min-h-[84px] items-start gap-3 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/60 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--home-glow)] text-xs font-black text-slate-950">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-black text-[color:var(--home-ink)]">{step}</span>
                    <span className="mt-1 block text-xs leading-5 text-[color:var(--home-muted)]">{getWorkflowDetail(step)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href={`/sektorler/${active.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--home-glow)] px-5 py-3 text-sm font-black text-slate-950 transition-transform hover:scale-[1.02] active:scale-95 sm:w-fit"
        >
          Sektör paketini incele <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
