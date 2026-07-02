import type { CurrencyRates } from "@/lib/currency/tcmb";

export function CurrencyTicker({ rates, className = "" }: { rates: CurrencyRates | null; className?: string }) {
  if (!rates) return null;

  return (
    <div className={`hidden items-center gap-3 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] text-slate-300 sm:flex ${className}`}>
      <span className="flex items-center gap-1">
        <span className="text-cyan-300">USD</span>
        {rates.usdToTry.toFixed(2)}
      </span>
      <span className="text-white/15">|</span>
      <span className="flex items-center gap-1">
        <span className="text-emerald-300">EUR</span>
        {rates.eurToTry.toFixed(2)}
      </span>
    </div>
  );
}
