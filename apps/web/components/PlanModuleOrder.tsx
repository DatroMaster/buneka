"use client";

import { CheckCircle2, ExternalLink, MessageCircle, Plus, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { whatsappLink } from "@/lib/contact";
import { getHardwareDeliveryText, hardwareOptions, type HardwareDeliveryOption } from "@/lib/content/hardware";
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
  const [deliveryOption, setDeliveryOption] = useState<HardwareDeliveryOption>("standard");
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
        ? selected
            .map((label) => {
              const selectedModule = modules.find((item) => item.label === label);
              return `${label} (${selectedModule?.price || "fiyat bilgisi"})`;
            })
            .join(", ")
        : "Ek modül istemiyorum";

    return `Merhaba, ${planName} paketini satın almak istiyorum. Paket fiyatı: ${planPrice}/yıl. Ek modüller: ${moduleText}. Donanım teslim seçimim: ${getHardwareDeliveryText(deliveryOption)} Tahmini lisans toplamı: ${formatPrice(totalPrice)}.`;
  }, [deliveryOption, includesAllModules, planName, planPrice, selected, totalPrice]);

  return (
    <div className="mt-5 grid shrink-0 gap-2.5">
      <div className="rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/5 px-3 py-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">Toplam</p>
        <p className="font-display text-lg font-black text-[color:var(--home-glow)]">{formatPrice(totalPrice)}</p>
      </div>

      {includesAllModules ? (
        <div className="rounded-lg border border-amber-300/35 bg-amber-300/8 p-3">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-2 text-left text-xs font-black text-amber-300"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={15} /> Tüm ek modüller aktif
            </span>
            <Plus size={14} className={`transition-transform ${open ? "rotate-45" : ""}`} />
          </button>
          {open && (
          <div className="mt-2 grid gap-1.5">
            {modules.map((module) => (
              <span
                key={module.label}
                className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--home-border)] px-2 py-1 text-[9px] font-bold text-[color:var(--home-ink)]"
              >
                <CheckCircle2 size={10} className="shrink-0 text-amber-300" />
                {module.label}
              </span>
            ))}
          </div>
          )}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="glow-border inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.03] py-2 text-xs font-black text-white"
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
                        ? "border-emerald-300 bg-[color:var(--home-glow)]/12 text-[color:var(--home-ink)] shadow-[inset_0_0_0_1px_rgba(110,231,183,0.16)]"
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

      <div className="rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/70 p-3">
        <div className="flex items-start gap-2">
          <Smartphone size={16} className="mt-0.5 shrink-0 text-[color:var(--home-glow)]" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">Teslimat cihazı</p>
            <p className="mt-1 text-[11px] font-bold leading-4 text-[color:var(--home-muted)]">
              Bilgisayara bağlanan barkod okuyucu hediye. İsterseniz Android el terminali opsiyonuyla teslim edilir.
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-2">
          {[
            {
              value: "standard" as const,
              title: hardwareOptions.standardScanner.label,
              meta: hardwareOptions.standardScanner.priceLabel,
            },
            {
              value: "terminal" as const,
              title: `${hardwareOptions.androidTerminal.model} el terminali`,
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

      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-primary-animated group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-600 py-2.5 text-sm font-bold text-white transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-95"
      >
        <MessageCircle size={15} /> Siparişi Gönder
      </a>
    </div>
  );
}
