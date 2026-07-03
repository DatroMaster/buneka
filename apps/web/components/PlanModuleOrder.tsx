"use client";

import { CheckCircle2, MessageCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { whatsappLink } from "@/lib/contact";
import { modules } from "@/lib/content/modules";

type PlanModuleOrderProps = {
  planName: string;
  planPrice: string;
};

function parsePrice(value: string) {
  const numeric = value.replace(/\./g, "").match(/\d+/)?.[0];
  return numeric ? Number(numeric) : 0;
}

function formatPrice(value: number) {
  return `${new Intl.NumberFormat("tr-TR").format(value)} TL/yıl`;
}

export function PlanModuleOrder({ planName, planPrice }: PlanModuleOrderProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const includesAllModules = planName === "Buneka Patron";

  const toggle = (label: string) => {
    setSelected((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));
  };

  const totalPrice = useMemo(() => {
    if (includesAllModules) {
      return parsePrice(planPrice);
    }

    return selected.reduce((sum, label) => {
      const selectedModule = modules.find((item) => item.label === label);
      return sum + parsePrice(selectedModule?.price || "0");
    }, parsePrice(planPrice));
  }, [includesAllModules, planPrice, selected]);

  const message = useMemo(() => {
    const moduleText = includesAllModules
      ? `Tüm ek modüller pakete dahil: ${modules.map((module) => module.label).join(", ")}`
      : selected.length
        ? selected.map((label) => {
            const selectedModule = modules.find((item) => item.label === label);
            return `${label} (${selectedModule?.price || "fiyat bilgisi"})`;
          }).join(", ")
        : "Ek modül istemiyorum";

    return `Merhaba, ${planName} paketini satın almak istiyorum. Paket fiyatı: ${planPrice}/yıl. Ek modüller: ${moduleText}. Barkod okuyucu desteği ücretsiz dahil. Tahmini toplam: ${formatPrice(totalPrice)}.`;
  }, [includesAllModules, planName, planPrice, selected, totalPrice]);

  return (
    <div className="mt-3 grid shrink-0 gap-2">
      <div className="rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/5 px-3 py-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">Toplam</p>
        <p className="font-display text-lg font-black text-[color:var(--home-glow)]">{formatPrice(totalPrice)}</p>
      </div>

      {includesAllModules ? (
        <div className="rounded-lg border border-emerald-300/35 bg-gradient-to-r from-emerald-400/15 via-cyan-300/10 to-[color:var(--home-glow)]/10 p-3">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
            <CheckCircle2 size={15} /> Tüm ek modüller aktif
          </div>
          <div className="mt-2 grid gap-1.5">
            {modules.map((module) => (
              <span key={module.label} className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--home-ink)]">
                <CheckCircle2 size={12} className="shrink-0 text-emerald-300" />
                {module.label}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="glow-border inline-flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-black text-[color:var(--home-ink)]"
          >
            <Plus size={14} /> Ek modül ekle
          </button>
          {open && (
            <div className="grid gap-1.5 pr-1">
              {modules.map((module) => {
                const isSelected = selected.includes(module.label);
                return (
                  <button
                    key={module.label}
                    type="button"
                    onClick={() => toggle(module.label)}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[10px] font-bold ${
                      isSelected
                        ? "border-emerald-300 bg-gradient-to-r from-emerald-400/20 via-cyan-300/15 to-[color:var(--home-glow)]/10 text-[color:var(--home-ink)] shadow-[inset_0_0_0_1px_rgba(110,231,183,0.16)]"
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
        </>
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
