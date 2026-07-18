"use client";

import type { Tables } from "@buneka/database";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  HandCoins,
  Home,
  LockKeyhole,
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
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ClientIpBadge } from "@/components/ClientIpBadge";
import { CurrencyTicker } from "@/components/CurrencyTicker";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { CurrencyRates } from "@/lib/currency/tcmb";
import type { FeatureCode } from "@/lib/licensing/access";
import { createClient } from "@/lib/supabase/client";
import { CartProvider } from "./CartContext";
import { LicenseAccessProvider } from "./LicenseAccessContext";

type AppUserWithRelations = Tables<"app_users"> & {
  organizations?: { name: string | null } | null;
  stores?: { name: string | null } | null;
};

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  feature?: FeatureCode;
};

const navItems: NavItem[] = [
  { name: "Fiyat Sorgula", href: "/app", icon: ScanBarcode, feature: "price_query" },
  { name: "Günlük Kasa", href: "/app/kasa", icon: WalletCards, feature: "daily_cash" },
  { name: "Stok Takibi", href: "/app/stok", icon: Boxes, feature: "stock_tracking" },
  { name: "Ürünler", href: "/app/urunler", icon: Package, feature: "product_create" },
  { name: "Veresiye", href: "/app/veresiye", icon: HandCoins, feature: "campaign_access" },
  { name: "Raporlar", href: "/app/raporlar", icon: BarChart3, feature: "reports" },
  { name: "Ayarlar", href: "/app/ayarlar", icon: Settings },
];

const PATH_FEATURES: Record<string, FeatureCode> = {
  "/app": "price_query",
  "/app/price": "price_query",
  "/app/kasa": "daily_cash",
  "/app/cash": "daily_cash",
  "/app/stok": "stock_tracking",
  "/app/stock": "stock_tracking",
  "/app/urunler": "product_create",
  "/app/products": "product_create",
  "/app/veresiye": "campaign_access",
  "/app/raporlar": "reports",
  "/app/reports": "reports",
};

const APP_VERSION_LABEL = "BUNEKA V01";

function DrawerNav({
  pathname,
  onClose,
  onLogout,
  user,
  items,
}: {
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
  user: AppUserWithRelations;
  items: NavItem[];
}) {
  return (
    <div className="flex h-full flex-col text-white">
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? "bg-emerald-400/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-slate-300 hover:translate-x-0.5 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-emerald-200" : "text-emerald-300"} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
          {APP_VERSION_LABEL}
        </div>
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 font-bold text-emerald-100 shadow-sm shadow-emerald-500/10">
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

function DesktopSidebar({
  pathname,
  onLogout,
  user,
  items,
}: {
  pathname: string;
  onLogout: () => void;
  user: AppUserWithRelations;
  items: NavItem[];
}) {
  return (
    <aside className="sidebar-supabase hidden h-full w-56 shrink-0 flex-col overflow-hidden border-r border-white/10 md:flex">
      <div className="flex h-16 items-center justify-start gap-2 border-b border-white/10 px-3">
        <BunekaMark size={24} className="shrink-0" />
        <div className="min-w-0">
          <BunekaWordmark className="text-sm text-white" />
          <p className="truncate text-[11px] font-medium text-slate-400">{user.organizations?.name || "İşletme"}</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={`group/item flex h-10 w-full items-center justify-start gap-3 rounded-md px-1 text-sm transition-all ${
                isActive
                  ? "bg-emerald-400/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-slate-100"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
                  isActive
                    ? "border-emerald-300/45 bg-emerald-300/15 text-emerald-200"
                    : "border-white/10 bg-white/[0.04] text-emerald-100 group-hover/item:border-emerald-300/35 group-hover/item:text-emerald-200"
                }`}
              >
                <Icon size={18} strokeWidth={2.35} className="shrink-0 drop-shadow-[0_0_6px_rgba(103,232,249,0.45)]" />
              </span>
              <span className="whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-2">
        <div className="mb-2 rounded-md border border-amber-300/20 bg-amber-300/10 px-2 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
          {APP_VERSION_LABEL}
        </div>
        <div className="mb-2 flex h-10 w-full items-center justify-start gap-3 rounded-md px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/10 text-sm font-black text-emerald-200">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.stores?.name || "Ana mağaza"}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex h-10 w-full items-center justify-start gap-3 rounded-md px-2 text-sm font-medium text-slate-300 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          type="button"
          title="Çıkış Yap"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="whitespace-nowrap">
            Çıkış Yap
          </span>
        </button>
      </div>
    </aside>
  );
}

