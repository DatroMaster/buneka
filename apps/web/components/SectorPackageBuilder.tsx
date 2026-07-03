"use client";

import { CheckCircle2, ExternalLink, MessageCircle, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { whatsappLink } from "@/lib/contact";
import { getHardwareDeliveryText, hardwareOptions, type HardwareDeliveryOption } from "@/lib/content/hardware";
import { getModulePrice, resolveModule } from "@/lib/content/module-lookup";
import { modules as allModules } from "@/lib/content/modules";

type SectorPackageBuilderProps = {
  sectorTitle: string;
  modules: string[];
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

export function SectorPackageBuilder({ sectorTitle, modules, planName, planPrice }: SectorPackageBuilderProps) {
  const [selected, setSelected] = useState<string[]>(() => modules.map((module) => resolveModule(module)?.label || module));
  const [customModule, setCustomModule] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<HardwareDeliveryOption>("standard");
  const visibleModules = useMemo(() => {
    const recommended = modules.map((module) => resolveModule(module)?.label || module);
    return Array.from(new Set([...recommended, ...allModules.map((module) => module.label)]));
  }, [modules]);

  const toggle = (module: string) => {
    setSelected((current) =>
      current.includes(module) ? current.filter((item) => item !== module) : [...current, module],
    );
  };

  const totalPrice = useMemo(() => {
    return selected.reduce((sum, module) => sum + parsePrice(getModulePrice(module)), parsePrice(planPrice));
  }, [planPrice, selected]);

  const message = useMemo(() => {
    const selectedText = selected.length
      ? selected.map((module) => `${module} (${getModulePrice(module)})`).join(", ")
      : "Modül seçmedim, önerinizi istiyorum";
    const customText = customModule.trim() ? ` Yeni modül talebim: ${customModule.trim()}.` : "";
    return `Merhaba, ${sectorTitle} için paket talebi oluşturmak istiyorum. Paket: ${planName} (${planPrice}/yıl). Seçilen modüller: ${selectedText}. Donanım teslim seçimim: ${getHardwareDeliveryText(deliveryOption)} Tahmini lisans toplamı: ${formatPrice(totalPrice)}.${customText}`;
  }, [customModule, deliveryOption, planName, planPrice, sectorTitle, selected, totalPrice]);

  return (
    <div className="package-spark-card flex flex-col rounded-xl p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">Paket oluştur</p>
          <p className="font-display mt-1 text-sm font-bold text-[color:var(--home-ink)]">{planName}</p>
          <p className="text-xs text-[color:var(--home-muted)]">{planPrice} /yıl başlangıç paketi</p>
          <p className="mt-2 text-2xl font-black text-[color:var(--home-glow)]">{formatPrice(totalPrice)}</p>
        </div>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--home-glow)] px-4 py-2.5 text-xs font-black text-slate-950 transition-transform hover:scale-[1.03] active:scale-95"
        >
          <MessageCircle size={14} /> Talebi Gönder
        </a>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {visibleModules.map((module) => {
          const isSelected = selected.includes(module);
          return (
            <button
              key={module}
              type="button"
              onClick={() => toggle(module)}
              className={`flex min-h-12 items-center gap-2 rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all ${
                isSelected
                  ? "border-emerald-300 bg-[color:var(--home-glow)]/12 text-[color:var(--home-ink)] shadow-[inset_0_0_0_1px_rgba(110,231,183,0.18),0_0_22px_rgba(62,207,142,0.14)]"
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

      <div className="mt-4 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/70 p-3">
        <div className="flex items-start gap-2">
          <Smartphone size={16} className="mt-0.5 shrink-0 text-[color:var(--home-glow)]" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">Teslimat cihazı</p>
            <p className="mt-1 text-[11px] font-bold leading-4 text-[color:var(--home-muted)]">
              Bilgisayara bağlanan barkod okuyucu hediye. Android el terminali opsiyonel teslimattır.
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            {
              value: "standard" as const,
              title: hardwareOptions.standardScanner.label,
              meta: hardwareOptions.standardScanner.priceLabel,
            },
            {
              value: "terminal" as const,
              title: `${hardwareOptions.androidTerminal.model} terminal`,
              meta: hardwareOptions.androidTerminal.priceLabel,
            },
          ].map((option) => {
            const isSelected = deliveryOption === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setDeliveryOption(option.value)}
                className={`rounded-lg border px-3 py-2 text-left text-[10px] font-bold transition ${
                  isSelected
                    ? "border-emerald-300 bg-[color:var(--home-glow)]/12 text-[color:var(--home-ink)]"
                    : "border-[color:var(--home-border)] text-[color:var(--home-muted)] hover:border-[color:var(--home-glow)]"
                }`}
              >
                <span className="block">{option.title}</span>
                <span className="block text-[color:var(--home-glow)]">{option.meta}</span>
              </button>
            );
          })}
        </div>
        {deliveryOption === "terminal" && (
          <div className="mt-3 rounded-lg border border-amber-300/35 bg-amber-300/10 p-3">
            <p className="text-[11px] font-black text-amber-200">{hardwareOptions.androidTerminal.livePriceLabel}</p>
            <p className="mt-1 text-[10px] font-semibold leading-4 text-[color:var(--home-muted)]">
              Son kontrol: {hardwareOptions.androidTerminal.priceUpdatedAt}. Nihai tedarik fiyatı sipariş öncesi tekrar teyit edilir.
            </p>
            <a
              href={hardwareOptions.androidTerminal.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-[color:var(--home-glow)]"
            >
              Canlı fiyatı kontrol et <ExternalLink size={11} />
            </a>
          </div>
        )}
      </div>

      <label className="mt-4 grid gap-1.5 text-[11px] font-bold text-[color:var(--home-muted)]">
        Yeni modül talebi
        <textarea
          value={customModule}
          onChange={(event) => setCustomModule(event.target.value)}
          className="min-h-20 resize-none rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-surface)] px-3 py-2 text-xs text-[color:var(--home-ink)] outline-none focus:border-[color:var(--home-glow)]"
          placeholder="Örn. vardiya takibi, kampanya ekranı, müşteri sadakat modülü..."
        />
      </label>
    </div>
  );
}
