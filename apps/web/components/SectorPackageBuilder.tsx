"use client";

import {
  CheckCircle2,
  ExternalLink,
  ListChecks,
  MessageCircle,
  PackageCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { whatsappLink } from "@/lib/contact";
import { getHardwareDeliveryText, hardwareOptions, type HardwareDeliveryOption } from "@/lib/content/hardware";
import { getModulePrice, resolveModule } from "@/lib/content/module-lookup";
import { modules as allModules } from "@/lib/content/modules";
import { plans } from "@/lib/content/plans";
import { getWorkflowDetail } from "@/lib/content/sectors";

type SectorPackageBuilderProps = {
  sectorTitle: string;
  sectorHeadline: string;
  sectorDescription: string;
  sectorFeatures: string[];
  workflow: string[];
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

function moduleTitle(module: string) {
  return resolveModule(module)?.label || module;
}

function moduleDescription(module: string) {
  return (
    resolveModule(module)?.description ||
    "Bu modül, seçtiğiniz Buneka modeline eklenerek işletmenizin günlük operasyonunu daha görünür ve kontrollü hale getirir."
  );
}

export function SectorPackageBuilder({
  sectorTitle,
  workflow,
  modules,
  planName,
  planPrice,
}: SectorPackageBuilderProps) {
  const recommendedPlan = useMemo(
    () =>
      plans.find((plan) => plan.name === planName) || plans[1] || plans[0] || {
        name: planName,
        price: planPrice,
        summary: "Sektör için tavsiye edilen başlangıç modeli.",
        features: [],
      },
    [planName, planPrice],
  );

  const [selectedPlanName, setSelectedPlanName] = useState(recommendedPlan.name);
  const [selected, setSelected] = useState<string[]>(() => modules.map((module) => moduleTitle(module)));
  const [activeModule, setActiveModule] = useState<string>(() => moduleTitle(modules[0] || allModules[0]?.label || ""));
  const [customModule, setCustomModule] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<HardwareDeliveryOption>("standard");

  const selectedPlan = plans.find((plan) => plan.name === selectedPlanName) || recommendedPlan;
  const includesAllModules = selectedPlan.name === "Buneka Patron";
  const visibleModules = useMemo(() => {
    const recommended = modules.map((module) => moduleTitle(module));
    return Array.from(new Set([...recommended, ...allModules.map((module) => module.label)]));
  }, [modules]);

  const selectedModules = includesAllModules ? allModules.map((module) => module.label) : selected;
  const activeModuleName = selectedModules.includes(activeModule) ? activeModule : selectedModules[0] || activeModule;
  const activeModuleData = resolveModule(activeModuleName);
  const ActiveModuleIcon = activeModuleData?.icon || PackageCheck;

  const toggle = (module: string) => {
    setActiveModule(module);
    if (includesAllModules) return;
    setSelected((current) =>
      current.includes(module) ? current.filter((item) => item !== module) : [...current, module],
    );
  };

  const totalPrice = useMemo(() => {
    if (includesAllModules) {
      return parsePrice(selectedPlan.price);
    }

    return selected.reduce((sum, module) => sum + parsePrice(getModulePrice(module)), parsePrice(selectedPlan.price));
  }, [includesAllModules, selected, selectedPlan.price]);

  const message = useMemo(() => {
    const selectedText = includesAllModules
      ? `Tüm ek modüller pakete dahil: ${allModules.map((module) => module.label).join(", ")}`
      : selected.length
      ? selected.map((module) => `${module} (${getModulePrice(module)})`).join(", ")
      : "Modül seçmedim, önerinizi istiyorum";
    const customText = customModule.trim() ? ` Yeni modül talebim: ${customModule.trim()}.` : "";
    return `Merhaba, ${sectorTitle} için satın alma talebi oluşturmak istiyorum. Seçtiğim model: ${selectedPlan.name} (${selectedPlan.price}/yıl). Seçilen modüller: ${selectedText}. Donanım teslim seçimim: ${getHardwareDeliveryText(deliveryOption)} Tahmini lisans toplamı: ${formatPrice(totalPrice)}.${customText}`;
  }, [customModule, deliveryOption, includesAllModules, sectorTitle, selected, selectedPlan.name, selectedPlan.price, totalPrice]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
      <section className="package-spark-card flex flex-col rounded-xl p-4 sm:p-5">
        <div className="text-center sm:text-left">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[color:var(--home-glow)]">
            Paket oluştur
          </p>
          <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-[color:var(--home-ink)] sm:text-4xl">
            Modelini seç.
          </h2>
          <p className="mt-2 text-sm font-bold leading-6 text-[color:var(--home-muted)]">
            Sol tarafta model, ek modül ve teslimat seçimini yapın; sağ tarafta seçiminizin detaylarını anında görün.
          </p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {plans.map((plan) => {
            const isRecommended = plan.name === recommendedPlan.name;
            const isSelected = plan.name === selectedPlan.name;
            return (
              <button
                key={plan.name}
                type="button"
                onClick={() => {
                  setSelectedPlanName(plan.name);
                  setActiveModule("");
                }}
                className={`relative min-h-24 overflow-hidden rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-emerald-300 bg-[color:var(--home-glow)]/12 text-[color:var(--home-ink)] shadow-[0_0_32px_rgba(62,207,142,0.18),inset_0_0_0_1px_rgba(110,231,183,0.16)]"
                    : "border-[color:var(--home-border)] text-[color:var(--home-muted)] hover:border-[color:var(--home-glow)] hover:text-[color:var(--home-ink)]"
                } ${isRecommended ? "package-recommended-model" : ""}`}
              >
                {isRecommended && (
                  <span className="mb-2 inline-flex rounded-full bg-[#f4f7fb] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-[#090d14]">
                    Tavsiye edilen model
                  </span>
                )}
                <span className="block font-display text-base font-black">{plan.name}</span>
                <span className="mt-1 block text-[11px] font-semibold leading-4">{plan.summary}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/6 p-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">
            Seçilen model ve tahmini toplam
          </p>
          <div className="mt-1 flex flex-col gap-1">
            <p className="font-display text-4xl font-black text-[color:var(--home-glow)]">{formatPrice(totalPrice)}</p>
            <p className="font-display text-xl font-black text-[color:var(--home-ink)]">{selectedPlan.name}</p>
            <p className="text-xs font-bold text-[color:var(--home-muted)]">
              {includesAllModules ? "TÃ¼m ek modÃ¼ller aktif" : `${selectedModules.length} ek modÃ¼l seÃ§ildi`}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--home-muted)]">
            Ek modüller
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {visibleModules.map((module) => {
              const isSelected = includesAllModules || selected.includes(module);
              const isActive = activeModuleName === module;
              return (
                <button
                  key={module}
                  type="button"
                  onClick={() => toggle(module)}
                  className={`flex min-h-12 items-center gap-2 rounded-lg border px-3 py-2 text-left text-[11px] font-bold transition-all ${
                    isSelected
                      ? "border-emerald-300 bg-[color:var(--home-glow)]/12 text-[color:var(--home-ink)] shadow-[inset_0_0_0_1px_rgba(110,231,183,0.18),0_0_22px_rgba(62,207,142,0.14)]"
                      : "border-[color:var(--home-border)] text-[color:var(--home-muted)] hover:border-[color:var(--home-glow)]"
                  } ${isActive ? "ring-2 ring-[#f4f7fb]/45" : ""}`}
                >
                  <CheckCircle2
                    size={14}
                    className={isSelected ? "text-[color:var(--home-glow)]" : "text-[color:var(--home-muted)]"}
                  />
                  <span className="min-w-0">
                    <span className="block truncate">{module}</span>
                    <span className="block text-[10px] font-black text-[color:var(--home-glow)]">{getModulePrice(module)}</span>
                  </span>
                </button>
              );
            })}
          </div>
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

        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="purchase-request-button mt-4"
        >
          <MessageCircle size={19} /> Sipariş Talebini Gönder
        </a>
      </section>

      <section className="package-detail-panel flex flex-col rounded-xl p-4 sm:p-5">
        <div className="grid gap-3">
          <div className="rounded-xl border border-[color:var(--home-glow)]/35 bg-[color:var(--home-glow)]/[0.055] p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="mt-1 shrink-0 text-[color:var(--home-glow)]" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--home-glow)]">
                  {selectedPlan.name === recommendedPlan.name ? "Tavsiye edilen model" : "Seçilen model"}
                </p>
                <h4 className="font-display mt-1 text-2xl font-black text-[color:var(--home-ink)]">{selectedPlan.name}</h4>
                <p className="mt-2 text-sm font-bold leading-6 text-[color:var(--home-muted)]">{selectedPlan.summary}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/72 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--home-glow)]">
              Oluşturulan paket içeriği
            </p>
            <div className="hidden">
              <div className="rounded-lg border border-[color:var(--home-border)] bg-[#05070d]/35 p-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">Model</p>
                <p className="mt-1 font-display text-lg font-black text-[color:var(--home-ink)]">{selectedPlan.name}</p>
                <p className="mt-1 text-sm font-black text-[color:var(--home-glow)]">{selectedPlan.price}/yıl</p>
              </div>
              <div className="rounded-lg border border-[color:var(--home-border)] bg-[#05070d]/35 p-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">Toplam</p>
                <p className="mt-1 font-display text-2xl font-black text-[color:var(--home-glow)]">{formatPrice(totalPrice)}</p>
                <p className="mt-1 text-xs font-bold text-[color:var(--home-muted)]">
                  {includesAllModules ? "Tüm ek modüller aktif" : `${selectedModules.length} ek modül seçildi`}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {selectedPlan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 rounded-lg border border-[color:var(--home-border)] bg-[#05070d]/35 px-3 py-2">
                  <CheckCircle2 size={14} className="shrink-0 text-[color:var(--home-glow)]" />
                  <span className="text-xs font-bold text-[color:var(--home-ink)]">{feature}</span>
                </div>
              ))}
              {selectedModules.slice(0, 6).map((module) => (
                <div key={module} className="flex items-center gap-2 rounded-lg border border-[color:var(--home-border)] bg-[#05070d]/35 px-3 py-2">
                  <PackageCheck size={14} className="shrink-0 text-[color:var(--home-glow)]" />
                  <span className="text-xs font-bold text-[color:var(--home-ink)]">{module}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/72 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--home-glow)]/14 text-[color:var(--home-glow)]">
                <ActiveModuleIcon size={21} />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--home-glow)]">
                  Seçilen modül detayı
                </p>
                <h4 className="font-display mt-1 text-xl font-black text-[color:var(--home-ink)]">
                  {activeModuleName || "Modül seçin"}
                </h4>
                <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--home-muted)]">
                  {activeModuleName ? moduleDescription(activeModuleName) : "Sol taraftan bir ek modül seçtiğinizde açıklaması burada görünür."}
                </p>
              </div>
            </div>
            {activeModuleName && (
              <div className="mt-4 rounded-lg border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/7 p-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">Modül fiyatı</p>
                <p className="font-display mt-1 text-2xl font-black text-[color:var(--home-glow)]">{getModulePrice(activeModuleName)}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/72 p-4">
            <p className="font-display flex items-center gap-2 text-base font-black text-[color:var(--home-ink)]">
              <ListChecks size={17} className="text-[color:var(--home-glow)]" /> Günlük akış
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {workflow.map((step, index) => (
                <div key={step} className="rounded-lg border border-[color:var(--home-border)] p-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--home-glow)] text-[11px] font-black text-slate-950">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-xs font-black leading-tight text-[color:var(--home-ink)]">{step}</span>
                      <span className="mt-1 block text-xs leading-5 text-[color:var(--home-muted)]">{getWorkflowDetail(step)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden">
            <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">Satın alma talebi</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-xl font-black text-[color:var(--home-ink)]">{selectedPlan.name}</p>
                <p className="text-xs font-bold text-[color:var(--home-muted)]">
                  {includesAllModules ? "Tüm ek modüller dahil" : `${selectedModules.length} ek modül seçildi`}
                </p>
              </div>
              <p className="font-display text-3xl font-black text-[color:var(--home-glow)]">{formatPrice(totalPrice)}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
