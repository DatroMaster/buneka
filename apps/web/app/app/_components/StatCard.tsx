import type { LucideIcon } from "lucide-react";

const TONE_STYLES = {
  primary: {
    icon: "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20",
    value: "text-cyan-600 dark:text-cyan-300",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
    value: "text-emerald-600 dark:text-emerald-300",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
    value: "text-amber-600 dark:text-amber-300",
  },
  slate: {
    icon: "bg-slate-50 text-slate-600 ring-1 ring-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    value: "text-slate-950 dark:text-slate-50",
  },
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
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`text-xl font-black ${styles.value}`}>{value}</p>
      </div>
    </div>
  );
}
