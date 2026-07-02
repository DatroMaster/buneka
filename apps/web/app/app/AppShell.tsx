"use client";

import type { Tables } from "@buneka/database";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  HandCoins,
  Home,
  LogOut,
  Menu,
  Package,
  ScanBarcode,
  Settings,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { CurrencyTicker } from "@/components/CurrencyTicker";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { CurrencyRates } from "@/lib/currency/tcmb";
import { createClient } from "@/lib/supabase/client";
import { CartProvider } from "./CartContext";

type AppUserWithRelations = Tables<"app_users"> & {
  organizations?: { name: string | null } | null;
  stores?: { name: string | null } | null;
};

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { name: "Fiyat Sorgula", href: "/app", icon: ScanBarcode },
  { name: "Günlük Kasa", href: "/app/kasa", icon: WalletCards },
  { name: "Stok Takibi", href: "/app/stok", icon: Boxes },
  { name: "Ürünler", href: "/app/urunler", icon: Package },
  { name: "Veresiye", href: "/app/veresiye", icon: HandCoins },
  { name: "Raporlar", href: "/app/raporlar", icon: BarChart3 },
  { name: "Ayarlar", href: "/app/ayarlar", icon: Settings },
];

function DrawerNav({
  pathname,
  onClose,
  onLogout,
  user,
}: {
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
  user: AppUserWithRelations;
}) {
  return (
    <div className="flex h-full flex-col text-white">
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  : "text-slate-300 hover:translate-x-0.5 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-cyan-300"} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-gradient-to-br from-cyan-400/25 to-blue-500/25 font-bold text-cyan-100 shadow-sm shadow-cyan-500/20">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{user.name}</span>
            <span className="text-xs text-slate-400">{user.organizations?.name}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-amber-300 transition-colors hover:bg-amber-300/10 active:scale-[0.98]"
        >
          <LogOut size={20} />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}

export default function AppShell({
  children,
  user,
  rates,
}: {
  children: React.ReactNode;
  user: AppUserWithRelations;
  rates: CurrencyRates | null;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden selection:bg-cyan-400 selection:text-slate-950">
      <header className="sidebar-surface z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 md:px-6">
        <Link href="/app" className="group flex flex-col gap-1">
          <span className="flex items-center gap-2.5">
            <BunekaMark size={24} className="transition-transform group-hover:scale-105" />
            <BunekaWordmark className="text-sm text-white" />
          </span>
          <span className="h-[2px] w-full max-w-[9rem] rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-transparent" />
          <span className="flex items-center gap-1.5 text-[11px] leading-none text-slate-400">
            <span className="font-semibold text-slate-200">{user.organizations?.name || "İşletme"}</span>
            <span className="text-slate-600">·</span>
            <span>{user.name}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <CurrencyTicker rates={rates} />
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-all hover:border-cyan-300/50 hover:text-white active:scale-90"
            aria-label="Site ana sayfası"
            title="Site ana sayfası"
          >
            <Home size={16} />
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
              <span className="flex items-center gap-2">
                <BunekaMark size={20} glow={false} />
                <span className="font-display text-base font-bold text-white">Menü</span>
              </span>
              <button
                onClick={closeMenu}
                className="text-white transition-transform active:scale-90"
                type="button"
                aria-label="Menüyü kapat"
              >
                <X size={22} />
              </button>
            </div>
            <DrawerNav pathname={pathname} onClose={closeMenu} onLogout={handleLogout} user={user} />
          </div>
          <button
            className="flex-1 cursor-default bg-black/50"
            onClick={closeMenu}
            type="button"
            aria-label="Menüyü kapat"
          />
        </div>
      )}

      <main className="flex-1 overflow-y-auto bg-[var(--color-bg)] p-4 text-[color:var(--color-text)] md:p-8">
        <CartProvider>{children}</CartProvider>
      </main>
    </div>
  );
}
