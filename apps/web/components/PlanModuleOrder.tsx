"use client";

import { MessageCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { whatsappLink } from "@/lib/contact";
import { modules } from "@/lib/content/modules";

type PlanModuleOrderProps = {
  planName: string;
  planPrice: string;
};

export function PlanModuleOrder({ planName, planPrice }: PlanModuleOrderProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) => {
    setSelected((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));
  };

  const message = useMemo(() => {
    const moduleText = selected.length
      ? selected.map((label) => {
          const selectedModule = modules.find((item) => item.label === label);
          return `${label} (${selectedModule?.price || "fiyat bilgisi"})`;
        }).join(", ")
      : "Ek modül istemiyorum";
    return `Merhaba, ${planName} paketini satın almak istiyorum. Paket fiyatı: ${planPrice}/yıl. Ek modüller: ${moduleText}.`;
  }, [planName, planPrice, selected]);

  return (
    <div className="mt-3 grid gap-2">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="glow-border inline-flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-black text-[color:var(--home-ink)]"
      >
        <Plus size={14} /> Ek modül ekle
      </button>
      {open && (
        <div className="grid max-h-28 gap-1.5 overflow-y-auto pr-1">
          {modules.map((module) => {
            const isSelected = selected.includes(module.label);
            return (
              <button
                key={module.label}
                type="button"
                onClick={() => toggle(module.label)}
                className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[10px] font-bold ${
                  isSelected
                    ? "border-[color:var(--home-glow)] bg-[color:var(--home-glow)]/10 text-[color:var(--home-ink)]"
                    : "border-[color:var(--home-border)] text-[color:var(--home-muted)]"
                }`}
              >
                <span className="truncate">{module.label}</span>
                <span className="shrink-0 text-[color:var(--home-glow)]">{module.price}</span>
              </button>
            );
          })}
        </div>
      )}
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-primary-animated group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 py-2.5 text-sm font-bold text-slate-950 transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-95"
      >
        <MessageCircle size={15} /> Siparişi Gönder
      </a>
    </div>
  );
}
