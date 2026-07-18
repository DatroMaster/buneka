"use client";

import type { Tables } from "@buneka/database";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CreditCard,
  Home,
  Loader2,
  Minus,
  Plus,
  Printer,
  ScanBarcode,
  Settings,
  ShoppingCart,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "./CartContext";

type AppUser = Pick<Tables<"app_users">, "id" | "organization_id" | "store_id">;
type Product = Tables<"products">;
type PaymentType = "cash" | "card";

export default function FiyatSorgulaPage() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ queries: 0, sales: 0, revenue: 0, cashRevenue: 0, cardRevenue: 0 });
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [organizationName, setOrganizationName] = useState("Buneka");
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const { cart, addToCart: addProductToCart, updateCartQuantity, removeFromCart, clearCart } = useCart();

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

    const [{ count: queryCount }, { data: salesData }, { data: organizationData }] = await Promise.all([
      supabase
        .from("price_queries")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", currentUser.organization_id)
        .gte("queried_at", today.toISOString()),
      supabase
        .from("sales")
        .select("total_amount, payment_type")
        .eq("organization_id", currentUser.organization_id)
        .gte("sale_time", today.toISOString()),
      supabase
        .from("organizations")
        .select("name")
        .eq("id", currentUser.organization_id)
        .single(),
    ]);

    if (organizationData?.name) setOrganizationName(organizationData.name);
    setStats({
      queries: queryCount || 0,
      sales: salesData?.length || 0,
      revenue: salesData?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0,
      cashRevenue:
        salesData?.reduce((acc, sale) => acc + (sale.payment_type === "card" ? 0 : Number(sale.total_amount)), 0) || 0,
      cardRevenue:
        salesData?.reduce((acc, sale) => acc + (sale.payment_type === "card" ? Number(sale.total_amount) : 0), 0) || 0,
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

  async function handleSale(paymentType: PaymentType) {
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
        payment_type: paymentType,
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
    addProductToCart(product);
    setCartMessage(`${product.name} sepete eklendi.`);
    setProduct(null);
    setBarcode("");
    inputRef.current?.focus();
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.sale_price * item.quantity, 0);

  function escapeReceiptText(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function printCartReceipt() {
    if (cart.length === 0) return;

    const receiptWindow = window.open("", "buneka-receipt", "width=420,height=720");
    if (!receiptWindow) {
      setCartMessage("Fiş penceresi açılamadı. Tarayıcı açılır pencere iznini kontrol edin.");
      return;
    }

    const now = new Date();
    const receiptBusinessName = escapeReceiptText(organizationName || "İşletme");
    const lines = cart
      .map(
        (item) => `
          <tr>
            <td>
              <b>${escapeReceiptText(item.product.name)}</b>
              <small>${escapeReceiptText(item.product.barcode)}</small>
            </td>
            <td>${item.quantity}</td>
            <td>${formatMoney(item.product.sale_price * item.quantity)}</td>
          </tr>`
      )
      .join("");

    receiptWindow.document.write(`
      <!doctype html>
      <html lang="tr">
        <head>
          <meta charset="utf-8" />
          <title>${receiptBusinessName} Sepet Fişi</title>
          <style>
            @page { size: 80mm auto; margin: 5mm; }
            * { box-sizing: border-box; }
            body {
              width: 70mm;
              margin: 0 auto;
              color: #05070d;
              background: #f4f7fb;
              font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
              font-size: 11px;
            }
            header { text-align: center; border-bottom: 1px dashed #05070d; padding: 0 0 8px; margin-bottom: 8px; }
            h1 { margin: 0; font-size: 17px; letter-spacing: 0.08em; overflow-wrap: anywhere; }
            p { margin: 3px 0; }
            table { width: 100%; border-collapse: collapse; }
            th { border-bottom: 1px dashed #05070d; padding: 5px 0; text-align: left; }
            th:nth-child(2), td:nth-child(2) { text-align: center; width: 28px; }
            th:nth-child(3), td:nth-child(3) { text-align: right; width: 70px; }
            td { border-bottom: 1px dotted #f4f7fb; padding: 6px 0; vertical-align: top; }
            td b { display: block; font-size: 11px; }
            td small { display: block; color: #090d14; font-size: 9px; margin-top: 2px; }
            .total { display: flex; justify-content: space-between; border-top: 1px dashed #05070d; margin-top: 8px; padding-top: 8px; font-size: 15px; font-weight: 900; }
            footer { margin-top: 10px; text-align: center; color: #090d14; }
            @media screen { body { padding: 16px 0; } }
          </style>
        </head>
        <body>
          <header>
            <h1>${receiptBusinessName}</h1>
            <p>Sepet Fişi</p>
            <p>${now.toLocaleDateString("tr-TR")} ${now.toLocaleTimeString("tr-TR")}</p>
          </header>
          <table>
            <thead><tr><th>Ürün</th><th>Ad</th><th>Tutar</th></tr></thead>
            <tbody>${lines}</tbody>
          </table>
          <div class="total"><span>Toplam</span><span>${formatMoney(cartTotal)}</span></div>
          <footer>
            <p>Toplam ürün: ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p>Buneka resmi mali fiş değildir.</p>
          </footer>
          <script>
            window.onload = () => {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  }

  async function handleCartCheckout(paymentType: PaymentType) {
    if (!appUser || cart.length === 0 || checkingOut) return;

    setCheckingOut(true);
    setCartMessage("");

    const totalProfit = cart.reduce(
      (sum, item) => sum + (item.product.sale_price - (item.product.purchase_price || 0)) * item.quantity,
      0
    );

    const { data: saleData } = await supabase
      .from("sales")
      .insert({
        organization_id: appUser.organization_id,
        store_id: appUser.store_id,
        user_id: appUser.id,
        total_amount: cartTotal,
        total_profit: totalProfit,
        payment_type: paymentType,
      })
      .select()
      .single();

    if (!saleData) {
      setCartMessage("Sepet satışı kaydedilemedi. Lütfen tekrar deneyin.");
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

    clearCart();
    setCheckingOut(false);
    setCartMessage(`Sepet ${paymentType === "card" ? "kartlı" : "nakit"} satış olarak tamamlandı.`);
    await loadUserAndStats();
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-primary)] text-slate-950 shadow-[0_20px_70px_rgba(62,207,142,0.24)]">
            <ScanBarcode size={38} />
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-200">
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
            className="mt-8 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#f4f7fb] px-6 text-lg font-black text-[#090d14] shadow-[0_0_0_1px_rgba(0,255,123,0.24),0_24px_70px_rgba(0,255,123,0.18)] transition-transform hover:scale-[1.01] active:scale-95 sm:w-auto sm:min-w-80"
          >
            <ScanBarcode size={24} /> Fiyat Gör Aç
          </button>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-stone-400">
            <Link href="/" className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 hover:border-emerald-300/40 hover:text-emerald-200">
              <Home size={13} /> Ana sayfa
            </Link>
            <Link href="/app/urunler" className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 hover:border-emerald-300/40 hover:text-emerald-200">
              <Settings size={13} /> Yönetim Platformu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="price-focus-bg relative flex min-h-screen flex-col overflow-x-hidden overflow-y-auto p-3 text-[color:var(--color-text)] sm:p-5">
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
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-black text-stone-200 transition hover:border-[#f4f7fb]/45 hover:text-[#f4f7fb]"
        >
          <X size={16} /> Fiyat Görü Kapat
        </button>
      </div>

      <section className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col rounded-[1.75rem] border border-[color:var(--color-border)] bg-[color:var(--color-card)]/88 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-primary)] text-slate-950 shadow-[0_18px_52px_rgba(62,207,142,0.24)]">
              <ScanBarcode size={27} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">Bu ne kadar?</h1>
              <p className="text-sm font-semibold text-stone-400">Barkodu okutun veya yazın.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-black text-stone-400 sm:grid-cols-5">
            <span className="rounded-xl border border-white/10 px-3 py-2"><b className="block text-emerald-300">{stats.sales}</b>Satış</span>
            <span className="rounded-xl border border-white/10 px-3 py-2"><b className="block text-emerald-300">{formatMoney(stats.revenue)}</b>Kasa</span>
            <span className="rounded-xl border border-white/10 px-3 py-2"><b className="block text-emerald-300">{formatMoney(stats.cashRevenue)}</b>Nakit</span>
            <span className="rounded-xl border border-white/10 px-3 py-2"><b className="block text-cyan-200">{formatMoney(stats.cardRevenue)}</b>Kart</span>
            <span className="rounded-xl border border-white/10 px-3 py-2"><b className="block text-[#f4f7fb]">{stats.queries}</b>Sorgu</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              className="premium-input h-16 rounded-2xl border-emerald-300/35 bg-neutral-950/70 px-14 text-center text-lg font-black tracking-[0.16em] text-white placeholder:text-center focus:border-emerald-300"
              placeholder="Barkod okutun..."
              autoComplete="off"
              disabled={loading}
            />
            <ScanBarcode className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300/70" size={22} />
            {!barcode && (
              <div className="scan-beam-track">
                <div className="scan-beam" />
              </div>
            )}
            <button type="submit" className="hidden">Ara</button>
          </div>
        </form>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-stone-950/38 p-4 text-center">
          {loading ? (
            <div className="h-14 w-14 animate-spin rounded-full border-b-2 border-emerald-300" />
          ) : error ? (
            <div className="w-full max-w-md rounded-2xl border border-[#f4f7fb]/45 bg-[#05070d] p-5 text-center shadow-[0_0_0_1px_rgba(245,158,11,0.08)]">
              <AlertCircle size={38} className="mx-auto mb-3 text-[#f4f7fb]" />
              <h3 className="mb-4 text-lg font-black text-[#f4f7fb]">{error}</h3>
              <Link href="/app/urunler" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#f4f7fb]/55 bg-transparent px-4 py-2.5 text-sm font-black text-[#f4f7fb] transition hover:border-[#f4f7fb] hover:bg-[#f4f7fb]/10">
                <Plus size={20} /> Yeni Ürün Ekle
              </Link>
            </div>
          ) : product ? (
            <div className="w-full max-w-3xl">
              <span className="mb-3 inline-block rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-200">
                {product.category || "Kategorisiz"}
              </span>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">{product.name}</h2>
              <p className="mt-3 font-mono text-sm font-bold text-stone-500">{product.barcode}</p>
              <div className="my-6 text-6xl font-black tracking-tight text-emerald-300 sm:text-8xl">
                {formatMoney(product.sale_price)}
              </div>
              <div className="mx-auto mb-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3">
                <span className="font-bold text-stone-400">Stok:</span>
                <span className={`text-xl font-black ${product.stock_quantity <= product.min_stock ? "text-[#f4f7fb]" : "text-white"}`}>
                  {product.stock_quantity} Adet
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <button onClick={() => handleSale("cash")} className="action-sale min-h-14 w-full px-4 py-4 text-base" type="button">
                  <Banknote size={22} /> Nakit Satış
                </button>
                <button onClick={() => handleSale("card")} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/35 bg-cyan-300/10 px-4 py-4 text-base font-black text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/18 active:scale-95" type="button">
                  <CreditCard size={22} /> Kartlı Satış
                </button>
                <button
                  onClick={addToCart}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300/35 bg-emerald-300/10 px-4 py-4 text-base font-black text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-300/18 active:scale-95"
                  type="button"
                >
                  <ShoppingCart size={22} /> Sepete Ekle
                </button>
                <button onClick={handleCancel} className="action-no-sale min-h-14 w-full px-4 py-4 text-base" type="button">
                  Satış Yok
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[260px] w-full flex-col items-center justify-center">
              <ScanBarcode size={58} className="mb-4 text-emerald-300/45" />
              <p className="text-lg font-black text-stone-300">Sorgulama yapmak için barkod okutun.</p>
              <p className="mt-2 text-sm font-semibold text-stone-500">Okuyucu klavye gibi çalışır; okutunca otomatik yazılır.</p>
            </div>
          )}
        </div>
        <aside className="flex min-h-[300px] flex-col rounded-3xl border border-emerald-300/18 bg-neutral-950/58 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-black text-white">
              <ShoppingCart className="text-emerald-300" size={22} /> Sepet
            </h2>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-stone-300">
              {cart.length} ürün
            </span>
          </div>
          {cartMessage && (
            <p className="mb-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-100">
              {cartMessage}
            </p>
          )}
          {cart.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-5 text-center">
              <ShoppingCart size={42} className="mb-3 text-stone-600" />
              <p className="text-sm font-bold text-stone-400">Çoklu ürün satışı için okutulan ürünleri sepete ekleyin.</p>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-white">{item.product.name}</p>
                        <p className="mt-1 text-xs font-bold text-stone-500">{formatMoney(item.product.sale_price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="rounded-lg border border-white/10 p-1.5 text-stone-400 transition hover:border-[#f4f7fb]/40 hover:text-[#f4f7fb]"
                        aria-label="Sepetten çıkar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="p-2 text-stone-300 hover:text-emerald-200"
                          aria-label="Adet azalt"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-8 text-center text-sm font-black text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="p-2 text-stone-300 hover:text-emerald-200"
                          aria-label="Adet artır"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-black text-emerald-300">{formatMoney(item.product.sale_price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3">
                <div className="flex items-center justify-between text-sm font-black">
                  <span className="text-stone-300">Toplam</span>
                  <span className="text-xl text-emerald-200">{formatMoney(cartTotal)}</span>
                </div>
                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={printCartReceipt}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#090d14] bg-[#05070d] px-4 py-3 text-sm font-black text-[#f4f7fb] transition hover:border-[#f4f7fb]/50 active:scale-95"
                  >
                    <Printer size={18} /> Fiş Yazdır / PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCartCheckout("cash")}
                    disabled={checkingOut}
                    className="action-sale min-h-12 w-full px-4 py-3"
                  >
                    {checkingOut ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={20} />}
                    Sepeti Nakit Satışa Çevir
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCartCheckout("card")}
                    disabled={checkingOut}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/35 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/18 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkingOut ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={20} />}
                    Sepeti Kartlı Satışa Çevir
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setCartMessage("");
                    }}
                    className="action-no-sale min-h-11 w-full px-4 py-3"
                  >
                    Sepeti Temizle
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>
        </div>
      </section>
    </main>
  );
}
