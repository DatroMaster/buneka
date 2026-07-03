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
    <div className="sector-directory grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr]">
      <aside className="sector-directory-panel flex flex-col rounded-2xl p-3">
        <p className="px-2 pb-2 text-[11px] font-black uppercase tracking-wide text-amber-300">
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
                    ? "border-amber-300/60 bg-amber-300/10 text-stone-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "border-white/10 bg-neutral-950/40 text-stone-400 hover:border-amber-300/35 hover:text-stone-100"
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  isActive
                    ? "border-amber-300/35 bg-amber-300/12 text-amber-200"
                    : "border-white/10 bg-white/[0.035] text-emerald-300"
                }`}>
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

      <section className="sector-directory-panel grid rounded-2xl p-4 sm:p-6">
        <div>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-amber-200">
            <Icon size={26} />
          </div>
          <p className="text-[11px] font-black uppercase tracking-wide text-amber-300">{active.title}</p>
          <h2 className="font-display mt-2 text-2xl font-black tracking-tight text-stone-50 sm:text-3xl">{active.headline}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-400">{active.description}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-black text-stone-100">Öne çıkan ihtiyaçlar</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {active.features.map((feature) => (
                <div key={feature} className="flex min-h-[76px] items-center gap-2 rounded-xl border border-white/10 bg-neutral-950/54 p-3">
                  <CheckCircle2 size={16} className="shrink-0 text-amber-300" />
                  <span className="text-sm font-bold text-stone-100">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-black text-stone-100">
              <Route size={16} className="text-amber-300" /> Günlük akış
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {active.workflow.map((step, index) => (
                <div key={step} className="flex min-h-[76px] items-start gap-3 rounded-xl border border-white/10 bg-neutral-950/54 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-black text-neutral-950">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-black text-stone-100">{step}</span>
                    <span className="mt-1 block text-xs leading-5 text-stone-400">{getWorkflowDetail(step)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href={`/sektorler/${active.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-black text-neutral-950 transition-transform hover:scale-[1.02] active:scale-95 sm:w-fit"
        >
          Sektör paketini incele <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
