"use client";

import { ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { barcodeDevices, type BarcodeDevice } from "@/lib/barcode-devices";

type LiveDevice = BarcodeDevice & {
  livePrice: string;
  priceSource: "live" | "fallback";
  checkedAt: string;
};

export function BarcodeDeviceCards({ compact = false }: { compact?: boolean }) {
  const fallbackDevices = useMemo<LiveDevice[]>(
    () =>
      barcodeDevices.map((device) => ({
        ...device,
        livePrice: device.fallbackPrice,
        priceSource: "fallback",
        checkedAt: new Date().toISOString(),
      })),
    [],
  );
  const [devices, setDevices] = useState<LiveDevice[]>(fallbackDevices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPrices() {
      try {
        const response = await fetch("/api/barcode-devices", { cache: "no-store" });
        const data = (await response.json()) as { devices?: LiveDevice[] };
        if (!cancelled && data.devices?.length) {
          setDevices(data.devices);
        }
      } catch {
        if (!cancelled) setDevices(fallbackDevices);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPrices();
    return () => {
      cancelled = true;
    };
  }, [fallbackDevices]);

  return (
    <div className={`grid gap-3 ${compact ? "lg:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
      {devices.map((device) => (
        <article
          key={device.id}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/82 shadow-[0_18px_44px_rgba(2,6,23,0.18)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
        >
          <div className="flex min-h-40 items-center justify-center bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- External marketplace images avoid next/image domain config changes. */}
            <img
              src={device.image}
              alt={device.name}
              className="h-32 max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--home-glow)]">
                  {device.type}
                </p>
                <h3 className="mt-1 font-display text-base font-black leading-tight text-[color:var(--home-ink)]">
                  {device.name}
                </h3>
              </div>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-black text-emerald-300">
                Uygun
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-[color:var(--home-muted)]">{device.bestFor}</p>

            <div className="mt-4 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/7 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">
                  {device.priceSource === "live" ? "Canlı fiyat" : "Son doğrulanan fiyat"}
                </span>
                <RefreshCw size={13} className={`text-[color:var(--home-glow)] ${loading ? "animate-spin" : ""}`} />
              </div>
              <p className="mt-1 font-display text-2xl font-black text-[color:var(--home-glow)]">{device.livePrice}</p>
            </div>

            <div className="mt-3 grid gap-2">
              {device.features.map((feature) => (
                <span key={feature} className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--home-muted)]">
                  <ShieldCheck size={13} className="text-emerald-300" />
                  {feature}
                </span>
              ))}
            </div>

            <a
              href={device.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[color:var(--home-border)] text-xs font-black text-[color:var(--home-ink)] transition-colors hover:border-[color:var(--home-glow)]"
            >
              Fiyat kaynağını aç <ExternalLink size={14} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
