"use client";

import type { Tables } from "@buneka/database";
import { AlertCircle, Activity, CheckCircle2, Plus, ScanBarcode, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatCard } from "./_components/StatCard";

type AppUser = Pick<Tables<"app_users">, "id" | "organization_id" | "store_id">;
type Product = Tables<"products">;

export default function FiyatSorgulaPage() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ queries: 0, sales: 0, revenue: 0 });
  const [appUser, setAppUser] = useState<AppUser | null>(null);
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
    inputRef.current?.focus();
    void Promise.resolve().then(loadUserAndStats);
  }, [loadUserAndStats]);

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

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      <div className="glass-card flex flex-1 flex-col p-6 md:p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <ScanBarcode size={26} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl dark:text-slate-50">Bu ne kadar?</h1>
            <p className="font-medium text-slate-500 dark:text-slate-400">Ürün fiyat sorgulaması yap. Barkodu okut veya yaz.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              className="premium-input h-16 pl-12 text-lg font-medium tracking-wider"
              placeholder="Barkod okutun..."
              autoComplete="off"
              disabled={loading}
            />
            <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600/50 dark:text-slate-400/60" size={22} />
            <button type="submit" className="hidden">Ara</button>
          </div>
        </form>

        <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center">
          {loading ? (
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500" />
          ) : error ? (
            <div className="w-full max-w-md rounded-2xl bg-orange-50 p-8 text-center ring-1 ring-orange-200 dark:bg-orange-500/10 dark:ring-orange-500/20">
              <AlertCircle size={44} className="mx-auto mb-4 text-orange-600 dark:text-orange-400" />
              <h3 className="mb-6 text-xl font-bold text-orange-600 dark:text-orange-400">{error}</h3>
              <Link href="/app/urunler" className="premium-button-amber shadow-none">
                <Plus size={20} /> Yeni Ürün Ekle
              </Link>
            </div>
          ) : product ? (
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:p-10">
              <span className="mb-4 inline-block rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                {product.category || "Kategorisiz"}
              </span>
              <h2 className="mb-3 text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl dark:text-slate-50">{product.name}</h2>
              <p className="mb-6 font-mono text-sm font-bold text-slate-400 dark:text-slate-500">{product.barcode}</p>

              <div className="mb-8 text-7xl font-black tracking-tight text-cyan-600 md:text-8xl dark:text-cyan-300">
                {formatMoney(product.sale_price)}
              </div>

              <div className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
                <span className="font-bold text-slate-500 dark:text-slate-400">Stok Durumu:</span>
                <span className={`text-lg font-black ${product.stock_quantity <= product.min_stock ? "text-orange-600 dark:text-orange-400" : "text-slate-950 dark:text-slate-50"}`}>
                  {product.stock_quantity} Adet
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button onClick={handleSale} className="action-sale min-h-20 w-full px-6 py-5 text-2xl" type="button">
                  <CheckCircle2 size={30} /> Satış Yap
                </button>
                <button onClick={handleCancel} className="action-no-sale min-h-20 w-full px-6 py-5 text-2xl" type="button">
                  Satış Yok
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <ScanBarcode size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">Sorgulama yapmak için barkod okutun.</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:grid-cols-3">
          <StatCard icon={CheckCircle2} label="Bugün Satış" value={String(stats.sales)} tone="primary" />
          <StatCard icon={TrendingUp} label="Bugün Kasa" value={formatMoney(stats.revenue)} tone="green" />
          <StatCard icon={Activity} label="Bugün Sorgu" value={String(stats.queries)} tone="amber" />
        </div>
      </div>
    </div>
  );
}