export default function AppShell({
  children,
  user,
  rates,
  licenseAccess,
}: {
  children: React.ReactNode;
  user: AppUserWithRelations;
  rates: CurrencyRates | null;
  licenseAccess: {
    planName: string | null;
    expiresAt: string | null;
    featureCodes: FeatureCode[];
  };
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = ["super_admin", "admin_staff"].includes(user.role);
  const isPriceFocusEntry = pathname === "/app";
  const featureSet = new Set<FeatureCode>(licenseAccess.featureCodes);
  const canUseFeature = (feature?: FeatureCode) => isAdmin || !feature || featureSet.has(feature);
  const availableNavItems = navItems.filter((item) => canUseFeature(item.feature));
  const requiredFeature = PATH_FEATURES[pathname];
  const canUseCurrentPath = canUseFeature(requiredFeature);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (isPriceFocusEntry) {
    return (
      <div className="min-h-screen overflow-hidden bg-[var(--color-bg)] selection:bg-emerald-300 selection:text-slate-950">
        <LicenseAccessProvider value={licenseAccess}>
          <CartProvider>{canUseCurrentPath ? children : <LockedLicensePanel licenseAccess={licenseAccess} />}</CartProvider>
        </LicenseAccessProvider>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] selection:bg-emerald-400 selection:text-slate-950">
      <DesktopSidebar pathname={pathname} onLogout={handleLogout} user={user} items={availableNavItems} />

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="sidebar-supabase h-full w-full max-w-xs overflow-y-auto shadow-2xl">
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
            <DrawerNav pathname={pathname} onClose={closeMenu} onLogout={handleLogout} user={user} items={availableNavItems} />
          </div>
          <button
            className="flex-1 cursor-default bg-black/50"
            onClick={closeMenu}
            type="button"
            aria-label="Menüyü kapat"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sidebar-supabase z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 md:px-6">
          <Link href="/app" className="flex items-center gap-2 md:hidden">
            <BunekaMark size={24} />
            <BunekaWordmark className="text-sm text-white" />
          </Link>
          <div className="hidden min-w-0 md:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">Buneka Console</p>
            <p className="truncate text-sm font-medium text-slate-300">
              {user.organizations?.name || "İşletme"} · {user.name}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <div className="hidden sm:block">
              <CurrencyTicker rates={rates} />
            </div>
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden items-center gap-1.5 rounded-md border border-emerald-300/25 px-3 py-2 text-xs font-bold text-emerald-200 transition-all hover:border-emerald-300/50 hover:bg-emerald-300/10 sm:flex"
              >
                <Settings size={14} /> Yönetim
              </Link>
            )}
            <BunekaNedirButton variant="compact" className="hidden border-white/15 text-emerald-300 hover:border-emerald-300/50 sm:flex" />
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-slate-300 transition-all hover:border-emerald-300/40 hover:bg-white/[0.04] hover:text-white active:scale-90"
              aria-label="Site ana sayfası"
              title="Site ana sayfası"
            >
              <Home size={16} />
            </Link>
            <ThemeToggle className="border-white/10 text-slate-300 hover:border-emerald-300/40 hover:text-white" />
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-slate-300 transition-all hover:border-emerald-300/40 hover:bg-white/[0.04] hover:text-white active:scale-90 md:hidden"
              type="button"
              aria-label="Menüyü aç"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[var(--color-bg)] p-4 text-[color:var(--color-text)] md:p-5">
          <LicenseAccessProvider value={licenseAccess}>
            <CartProvider>{canUseCurrentPath ? children : <LockedLicensePanel licenseAccess={licenseAccess} />}</CartProvider>
          </LicenseAccessProvider>
        </main>
        <div className="pointer-events-none fixed bottom-2 right-3 z-40 hidden rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-[10px] font-semibold text-slate-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#05070d]/70 dark:text-slate-400 md:block">
          BUNEKA © 2026 · Ankara, TR · <ClientIpBadge />
        </div>
      </div>
    </div>
  );
}

function LockedLicensePanel({
  licenseAccess,
}: {
  licenseAccess: {
    planName: string | null;
    expiresAt: string | null;
    featureCodes: FeatureCode[];
  };
}) {
  return (
    <div className="grid min-h-[calc(100vh-2rem)] place-items-center p-4">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#00040d] p-6 text-center shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
          <LockKeyhole size={26} />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Paket yetkisi gerekli</p>
        <h1 className="mt-2 font-display text-3xl font-black text-white">Bu ekran mevcut lisansınızda açık değil.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-slate-400">
          Aktif paketiniz {licenseAccess.planName ? <b className="text-slate-100">{licenseAccess.planName}</b> : "tanımlı değil"}.
          Bu özelliği kullanmak için yönetici panelinden uygun Buneka paketi veya ek modül atanmalıdır.
        </p>
        {licenseAccess.expiresAt && (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold text-slate-300">
            Lisans bitiş tarihi: {new Date(licenseAccess.expiresAt).toLocaleDateString("tr-TR")}
          </p>
        )}
        <Link
          href="/app/ayarlar"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300/25 px-5 text-sm font-black text-emerald-200 transition hover:border-emerald-300/50 hover:bg-emerald-300/10"
        >
          Lisans Bilgisini Gör
        </Link>
      </section>
    </div>
  );
}
