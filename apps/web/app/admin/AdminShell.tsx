"use client";

import type { Tables } from "@buneka/database";
import { ArrowLeft, Home, KeyRound, LayoutDashboard, LineChart, Menu, Puzzle, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ClientIpBadge } from "@/components/ClientIpBadge";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { name: "Genel Bakış", href: "/admin", icon: LayoutDashboard },
  { name: "Müşteriler", href: "/admin/customers", icon: Users },
  { name: "Lisanslar", href: "/admin/licenses", icon: KeyRound },
  { name: "Modüller", href: "/admin/modules", icon: Puzzle },
  { name: "Analitik", href: "/admin/analytics", icon: LineChart },
];

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Tables<"app_users">;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-bg)]">
      <header className="sidebar-surface z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 md:px-6">
        <Link href="/admin" className="flex flex-col gap-1">
          <span className="flex items-center gap-2.5">
            <BunekaMark size={22} />
            <span className="flex items-baseline gap-1.5">
              <BunekaWordmark className="text-sm text-white" />
              <span className="text-xs font-semibold text-slate-400">Admin</span>
            </span>
          </span>
          <span className="h-[2px] w-full max-w-[9rem] rounded-full bg-gradient-to-r from-emerald-400 via-[color:var(--color-primary)] to-transparent" />
          <span className="text-[11px] text-slate-400">{user.name} · {user.role}</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/app"
            className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-emerald-300/50 hover:text-white sm:flex"
          >
            <ArrowLeft size={14} /> Uygulamaya dön
          </Link>
          <BunekaNedirButton variant="compact" className="hidden border-white/15 text-emerald-300 hover:border-emerald-300/50 sm:flex" />
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-all hover:border-emerald-300/50 hover:text-white active:scale-90"
            aria-label="Site ana sayfası"
            title="Site ana sayfası"
          >
            <Home size={16} />
          </Link>
          <ThemeToggle className="border-white/15 text-slate-300 hover:border-emerald-300/50 hover:text-white" />
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-all hover:border-emerald-300/50 hover:text-white active:scale-90"
            type="button"
            aria-label="Menüyü aç"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="sidebar-surface h-full w-full max-w-xs overflow-y-auto shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <span className="font-display text-base font-bold text-white">Menü</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white active:scale-90" type="button" aria-label="Kapat">
                <X size={22} />
              </button>
            </div>
            <nav className="space-y-1.5 px-4 py-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all active:scale-[0.98] ${
                      isActive
                        ? "bg-emerald-400/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-emerald-200" : "text-emerald-300"} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              <Link
                href="/app"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-amber-300 transition-colors hover:bg-amber-300/10"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Uygulamaya dön</span>
              </Link>
            </nav>
          </div>
          <button
            className="flex-1 cursor-default bg-black/50"
            onClick={() => setIsMenuOpen(false)}
            type="button"
            aria-label="Menüyü kapat"
          />
        </div>
      )}

      <main className="flex-1 overflow-y-auto bg-[var(--color-bg)] p-4 text-[color:var(--color-text)] md:p-8">
        {children}
      </main>
      <div className="pointer-events-none fixed bottom-2 right-3 z-40 hidden rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-[10px] font-semibold text-slate-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#050A0F]/70 dark:text-slate-400 md:block">
        BUNEKA © 2026 · Ankara, TR · <ClientIpBadge />
      </div>
    </div>
  );
}
