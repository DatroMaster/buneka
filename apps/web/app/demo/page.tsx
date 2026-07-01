"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Barcode,
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
    <main className="min-h-screen bg-[#F7F4ED]">
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E4DED2] bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <Link
          className="inline-flex items-center gap-2 rounded-xl border border-[#E4DED2] bg-white px-4 py-2 text-sm font-semibold text-[#20231F] transition-colors hover:bg-[#F7F4ED]"
          href="/"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Buneka
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DED2] bg-[#F7F4ED] px-3 py-1 text-xs font-medium text-[#667064]">
          <Barcode size={14} aria-hidden="true" />
          Demo verisi ayrı tutulur
        </span>
      </div>

      {/* ── Main Shell ── */}
      <div className="mx-auto grid max-w-6xl gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_340px]">
        {/* ── Left: Scanner Panel ── */}
        <section
          className="rounded-2xl border border-[#E4DED2] bg-white p-6 shadow-sm"
          aria-labelledby="demo-title"
        >
          {/* Title */}
          <div className="flex items-start gap-4">
            <ScanLine
              size={44}
              className="shrink-0 text-[#4F6F52]"
              aria-hidden="true"
            />
            <div>
              <h1
                id="demo-title"
                className="text-2xl font-bold tracking-tight text-[#20231F]"
              >
                Bu ne kadar?
              </h1>
              <p className="mt-1 text-sm text-[#667064]">
                Ürün fiyat sorgulaması yap. Barkodu okut veya yaz.
              </p>
            </div>
          </div>

          {/* Barcode Form */}
          <form className="mt-6 flex gap-2" onSubmit={onSubmit}>
            <input
              className="min-w-0 flex-1 rounded-xl border border-[#E4DED2] bg-white px-4 py-3 text-sm text-[#20231F] placeholder:text-[#667064]/60 outline-none transition-shadow focus:ring-2 focus:ring-[#4F6F52]/30 focus:border-[#4F6F52]"
              inputMode="numeric"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="8690000000011"
              aria-label="Barkod"
            />
            <button
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#4F6F52] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d5740] active:bg-[#334a36]"
              type="submit"
            >
              <Search size={18} aria-hidden="true" />
              Sorgula
            </button>
          </form>

          {/* Quick Product Buttons */}
          <div
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Örnek barkodlar"
          >
            {products.map((product) => (
              <button
                className="rounded-lg border border-[#E4DED2] bg-[#F7F4ED] px-3 py-1.5 text-xs font-medium text-[#20231F] transition-colors hover:border-[#4F6F52] hover:bg-[#4F6F52]/5"
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
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-[#E4DED2] bg-white px-4 py-2.5 text-sm font-medium text-[#20231F] transition-colors hover:bg-[#F7F4ED]"
              type="button"
            >
              <Camera size={18} className="text-[#667064]" aria-hidden="true" />
              Kamera ile Okut
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-[#E4DED2] bg-white px-4 py-2.5 text-sm font-medium text-[#20231F] transition-colors hover:bg-[#F7F4ED]"
              type="button"
            >
              <PackagePlus
                size={18}
                className="text-[#667064]"
                aria-hidden="true"
              />
              Ürün Ekle
            </button>
          </div>

          {/* ── Product Result Area ── */}
          <div className="mt-6">
            {!selectedBarcode ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4DED2] py-16 text-center">
                <ScanLine
                  size={36}
                  className="mb-3 text-[#E4DED2]"
                  aria-hidden="true"
                />
                <p className="text-sm text-[#667064]">Barkod bekleniyor.</p>
              </div>
            ) : selectedProduct ? (
              /* Product Found */
              <div className="rounded-2xl border border-[#E4DED2] bg-[#F7F4ED] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C8913A]">
                  {selectedProduct.category}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#20231F]">
                  {selectedProduct.name}
                </h2>
                <div className="mt-3 text-4xl font-extrabold tracking-tight text-[#4F6F52]">
                  {currency.format(selectedProduct.price)}
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-[#667064] ring-1 ring-[#E4DED2]">
                    Stokta kalan: {selectedProduct.stock}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-[#667064] ring-1 ring-[#E4DED2]">
                    Barkod: {selectedProduct.barcode}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-xl bg-[#4F6F52] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d5740] active:bg-[#334a36]"
                    type="button"
                    onClick={recordSale}
                  >
                    <CheckCircle2 size={18} aria-hidden="true" />
                    Satış Yapıldı
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E4DED2] bg-white px-5 py-3 text-sm font-semibold text-[#20231F] transition-colors hover:bg-[#F7F4ED]"
                    type="button"
                    onClick={resetResult}
                  >
                    <RotateCcw size={18} aria-hidden="true" />
                    Ana Ekrana Dön
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E4DED2] bg-white px-5 py-3 text-sm font-semibold text-[#20231F] transition-colors hover:bg-[#F7F4ED]"
                    type="button"
                  >
                    <ShoppingBasket size={18} aria-hidden="true" />
                    Detayları Göster
                  </button>
                </div>
              </div>
            ) : (
              /* Product Not Found */
              <div className="rounded-2xl border border-[#E4DED2] bg-[#F7F4ED] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B65A3C]">
                  Ürün kayıtlı değil
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#20231F]">
                  Hızlı ürün ekleme
                </h2>
                <p className="mt-1 text-sm text-[#667064]">
                  Barkod: {selectedBarcode}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-xl bg-[#4F6F52] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d5740] active:bg-[#334a36]"
                    type="button"
                  >
                    <PackagePlus size={18} aria-hidden="true" />
                    Ürün Ekle
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E4DED2] bg-white px-5 py-3 text-sm font-semibold text-[#20231F] transition-colors hover:bg-[#F7F4ED]"
                    type="button"
                    onClick={resetResult}
                  >
                    <RotateCcw size={18} aria-hidden="true" />
                    Ana Ekrana Dön
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Right: Report Panel ── */}
        <aside
          className="rounded-2xl border border-[#E4DED2] bg-white p-6 shadow-sm lg:self-start"
          aria-label="Demo günlük rapor"
        >
          <h2 className="text-lg font-bold text-[#20231F]">
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
                className="flex items-center justify-between rounded-xl bg-[#F7F4ED] px-4 py-3"
              >
                <span className="text-sm text-[#667064]">{item.label}</span>
                <span className="text-sm font-semibold text-[#20231F]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["Buneka Kasa", "Buneka Stok", "Buneka Patron"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#4F6F52]/10 px-3 py-1 text-xs font-medium text-[#4F6F52]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8913A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b07e30] active:bg-[#9a6e2a]"
            href="/login"
          >
            <CircleDollarSign size={18} aria-hidden="true" />
            Lisans Talebi
          </Link>
        </aside>
      </div>
    </main>
  );
}
