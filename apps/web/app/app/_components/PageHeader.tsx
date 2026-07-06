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
    <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-3 md:flex-row md:items-center">
      <div>
        <h1 className="font-display mb-1 text-3xl font-extrabold tracking-tight text-[color:var(--color-text)]">
          {title}
        </h1>
        {subtitle && <p className="font-semibold text-[color:var(--color-muted)]">{subtitle}</p>}
      </div>
      {action && <div className="flex w-full min-w-0 flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">{action}</div>}
    </div>
  );
}
