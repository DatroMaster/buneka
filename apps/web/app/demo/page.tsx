"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  CircleDollarSign,
  PackagePlus,
  RotateCcw,
  ScanLine,
  Search,
  ShoppingBasket,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";

type DemoProduct = {
  barcode: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type DemoSale = {
  barcode: string;
  amount: number;
  createdAt: Date;
};

const products: DemoProduct[] = [
  {
    barcode: "8690000000011",
    name: "Su 500 ml",
    category: "İçecek",
    price: 12,
    stock: 48,
  },
  {
    barcode: "8690000000028",
    name: "Çikolata Mini",
    category: "Atıştırmalık",
    price: 18.5,
    stock: 22,
  },
  {
    barcode: "8690000000035",
    name: "Defter A5",
    category: "Kırtasiye",
    price: 42,
    stock: 8,
  },
  {
    barcode: "8690000000042",
    name: "Kalem Mavi",
    category: "Kırtasiye",
    price: 9.75,
    stock: 65,
  },
];

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

export default function DemoPage() {
  const [barcode, setBarcode] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [queries, setQueries] = useState<string[]>([]);
  const [sales, setSales] = useState<DemoSale[]>([]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.barcode === selectedBarcode),
    [selectedBarcode]
  );

  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const mostQueried = useMemo(() => {
    const counts = queries.reduce<Record<string, number>>((acc, item) => {
      acc[item] = (acc[item] ?? 0) + 1;
      return acc;
    }, {});

    const topBarcode = Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    return (
      products.find((product) => product.barcode === topBarcode)?.name ?? "-"
    );
  }, [queries]);

  function lookup(nextBarcode: string) {
    const cleanBarcode = nextBarcode.trim();
    if (!cleanBarcode) {
      return;
    }

    setSelectedBarcode(cleanBarcode);
    setQueries((current) => [...current, cleanBarcode]);
    setBarcode(cleanBarcode);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    lookup(barcode);
  }

  function recordSale() {
    if (!selectedProduct) {
      return;
    }

    setSales((current) => [
      ...current,
      {
        barcode: selectedProduct.barcode,
        amount: selectedProduct.price,
        createdAt: new Date(),
      },
    ]);
  }

  function resetResult() {
    setSelectedBarcode("");
    setBarcode("");
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-card)]/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <Link
          className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-secondary)]"
          href="/"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Buneka
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-3 py-1 text-xs font-medium text-[color:var(--color-muted)]">
          <BunekaMark size={14} glow={false} />
          Demo verisi ayrı tutulur
        </span>
        <ThemeToggle className="border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-cyan-400" />
      </div>

      {/* ── Main Shell ── */}
      <div className="mx-auto grid max-w-6xl gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_340px]">
        {/* ── Left: Scanner Panel ── */}
        <section className="data-card p-6" aria-labelledby="demo-title">
          {/* Title */}
          <div className="flex items-start gap-4">
            <ScanLine size={44} className="shrink-0 text-cyan-500" aria-hidden="true" />
            <div>
              <h1
                id="demo-title"
                className="font-display text-2xl font-bold tracking-tight text-[color:var(--color-text)]"
              >
                Bu ne kadar?
              </h1>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                Ürün fiyat sorgulaması yap. Barkodu okut veya yaz.
              </p>
            </div>
          </div>

          {/* Barcode Form */}
          <form className="mt-6 flex gap-2" onSubmit={onSubmit}>
            <input
              className="premium-input min-w-0 flex-1"
              inputMode="numeric"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="8690000000011"
              aria-label="Barkod"
            />
            <button className="premium-button-primary shrink-0" type="submit">
              <Search size={18} aria-hidden="true" />
              Sorgula
            </button>
          </form>

          {/* Quick Product Buttons */}
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Örnek barkodlar">
            {products.map((product) => (
              <button
                className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-text)] transition-colors hover:border-cyan-400"
                key={product.barcode}
                type="button"
                onClick={() => lookup(product.barcode)}
              >
                {product.name}
              </button>
            ))}
          </div>

          {/* Camera + Manual Add */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="premium-button-secondary" type="button">
              <Camera size={18} aria-hidden="true" />
              Kamera ile Okut
            </button>
            <button className="premium-button-secondary" type="button">
              <PackagePlus size={18} aria-hidden="true" />
              Ürün Ekle
            </button>
          </div>

          {/* ── Product Result Area ── */}
          <div className="mt-6">
            {!selectedBarcode ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[color:var(--color-border)] py-16 text-center">
                <ScanLine size={36} className="mb-3 text-[color:var(--color-border)]" aria-hidden="true" />
                <p className="text-sm text-[color:var(--color-muted)]">Barkod bekleniyor.</p>
              </div>
            ) : selectedProduct ? (
              /* Product Found */
              <div className="rounded-2xl bg-[color:var(--color-bg-secondary)] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                  {selectedProduct.category}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[color:var(--color-text)]">
                  {selectedProduct.name}
                </h2>
                <div className="mt-3 text-4xl font-extrabold tracking-tight text-cyan-600 dark:text-cyan-300">
                  {currency.format(selectedProduct.price)}
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-[color:var(--color-card)] px-3 py-1 text-xs font-medium text-[color:var(--color-muted)] ring-1 ring-[color:var(--color-border)]">
                    Stokta kalan: {selectedProduct.stock}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[color:var(--color-card)] px-3 py-1 text-xs font-medium text-[color:var(--color-muted)] ring-1 ring-[color:var(--color-border)]">
                    Barkod: {selectedProduct.barcode}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="action-sale px-5 py-3 text-sm" type="button" onClick={recordSale}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    Satış Yapıldı
                  </button>
                  <button className="premium-button-secondary" type="button" onClick={resetResult}>
                    <RotateCcw size={18} aria-hidden="true" />
                    Ana Ekrana Dön
                  </button>
                  <button className="premium-button-secondary" type="button">
                    <ShoppingBasket size={18} aria-hidden="true" />
                    Detayları Göster
                  </button>
                </div>
              </div>
            ) : (
              /* Product Not Found */
              <div className="rounded-2xl bg-[color:var(--color-bg-secondary)] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Ürün kayıtlı değil
                </p>
                <h2 className="mt-1 text-xl font-bold text-[color:var(--color-text)]">
                  Hızlı ürün ekleme
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">Barkod: {selectedBarcode}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="premium-button-primary" type="button">
                    <PackagePlus size={18} aria-hidden="true" />
                    Ürün Ekle
                  </button>
                  <button className="premium-button-secondary" type="button" onClick={resetResult}>
                    <RotateCcw size={18} aria-hidden="true" />
                    Ana Ekrana Dön
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Right: Report Panel ── */}
        <aside className="data-card p-6 lg:self-start" aria-label="Demo günlük rapor">
          <h2 className="font-display text-lg font-bold text-[color:var(--color-text)]">
            Günlük demo raporu
          </h2>

          <div className="mt-5 space-y-3">
            {/* Report Items */}
            {[
              { label: "Fiyat sorgusu", value: String(queries.length) },
              { label: "Satış kaydı", value: String(sales.length) },
              { label: "Günlük kasa", value: currency.format(totalAmount) },
              { label: "En çok sorgulanan", value: mostQueried },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-[color:var(--color-bg-secondary)] px-4 py-3"
              >
                <span className="text-sm text-[color:var(--color-muted)]">{item.label}</span>
                <span className="text-sm font-semibold text-[color:var(--color-text)]">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["Buneka Kasa", "Buneka Stok", "Buneka Patron"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href={whatsappLink("Merhaba, Buneka lisansı talep etmek istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button-amber mt-5 flex w-full"
          >
            <CircleDollarSign size={18} aria-hidden="true" />
            Lisans Talebi (WhatsApp)
          </a>
        </aside>
      </div>
    </main>
  );
}
