import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export type QuickLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function QuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3.5 py-1.5 text-xs font-bold text-[color:var(--color-muted)] transition-colors hover:border-lime-300/60 hover:text-lime-200"
        >
          <link.icon size={13} />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
