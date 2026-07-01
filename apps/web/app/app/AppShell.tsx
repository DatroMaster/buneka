"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ScanBarcode,
  WalletCards,
  Boxes,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Barcode
} from "lucide-react";

export default function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Fiyat Sorgula", href: "/app", icon: ScanBarcode },
    { name: "Günlük Kasa", href: "/app/kasa", icon: WalletCards },
    { name: "Stok Takibi", href: "/app/stok", icon: Boxes },
    { name: "Ürünler", href: "/app/urunler", icon: Package },
    { name: "Raporlar", href: "/app/raporlar", icon: BarChart3 },
    { name: "Ayarlar", href: "/app/ayarlar", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#0F1A12] text-[#E8EDE9]">
      {/* Logo Area */}
      <div className="flex h-20 shrink-0 items-center px-6">
        <Link href="/app" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F6F52] text-white">
            <Barcode size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Buneka</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-[#4F6F52] text-white"
                  : "text-[#8A9B8E] hover:bg-[#1A2B1E] hover:text-white"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-[#8A9B8E]"} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-[#2F4A35] p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-[#1A2B1E] flex items-center justify-center text-[#E8EDE9] font-bold border border-[#2F4A35]">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{user?.name}</span>
            <span className="text-xs text-[#8A9B8E]">{user?.organizations?.name}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-[#B65A3C] hover:bg-[#B65A3C]/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0F1A12] overflow-hidden selection:bg-[#4F6F52] selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F1A12] flex items-center justify-between px-4 z-50 border-b border-[#2F4A35]">
        <Link href="/app" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F6F52] text-white">
            <Barcode size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-white">Buneka</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0F1A12] pt-16">
          <SidebarContent />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:rounded-tl-[2.5rem] bg-[#1A2B1E] border-l border-t border-[#2F4A35] overflow-hidden mt-16 md:mt-0 shadow-[-10px_-10px_30px_rgba(0,0,0,0.5)]">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 text-[#E8EDE9]">
          {children}
        </main>
      </div>
    </div>
  );
}
