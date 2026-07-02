"use client";

import type { Tables } from "@buneka/database";
import type { LucideIcon } from "lucide-react";
import {
  Barcode,
  BarChart3,
  Boxes,
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
import { createClient } from "@/lib/supabase/client";

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
  { name: "Raporlar", href: "/app/raporlar", icon: BarChart3 },
  { name: "Ayarlar", href: "/app/ayarlar", icon: Settings },
];

type SidebarContentProps = {
  user: AppUserWithRelations;
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
};

function SidebarContent({
  user,
  pathname,
  onClose,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="sidebar-surface flex h-full flex-col text-white">
      <div className="flex h-20 shrink-0 items-center px-6">
        <Link href="/app" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/40 transition-transform group-hover:scale-105">
            <Barcode size={19} strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">Buneka</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-0.5"
              }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-cyan-300"} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400/25 to-blue-500/25 flex items-center justify-center text-cyan-100 font-bold border border-cyan-300/25 shadow-sm shadow-cyan-500/20">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{user.name}</span>
            <span className="text-xs text-slate-400">{user.organizations?.name}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-amber-300 hover:bg-amber-300/10 transition-colors active:scale-[0.98]"
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
}: {
  children: React.ReactNode;
  user: AppUserWithRelations;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="sidebar-surface flex h-screen overflow-hidden selection:bg-cyan-400 selection:text-slate-950">
      <div className="hidden md:flex md:w-64 md:flex-col shrink-0">
        <SidebarContent
          user={user}
          pathname={pathname}
          onClose={closeMobileMenu}
          onLogout={handleLogout}
        />
      </div>

      <div className="sidebar-surface md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50 border-b border-white/10">
        <Link href="/app" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-md shadow-cyan-500/30">
            <Barcode size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold text-white">Buneka</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white transition-transform active:scale-90"
          type="button"
          aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="sidebar-surface md:hidden fixed inset-0 z-40 pt-16">
          <SidebarContent
            user={user}
            pathname={pathname}
            onClose={closeMobileMenu}
            onLogout={handleLogout}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 md:rounded-tl-[2rem] bg-[#F6F8FB] border-l border-t border-white/10 overflow-hidden mt-16 md:mt-0 shadow-[-10px_-10px_30px_rgba(0,0,0,0.22)]">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 text-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
