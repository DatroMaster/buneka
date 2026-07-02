"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Crown,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  ScanLine,
  Search,
  ShoppingCart,
  Trash2,
  WalletCards,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";
import { plans } from "@/lib/content/plans";

type DemoProduct = {
  barcode: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type CartLine = {
  product: DemoProduct;
  quantity: number;
};

const products: DemoProduct[] = [
  { barcode: "8690000000011", name: "Su 500 ml", category: "İçecek", price: 12, stock: 48 },
  { barcode: "8690000000028", name: "Çikolata Mini", category: "Atıştırmalık", price: 18.5, stock: 22 },
  { barcode: "8690000000035", name: "Defter A5", category: "Kırtasiye", price: 42, stock: 8 },
  { barcode: "8690000000042", name: "Kalem Mavi", category: "Kırtasiye", price: 9.75, stock: 65 },
];

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

const PLAN_ICONS = [ScanLine, WalletCards, Boxes, Crown];
const PLAN_BORDER_COLORS = ["glow-border-turquoise", "glow-border-amber", "glow-border-green", "glow-border-violet"];

export default function DemoPage() {
  const [barcode, setBarcode] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [queries, setQueries] = useState<string[]>([]);
  const [completedTotal, setCompletedTotal] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cart, setCart] = useState<CartLine[]>([]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.barcode === selectedBarcode),
    [selectedBarcode]
  );

  const cartTotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  function lookup(nextBarcode: string) {
    const cleanBarcode = nextBarcode.trim();
    if (!cleanBarcode) return;
    setSelectedBarcode(cleanBarcode);
    setQueries((current) => [...current, cleanBarcode]);
    setBarcode(cleanBarcode);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    lookup(barcode);
  }

  function resetResult() {
    setSelectedBarcode("");
    setBarcode("");
  }

  function recordSale() {
    if (!selectedProduct) return;
    setCompletedTotal((current) => current + selectedProduct.price);
    setCompletedCount((current) => current + 1);
    resetResult();
  }

  function addToCart() {
    if (!selectedProduct) return;
    setCart((current) => {
      const existing = current.find((line) => line.product.barcode === selectedProduct.barcode);
      if (existing) {
        return current.map((line) =>
          line.product.barcode === selectedProduct.barcode ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...current, { product: selectedProduct, quantity: 1 }];
    });
    resetResult();
  }

  function updateCartQty(barcodeValue: string, delta: number) {
    setCart((current) =>
      current
        .map((line) => (line.product.barcode === barcodeValue ? { ...line, quantity: line.quantity + delta } : line))
        .filter((line) => line.quantity > 0)
    );
  }

  function removeFromCart(barcodeValue: string) {
    setCart((current) => current.filter((line) => line.product.barcode !== barcodeValue));
  }

  function completeCartSale() {
    if (cart.length === 0) return;
    setCompletedTotal((current) => current + cartTotal);
    setCompletedCount((current) => current + cart.reduce((sum, line) => sum + line.quantity, 0));
    setCart([]);
  }

  return (
    <main className="home-viewport relative flex h-[100dvh] w-full flex-col overflow-hidden text-[color:var(--home-ink)]">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BunekaMark size={26} />
          <BunekaWordmark className="text-sm text-[color:var(--home-ink)]" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <BunekaNedirButton />
          <a
            href={whatsappLink("Merhaba, Buneka için canlı demo talep ediyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button-secondary text-xs sm:text-sm"
          >
            <MessageCircle size={14} className="text-emerald-500" /> Demo Talep Et
          </a>
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
      </header>

      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-3 px-3 pb-3 sm:gap-4 sm:px-6 md:grid-cols-[1fr_380px]">
        <section className="glow-border flex min-h-0 flex-col gap-3 overflow-y-auto rounded-xl bg-[color:var(--home-surface)]/70 p-5 backdrop-blur-xl sm:rounded-2xl sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--home-glow)]/15 text-[color:var(--home-glow)]">
              <ScanLine size={22} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold leading-tight sm:text-2xl">Bu ne kadar?</h1>
              <p className="text-xs text-[color:var(--home-muted)] sm:text-sm">
                Gerçek ekranın birebir aynısı — müşterileriniz nasıl bir deneyim yaşayacağını burada görün.
              </p>
            </div>
          </div>

          <form className="flex gap-2" onSubmit={onSubmit}>
            <input
              className="premium-input min-w-0 flex-1"
              inputMode="numeric"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="8690000000011"
              aria-label="Barkod"
            />
            <button className="premium-button-primary shrink-0" type="submit">
              <Search size={18} /> Sorgula
            </button>
          </form>

          <div className="flex flex-wrap gap-2" aria-label="Örnek barkodlar">
            {products.map((product) => (
              <button
                key={product.barcode}
                type="button"
                onClick={() => lookup(product.barcode)}
                className="glow-border rounded-lg px-3 py-1.5 text-xs font-semibold text-[color:var(--home-ink)]"
              >
                {product.name}
              </button>
            ))}
          </div>

          {!selectedBarcode ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[color:var(--home-border)] py-8 text-center">
              <ScanLine size={28} className="mb-2 text-[color:var(--home-border)]" />
              <p className="text-xs text-[color:var(--home-muted)] sm:text-sm">Barkod bekleniyor.</p>
            </div>
          ) : selectedProduct ? (
            <div className="glow-border glow-border-selected rounded-xl p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">
                {selectedProduct.category}
              </p>
              <h2 className="mt-1 text-lg font-bold sm:text-xl">{selectedProduct.name}</h2>
              <div className="mt-1.5 text-2xl font-black tracking-tight text-[color:var(--home-glow)] sm:text-3xl">
                {currency.format(selectedProduct.price)}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-[color:var(--home-muted)]">
                <span>Stokta kalan: {selectedProduct.stock}</span>
                <span>Barkod: {selectedProduct.barcode}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button className="action-sale px-3 py-2.5 text-xs sm:text-sm" type="button" onClick={recordSale}>
                  <CheckCircle2 size={15} /> Satış Yap
                </button>
                <button
                  onClick={addToCart}
                  className="glow-border flex items-center justify-center gap-1.5 rounded-xl bg-cyan-50 px-3 py-2.5 text-xs font-black text-cyan-700 transition-transform active:scale-95 dark:bg-cyan-500/10 dark:text-cyan-300 sm:text-sm"
                  type="button"
                >
                  <ShoppingCart size={15} /> Sepete Ekle
                </button>
                <button className="premium-button-secondary px-3 py-2.5 text-xs sm:text-sm" type="button" onClick={resetResult}>
                  <RotateCcw size={15} /> Tamam
                </button>
              </div>
            </div>
          ) : (
            <div className="glow-border rounded-xl p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-amber-500">Ürün kayıtlı değil</p>
              <h2 className="mt-1 text-lg font-bold sm:text-xl">Gerçekte böyle olsaydı</h2>
              <p className="mt-1 text-xs text-[color:var(--home-muted)] sm:text-sm">
                Buneka&apos;da barkod {selectedBarcode} anında ürün ekleme ekranına yönlendirir.
              </p>
              <button className="premium-button-secondary mt-3" type="button" onClick={resetResult}>
                <RotateCcw size={16} /> Tamam
              </button>
            </div>
          )}

          {cart.length > 0 && (
            <div className="glow-border rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShoppingCart size={16} className="text-[color:var(--home-glow)]" />
                <p className="font-display text-sm font-bold">Sepet</p>
                <span className="rounded-full bg-[color:var(--home-glow)]/15 px-2 py-0.5 text-[10px] font-black text-[color:var(--home-glow)]">
                  {cart.reduce((sum, line) => sum + line.quantity, 0)}
                </span>
              </div>
              <div className="space-y-1.5">
                {cart.map((line) => (
                  <div key={line.product.barcode} className="flex items-center justify-between gap-2 rounded-lg bg-[color:var(--home-glow)]/5 px-2.5 py-1.5">
                    <span className="truncate text-xs font-semibold">{line.product.name}</span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateCartQty(line.product.barcode, -1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--home-surface)] text-[color:var(--home-ink)]"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-4 text-center text-xs font-black">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(line.product.barcode, 1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--home-surface)] text-[color:var(--home-ink)]"
                      >
                        <Plus size={10} />
                      </button>
                      <span className="w-14 text-right text-xs font-black text-[color:var(--home-glow)]">
                        {currency.format(line.product.price * line.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.product.barcode)}
                        className="text-[color:var(--home-muted)] hover:text-rose-400"
                        aria-label="Sepetten çıkar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[color:var(--home-border)] pt-2.5">
                <span className="text-xs font-bold text-[color:var(--home-muted)]">Toplam</span>
                <span className="text-lg font-black">{currency.format(cartTotal)}</span>
              </div>
              <button onClick={completeCartSale} className="action-sale mt-2 w-full py-2.5 text-sm" type="button">
                <CheckCircle2 size={16} /> Satışı Tamamla
              </button>
            </div>
          )}

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[color:var(--home-border)] pt-3">
            <div className="glow-border rounded-lg p-2.5 text-center">
              <p className="text-lg font-black text-[color:var(--home-glow)]">{queries.length}</p>
              <p className="text-[10px] font-semibold text-[color:var(--home-muted)]">Sorgu</p>
            </div>
            <div className="glow-border rounded-lg p-2.5 text-center">
              <p className="truncate text-lg font-black text-[color:var(--home-glow)]">{currency.format(completedTotal)}</p>
              <p className="text-[10px] font-semibold text-[color:var(--home-muted)]">
                Kasa ({completedCount} satış)
              </p>
            </div>
          </div>
        </section>

        <aside className="glow-border flex min-h-0 flex-col overflow-hidden rounded-xl bg-[color:var(--home-surface)]/70 backdrop-blur-xl sm:rounded-2xl">
          <div className="shrink-0 border-b border-[color:var(--home-border)] p-4 sm:p-5">
            <p className="font-display text-base font-bold sm:text-lg">Beğendiniz mi?</p>
            <p className="mt-1 text-xs text-[color:var(--home-muted)] sm:text-sm">
              Size uygun paketi seçin, hemen kuruluma geçelim.
            </p>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:p-5">
            {plans.map((plan, index) => {
              const Icon = PLAN_ICONS[index];
              return (
                <div key={plan.name} className={`rounded-lg p-3.5 ${PLAN_BORDER_COLORS[index]}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-[color:var(--home-glow)]" />
                      <span className="font-display text-sm font-bold">{plan.name}</span>
                    </div>
                    {plan.badge && (
                      <span className="shrink-0 rounded-full bg-[color:var(--home-glow)]/15 px-2 py-0.5 text-[9px] font-bold text-[color:var(--home-glow)]">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--home-muted)]">{plan.summary}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-base font-black text-[color:var(--home-glow)]">
                      {plan.price}
                      <span className="text-[10px] font-medium text-[color:var(--home-muted)]"> /yıl</span>
                    </span>
                    <a
                      href={whatsappLink(`Merhaba, ${plan.name} paketini satın almak istiyorum.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-[color:var(--home-glow)]/15 px-2.5 py-1 text-[11px] font-bold text-[color:var(--home-glow)] transition-colors hover:bg-[color:var(--home-glow)]/25"
                    >
                      <MessageCircle size={11} /> Satın Al
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="shrink-0 space-y-2 border-t border-[color:var(--home-border)] p-4 sm:p-5">
            <Link
              href="/paketler"
              className="glow-border inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold text-[color:var(--home-ink)]"
            >
              Tüm özellikleri karşılaştır <ArrowRight size={12} />
            </Link>
            <a
              href={whatsappLink("Merhaba, Buneka lisansı talep etmek istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary-animated glow-border group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 py-2.5 text-sm font-bold text-slate-950 transition-transform duration-300 ease-out hover:scale-[1.01] active:scale-95"
            >
              <MessageCircle size={16} /> Hangisi uygun, birlikte karar verelim
            </a>
          </div>
        </aside>
      </div>

      <footer className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5 text-[10px] text-[color:var(--home-muted)] sm:px-6 sm:text-xs">
        <span>Demo verisi gerçek işletmenizden ayrı tutulur, hiçbir kayıt saklanmaz.</span>
        <span>BUNEKA © 2026 · Ankara, TR</span>
      </footer>
    </main>
  );
}
