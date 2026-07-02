"use client";

import type { Tables } from "@buneka/database";
import {
  AlertCircle,
  Activity,
  Boxes,
  CheckCircle2,
  HandCoins,
  Loader2,
  Minus,
  Package,
  Plus,
  ScanBarcode,
  ShoppingCart,
  Trash2,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { QuickLinks } from "./_components/QuickLinks";
import { StatCard } from "./_components/StatCard";

type AppUser = Pick<Tables<"app_users">, "id" | "organization_id" | "store_id">;
type Product = Tables<"products">;
type CartItem = { product: Product; quantity: number };

export default function FiyatSorgulaPage() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ queries: 0, sales: 0, revenue: 0 });
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
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

  function addToCart() {
    if (!product) return;
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setProduct(null);
    setBarcode("");
    inputRef.current?.focus();
  }

  function updateCartQuantity(productId: string, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId: string) {
    setCart((current) => current.filter((item) => item.product.id !== productId));
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.sale_price * item.quantity, 0);

  async function handleCartCheckout() {
    if (!appUser || cart.length === 0) return;
    setCheckingOut(true);
    setCartMessage("");

    const totalAmount = cartTotal;
    const totalProfit = cart.reduce(
      (sum, item) => sum + (item.product.sale_price - (item.product.purchase_price || 0)) * item.quantity,
      0
    );

    const { data: saleData, error: saleError } = await supabase
      .from("sales")
      .insert({
        organization_id: appUser.organization_id,
        store_id: appUser.store_id,
        user_id: appUser.id,
        total_amount: totalAmount,
        total_profit: totalProfit,
        payment_type: "cash",
      })
      .select()
      .single();

    if (saleError || !saleData) {
      setCartMessage(`Satış kaydedilemedi: ${saleError?.message}`);
      setCheckingOut(false);
      return;
    }

    await supabase.from("sale_items").insert(
      cart.map((item) => ({
        sale_id: saleData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        sale_price: item.product.sale_price,
        purchase_price: item.product.purchase_price,
        profit: (item.product.sale_price - (item.product.purchase_price || 0)) * item.quantity,
      }))
    );

    await Promise.all(
      cart.map((item) =>
        supabase
          .from("products")
          .update({ stock_quantity: item.product.stock_quantity - item.quantity })
          .eq("id", item.product.id)
      )
    );

    await supabase.from("stock_movements").insert(
      cart.map((item) => ({
        organization_id: appUser.organization_id,
        store_id: appUser.store_id,
        product_id: item.product.id,
        movement_type: "sale",
        quantity: -item.quantity,
        unit_price: item.product.sale_price,
        note: "Satış (sepet)",
      }))
    );

    setCart([]);
    setCheckingOut(false);
    await loadUserAndStats();
  }

  function cancelCart() {
    setCart([]);
    setCartMessage("");
  }

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col">
      <QuickLinks
        links={[
          { href: "/app/kasa", label: "Günlük Kasa", icon: WalletCards },
          { href: "/app/stok", label: "Stok Takibi", icon: Boxes },
          { href: "/app/urunler", label: "Ürünler", icon: Package },
          { href: "/app/veresiye", label: "Veresiye", icon: HandCoins },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
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
                className="premium-input h-16 pl-14 text-lg font-medium tracking-wider"
                placeholder="Barkod okutun..."
                autoComplete="off"
                disabled={loading}
              />
              <ScanBarcode className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600/50 dark:text-slate-400/60" size={22} />
              {!barcode && (
                <div className="scan-beam-track">
                  <div className="scan-beam" />
                </div>
              )}
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

                <div className="grid gap-3 sm:grid-cols-3">
                  <button onClick={handleSale} className="action-sale min-h-16 w-full px-4 py-4 text-base sm:text-lg" type="button">
                    <CheckCircle2 size={22} /> Satış Yap
                  </button>
                  <button
                    onClick={addToCart}
                    className="glow-border flex min-h-16 w-full items-center justify-center gap-2 rounded-xl bg-cyan-50 px-4 py-4 text-base font-black text-cyan-700 transition-transform active:scale-95 dark:bg-cyan-500/10 dark:text-cyan-300 sm:text-lg"
                    type="button"
                  >
                    <ShoppingCart size={22} /> Sepete Ekle
                  </button>
                  <button onClick={handleCancel} className="action-no-sale min-h-16 w-full px-4 py-4 text-base sm:text-lg" type="button">
                    Tamam
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

        <aside className="glass-card flex w-full flex-col p-5 lg:w-80 lg:shrink-0">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingCart size={20} className="text-cyan-500" />
            <h2 className="font-display text-lg font-bold text-slate-950 dark:text-slate-50">Sepet</h2>
            {cart.length > 0 && (
              <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-black text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                {cart.length}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <ShoppingCart size={32} className="mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Birden çok ürün alacak müşteriler için ürünleri sepete ekleyin.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="text-sm font-bold leading-tight text-slate-800 dark:text-slate-200">{item.product.name}</p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="shrink-0 text-slate-400 transition-colors hover:text-orange-500"
                        aria-label="Sepetten çıkar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm active:scale-90 dark:bg-slate-700 dark:text-slate-200"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-sm font-black text-slate-800 dark:text-slate-200">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm active:scale-90 dark:bg-slate-700 dark:text-slate-200"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-black text-cyan-600 dark:text-cyan-300">
                        {formatMoney(item.product.sale_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {cartMessage && (
                <p className="mt-2 text-xs font-bold text-orange-600 dark:text-orange-400">{cartMessage}</p>
              )}

              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold text-slate-500 dark:text-slate-400">Toplam</span>
                  <span className="text-2xl font-black text-slate-950 dark:text-slate-50">{formatMoney(cartTotal)}</span>
                </div>
                <button
                  onClick={handleCartCheckout}
                  disabled={checkingOut}
                  className="action-sale min-h-14 w-full text-base"
                  type="button"
                >
                  {checkingOut ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                  Satışı Tamamla
                </button>
                <button
                  onClick={cancelCart}
                  disabled={checkingOut}
                  className="mt-2 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-bold text-slate-500 transition-colors hover:text-orange-500 dark:text-slate-400"
                  type="button"
                >
                  <X size={14} /> Sepeti İptal Et
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
