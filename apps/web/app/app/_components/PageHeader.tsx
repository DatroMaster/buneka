import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h1 className="font-display mb-1 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          {title}
        </h1>
        {subtitle && <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action && <div className="flex w-full gap-2 md:w-auto">{action}</div>}
    </div>
  );
}
