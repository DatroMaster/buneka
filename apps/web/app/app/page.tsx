"use client";

import type { Tables } from "@buneka/database";
import { AlertCircle, CheckCircle2, Plus, ScanBarcode } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Bu ne kadar?</h1>
        <p className="text-slate-600">Ürün fiyat sorgulaması yap. Barkodu okut veya yaz.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <ScanBarcode size={24} className="text-cyan-500" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={(event) => setBarcode(event.target.value)}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white py-6 pl-12 pr-4 text-2xl font-black text-slate-950 shadow-sm placeholder-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
            placeholder="Barkod okutun..."
            autoComplete="off"
            disabled={loading}
          />
          <button type="submit" className="hidden">Ara</button>
        </div>
      </form>

      <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center">
        {loading ? (
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500" />
        ) : error ? (
          <div className="w-full max-w-md rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle size={48} className="mx-auto mb-4 text-orange-500" />
            <h3 className="mb-2 text-xl font-bold text-slate-950">{error}</h3>
            <Link
              href="/app/urunler"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-sm transition-all hover:scale-[1.01] active:scale-95"
            >
              <Plus size={20} /> Yeni Ürün Ekle
            </Link>
          </div>
        ) : product ? (
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <div className="mb-6 text-center">
              <span className="mb-4 inline-block rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase text-cyan-700">
                {product.category || "Kategorisiz"}
              </span>
              <h2 className="mb-3 text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">{product.name}</h2>
              <p className="font-mono text-sm font-bold text-slate-500">{product.barcode}</p>
            </div>

            <div className="mb-8 flex justify-center">
              <span className="text-7xl font-black tracking-tight text-cyan-600 md:text-8xl">
                {formatMoney(product.sale_price)}
              </span>
            </div>

            <div className="mb-8 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              <span className="font-bold text-slate-500">Stok Durumu</span>
              <span className={`text-lg font-black ${product.stock_quantity <= product.min_stock ? "text-orange-600" : "text-slate-950"}`}>
                {product.stock_quantity} Adet
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleSale}
                className="action-sale min-h-20 w-full px-6 py-5 text-2xl"
                type="button"
              >
                <CheckCircle2 size={30} /> Satış Yap
              </button>
              <button
                onClick={handleCancel}
                className="action-no-sale min-h-20 w-full px-6 py-5 text-2xl"
                type="button"
              >
                Satış Yok
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center text-slate-500">
            <ScanBarcode size={64} className="mb-4 opacity-20" />
            <p className="text-lg">Sorgulama yapmak için barkod okutun.</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
        <SummaryCard label="Bugün Satış" value={String(stats.sales)} />
        <SummaryCard label="Bugün Kasa" value={formatMoney(stats.revenue)} highlight="text-emerald-600" />
        <SummaryCard label="Bugün Sorgu" value={String(stats.queries)} highlight="text-orange-500" />
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight = "text-slate-950",
}: {
  label: string;
  value: string;
  highlight?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-1 text-sm font-bold text-slate-500">{label}</p>
      <p className={`text-xl font-bold ${highlight}`}>{value}</p>
    </div>
  );
}
