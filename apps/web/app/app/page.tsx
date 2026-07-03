"use client";

import type { Tables } from "@buneka/database";
import {
  AlertCircle,
  CheckCircle2,
  Home,
  Plus,
  ScanBarcode,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { createClient } from "@/lib/supabase/client";

type AppUser = Pick<Tables<"app_users">, "id" | "organization_id" | "store_id">;
type Product = Tables<"products">;

export default function FiyatSorgulaPage() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ queries: 0, sales: 0, revenue: 0 });
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const loadUserAndStats = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await supabase
      .from("app_users")
      .select("id, organization_id, store_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!userData) return;

    const currentUser = userData as AppUser;
    setAppUser(currentUser);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [{ count: queryCount }, { data: salesData }] = await Promise.all([
      supabase
        .from("price_queries")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", currentUser.organization_id)
        .gte("queried_at", today.toISOString()),
      supabase
        .from("sales")
        .select("total_amount")
        .eq("organization_id", currentUser.organization_id)
        .gte("sale_time", today.toISOString()),
    ]);

    setStats({
      queries: queryCount || 0,
      sales: salesData?.length || 0,
      revenue: salesData?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0,
    });
  }, [supabase]);

  useEffect(() => {
    if (isPriceOpen) inputRef.current?.focus();
    void Promise.resolve().then(loadUserAndStats);
  }, [isPriceOpen, loadUserAndStats]);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!barcode.trim() || !appUser) return;

    setLoading(true);
    setError("");
    setProduct(null);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("organization_id", appUser.organization_id)
      .eq("barcode", barcode.trim())
      .single();

    if (!data) {
      setError("Ürün bulunamadı");
      setLoading(false);
      return;
    }

    setProduct(data);
    await supabase.from("price_queries").insert({
      organization_id: appUser.organization_id,
      store_id: appUser.store_id,
      product_id: data.id,
      barcode: data.barcode,
      user_id: appUser.id,
      source: "manual",
    });
    await loadUserAndStats();
    setLoading(false);
  }

  async function handleSale() {
    if (!product || !appUser) return;

    const profit = product.sale_price - (product.purchase_price || 0);

    const { data: saleData } = await supabase
      .from("sales")
      .insert({
        organization_id: appUser.organization_id,
        store_id: appUser.store_id,
        user_id: appUser.id,
        total_amount: product.sale_price,
        total_profit: profit,
        payment_type: "cash",
      })
      .select()
      .single();

    if (!saleData) return;

    await supabase.from("sale_items").insert({
      sale_id: saleData.id,
      product_id: product.id,
      quantity: 1,
      sale_price: product.sale_price,
      purchase_price: product.purchase_price,
      profit,
    });

    await supabase
      .from("products")
      .update({ stock_quantity: product.stock_quantity - 1 })
      .eq("id", product.id);

    await supabase.from("stock_movements").insert({
      organization_id: appUser.organization_id,
      store_id: appUser.store_id,
      product_id: product.id,
      movement_type: "sale",
      quantity: -1,
      unit_price: product.sale_price,
      note: "Satış",
    });

    setProduct(null);
    setBarcode("");
    inputRef.current?.focus();
    await loadUserAndStats();
  }

  function handleCancel() {
    setProduct(null);
    setBarcode("");
    inputRef.current?.focus();
  }

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

  if (!isPriceOpen) {
    return (
      <main className="price-focus-bg relative grid min-h-screen place-items-center overflow-hidden px-5 py-8 text-[color:var(--color-text)]">
        <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-8 sm:top-8">
          <BunekaMark size={34} />
          <div>
            <BunekaWordmark className="text-sm text-[color:var(--color-text)]" />
            <p className="text-xs font-bold text-[color:var(--color-muted)]">Hızlı fiyat ekranı</p>
          </div>
        </div>

        <div className="w-full max-w-2xl rounded-[2rem] border border-[color:var(--color-border)] bg-[color:var(--color-card)]/82 p-6 text-center shadow-[0_28px_120px_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-lime-300 text-stone-950 shadow-[0_20px_70px_rgba(132,204,22,0.24)]">
            <ScanBarcode size={38} />
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-lime-200">
            <Sparkles size={13} /> Tek tuşla başlar
          </p>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            Fiyat Gör
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base font-semibold leading-7 text-stone-300">
            Barkodu okutun, ürünün fiyatını saniyeler içinde ekranda görün. Menü yok, karmaşa yok.
          </p>
          <button
            type="button"
            onClick={() => setIsPriceOpen(true)}
            className="cta-primary-animated mt-8 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-lime-300 via-[color:var(--color-primary)] to-emerald-500 px-6 text-lg font-black text-stone-950 shadow-[0_26px_80px_rgba(132,204,22,0.26)] transition-transform hover:scale-[1.01] active:scale-95 sm:w-auto sm:min-w-80"
          >
            <ScanBarcode size={24} /> Fiyat Gör Aç
          </button>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-stone-400">
            <Link href="/" className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 hover:border-lime-300/40 hover:text-lime-200">
              <Home size={13} /> Ana sayfa
            </Link>
            <Link href="/app/ayarlar" className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 hover:border-lime-300/40 hover:text-lime-200">
              <Settings size={13} /> Ayarlar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="price-focus-bg relative flex min-h-screen flex-col overflow-hidden p-3 text-[color:var(--color-text)] sm:p-5">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <BunekaMark size={28} />
          <div className="min-w-0">
            <BunekaWordmark className="text-xs text-white sm:text-sm" />
            <p className="truncate text-xs font-bold text-stone-400">Sadece fiyat sorgulama modu</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsPriceOpen(false);
            handleCancel();
          }}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-black text-stone-200 transition hover:border-amber-300/45 hover:text-amber-200"
        >
          <X size={16} /> Fiyat Görü Kapat
        </button>
      </div>

      <section className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col rounded-[1.75rem] border border-[color:var(--color-border)] bg-[color:var(--color-card)]/88 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-stone-950 shadow-[0_18px_52px_rgba(132,204,22,0.24)]">
              <ScanBarcode size={27} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">Bu ne kadar?</h1>
              <p className="text-sm font-semibold text-stone-400">Barkodu okutun veya yazın.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-black text-stone-400">
            <span className="rounded-xl border border-white/10 px-3 py-2"><b className="block text-lime-300">{stats.sales}</b>Satış</span>
            <span className="rounded-xl border border-white/10 px-3 py-2"><b className="block text-emerald-300">{formatMoney(stats.revenue)}</b>Kasa</span>
            <span className="rounded-xl border border-white/10 px-3 py-2"><b className="block text-amber-300">{stats.queries}</b>Sorgu</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              className="premium-input h-16 rounded-2xl border-lime-300/35 bg-stone-950/70 px-14 text-center text-lg font-black tracking-[0.16em] text-white placeholder:text-center focus:border-lime-300"
              placeholder="Barkod okutun..."
              autoComplete="off"
              disabled={loading}
            />
            <ScanBarcode className="absolute left-5 top-1/2 -translate-y-1/2 text-lime-300/70" size={22} />
            {!barcode && (
              <div className="scan-beam-track">
                <div className="scan-beam" />
              </div>
            )}
            <button type="submit" className="hidden">Ara</button>
          </div>
        </form>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-3xl border border-white/10 bg-stone-950/38 p-4 text-center">
          {loading ? (
            <div className="h-14 w-14 animate-spin rounded-full border-b-2 border-lime-300" />
          ) : error ? (
            <div className="w-full max-w-md rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5 text-center">
              <AlertCircle size={38} className="mx-auto mb-3 text-amber-300" />
              <h3 className="mb-4 text-lg font-black text-amber-200">{error}</h3>
              <Link href="/app/urunler" className="premium-button-amber shadow-none">
                <Plus size={20} /> Yeni Ürün Ekle
              </Link>
            </div>
          ) : product ? (
            <div className="w-full max-w-3xl">
              <span className="mb-3 inline-block rounded-full border border-lime-300/25 bg-lime-300/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-lime-200">
                {product.category || "Kategorisiz"}
              </span>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">{product.name}</h2>
              <p className="mt-3 font-mono text-sm font-bold text-stone-500">{product.barcode}</p>
              <div className="my-6 text-6xl font-black tracking-tight text-lime-300 sm:text-8xl">
                {formatMoney(product.sale_price)}
              </div>
              <div className="mx-auto mb-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3">
                <span className="font-bold text-stone-400">Stok:</span>
                <span className={`text-xl font-black ${product.stock_quantity <= product.min_stock ? "text-amber-300" : "text-white"}`}>
                  {product.stock_quantity} Adet
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={handleSale} className="action-sale min-h-14 w-full px-4 py-4 text-lg" type="button">
                  <CheckCircle2 size={24} /> Satış Yap
                </button>
                <button onClick={handleCancel} className="action-no-sale min-h-14 w-full px-4 py-4 text-lg" type="button">
                  Satış Yok
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[260px] w-full flex-col items-center justify-center">
              <ScanBarcode size={58} className="mb-4 text-lime-300/45" />
              <p className="text-lg font-black text-stone-300">Sorgulama yapmak için barkod okutun.</p>
              <p className="mt-2 text-sm font-semibold text-stone-500">Okuyucu klavye gibi çalışır; okutunca otomatik yazılır.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
