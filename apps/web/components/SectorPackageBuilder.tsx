"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { whatsappLink } from "@/lib/contact";

type SectorPackageBuilderProps = {
  sectorTitle: string;
  modules: string[];
  planName: string;
  planPrice: string;
};

export function SectorPackageBuilder({ sectorTitle, modules, planName, planPrice }: SectorPackageBuilderProps) {
  const [selected, setSelected] = useState<string[]>(modules);

  const toggle = (module: string) => {
    setSelected((current) =>
      current.includes(module) ? current.filter((item) => item !== module) : [...current, module],
    );
  };

  const message = useMemo(() => {
    const selectedText = selected.length ? selected.join(", ") : "Modül seçmedim, önerinizi istiyorum";
    return `Merhaba, ${sectorTitle} için paket talebi oluşturmak istiyorum. Paket: ${planName} (${planPrice}/yıl). Seçilen modüller: ${selectedText}.`;
  }, [planName, planPrice, sectorTitle, selected]);

  return (
    <div className="package-spark-card mt-5 rounded-xl p-4">
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

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {modules.map((module) => {
          const isSelected = selected.includes(module);
          return (
            <button
              key={module}
              type="button"
              onClick={() => toggle(module)}
              className={`flex min-h-12 items-center gap-2 rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all ${
                isSelected
                  ? "border-[color:var(--home-glow)] bg-[color:var(--home-glow)]/10 text-[color:var(--home-ink)]"
                  : "border-[color:var(--home-border)] text-[color:var(--home-muted)] hover:border-[color:var(--home-glow)]"
              }`}
            >
              <CheckCircle2 size={14} className={isSelected ? "text-[color:var(--home-glow)]" : "text-[color:var(--home-muted)]"} />
              {module}
            </button>
          );
        })}
      </div>
    </div>
  );
}
