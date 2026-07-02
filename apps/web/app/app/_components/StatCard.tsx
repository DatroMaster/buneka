import type { LucideIcon } from "lucide-react";

const TONE_STYLES = {
  primary: { icon: "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100", value: "text-cyan-600" },
  green: { icon: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100", value: "text-emerald-600" },
  amber: { icon: "bg-amber-50 text-amber-600 ring-1 ring-amber-100", value: "text-amber-600" },
  slate: { icon: "bg-slate-50 text-slate-600 ring-1 ring-slate-100", value: "text-slate-950" },
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: keyof typeof TONE_STYLES;
}) {
  const styles = TONE_STYLES[tone];

  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${styles.icon}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className={`text-2xl font-black ${styles.value}`}>{value}</p>
      </div>
    </div>
  );
}
