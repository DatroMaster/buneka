"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { whatsappLink } from "@/lib/contact";
import { getModulePrice, resolveModule } from "@/lib/content/module-lookup";
import { modules as allModules } from "@/lib/content/modules";

type SectorPackageBuilderProps = {
  sectorTitle: string;
  modules: string[];
  planName: string;
  planPrice: string;
};

export function SectorPackageBuilder({ sectorTitle, modules, planName, planPrice }: SectorPackageBuilderProps) {
  const [selected, setSelected] = useState<string[]>(() => modules.map((module) => resolveModule(module)?.label || module));
  const [customModule, setCustomModule] = useState("");
  const visibleModules = useMemo(() => {
    const recommended = modules.map((module) => resolveModule(module)?.label || module);
    return Array.from(new Set([...recommended, ...allModules.map((module) => module.label)]));
  }, [modules]);

  const toggle = (module: string) => {
    setSelected((current) =>
      current.includes(module) ? current.filter((item) => item !== module) : [...current, module],
    );
  };

  const message = useMemo(() => {
    const selectedText = selected.length
      ? selected.map((module) => `${module} (${getModulePrice(module)})`).join(", ")
      : "Modül seçmedim, önerinizi istiyorum";
    const customText = customModule.trim() ? ` Yeni modül talebim: ${customModule.trim()}.` : "";
    return `Merhaba, ${sectorTitle} için paket talebi oluşturmak istiyorum. Paket: ${planName} (${planPrice}/yıl). Seçilen modüller: ${selectedText}.${customText}`;
  }, [customModule, planName, planPrice, sectorTitle, selected]);

  return (
    <div className="package-spark-card mt-4 rounded-xl p-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">Paket oluştur</p>
          <p className="font-display mt-1 text-sm font-bold text-[color:var(--home-ink)]">{planName}</p>
          <p className="text-xs text-[color:var(--home-muted)]">{planPrice} /yıl başlangıç paketi</p>
        </div>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--home-glow)] px-3 py-2 text-xs font-black text-slate-950 transition-transform hover:scale-[1.03] active:scale-95 sm:mt-0"
        >
          <MessageCircle size={14} /> Talebi Gönder
        </a>
      </div>

      <div className="mt-2 grid max-h-24 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {visibleModules.map((module) => {
          const isSelected = selected.includes(module);
          return (
            <button
              key={module}
              type="button"
              onClick={() => toggle(module)}
              className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-[11px] font-bold transition-all ${
                isSelected
                  ? "border-[color:var(--home-glow)] bg-[color:var(--home-glow)]/10 text-[color:var(--home-ink)]"
                  : "border-[color:var(--home-border)] text-[color:var(--home-muted)] hover:border-[color:var(--home-glow)]"
              }`}
            >
              <CheckCircle2 size={14} className={isSelected ? "text-[color:var(--home-glow)]" : "text-[color:var(--home-muted)]"} />
              <span className="min-w-0">
                <span className="block truncate">{module}</span>
                <span className="block text-[10px] font-black text-[color:var(--home-glow)]">{getModulePrice(module)}</span>
              </span>
            </button>
          );
        })}
      </div>
      <label className="mt-2 grid gap-1 text-[11px] font-bold text-[color:var(--home-muted)]">
        Yeni modül talebi
        <input
          value={customModule}
          onChange={(event) => setCustomModule(event.target.value)}
          className="rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-surface)] px-3 py-1.5 text-xs text-[color:var(--home-ink)] outline-none focus:border-[color:var(--home-glow)]"
          placeholder="Örn. vardiya takibi, kampanya ekranı..."
        />
      </label>
    </div>
  );
}
