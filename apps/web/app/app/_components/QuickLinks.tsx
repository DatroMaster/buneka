import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export type QuickLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function QuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:text-cyan-300"
        >
          <link.icon size={13} />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
