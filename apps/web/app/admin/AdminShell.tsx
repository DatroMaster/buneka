"use client";

import type { Tables } from "@buneka/database";
import { ArrowLeft, KeyRound, LayoutDashboard, Menu, Puzzle, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { name: "Genel Bakış", href: "/admin", icon: LayoutDashboard },
  { name: "Müşteriler", href: "/admin/customers", icon: Users },
  { name: "Lisanslar", href: "/admin/licenses", icon: KeyRound },
  { name: "Modüller", href: "/admin/modules", icon: Puzzle },
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
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="sidebar-surface z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 md:px-6">
        <Link href="/admin" className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <BunekaMark size={22} />
            <span className="font-display text-lg font-bold tracking-tight text-white">Buneka Admin</span>
          </span>
          <span className="h-[2px] w-full max-w-[9rem] rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-transparent" />
          <span className="text-[11px] text-slate-400">{user.name} · {user.role}</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/app"
            className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-cyan-300/50 hover:text-white sm:flex"
          >
            <ArrowLeft size={14} /> Uygulamaya dön
          </Link>
          <ThemeToggle className="border-white/15 text-slate-300 hover:border-cyan-300/50 hover:text-white" />
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-all hover:border-cyan-300/50 hover:text-white active:scale-90"
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
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-white" : "text-cyan-300"} />
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
    </div>
  );
}
