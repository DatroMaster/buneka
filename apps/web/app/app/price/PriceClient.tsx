"use client";

import type { Tables } from "@buneka/database";
import {
  Camera,
  CheckCircle2,
  Loader2,
  PackagePlus,
  RotateCcw,
  ScanLine,
  Search,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { lookupProduct, recordSale } from "./actions";

type Product = Tables<"products">;

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

export function PriceClient() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState("");

  async function lookup(nextBarcode: string) {
    const cleanBarcode = nextBarcode.trim();
    if (!cleanBarcode) return;

    setLoading(true);
    setMessage("");
    setSelectedBarcode(cleanBarcode);
    setBarcode(cleanBarcode);

    const { product: foundProduct } = await lookupProduct(cleanBarcode);

    if (foundProduct) {
      setProduct(foundProduct);
      setNotFound(false);
    } else {
      setProduct(null);
      setNotFound(true);
    }

    setLoading(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(barcode);
  }

  async function handleSale() {
    if (!product) return;
    setLoading(true);
    const result = await recordSale(product.id, product.sale_price);
    setLoading(false);

    if (result?.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Satış kaydedildi.");
    resetResult();
  }

  function resetResult() {
    setSelectedBarcode("");
    setBarcode("");
    setProduct(null);
    setNotFound(false);
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="glass-card rounded-2xl p-6 md:p-10">
        <div className="mb-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-sm shadow-cyan-500/30">
            <ScanLine size={32} aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">Bu ne kadar?</h1>
            <p className="mt-1 font-medium text-slate-600 dark:text-slate-400">
              Ürün fiyatını sorgulayın. Barkodu okutun veya yazın.
            </p>
          </div>
        </div>

        <form className="mb-8 flex flex-col gap-4 md:flex-row" onSubmit={onSubmit}>
          <div className="relative flex-1">
            <input
              className="premium-input h-16 pl-12 text-lg font-medium tracking-wider"
              inputMode="numeric"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="Barkod numarasını buraya girin..."
              aria-label="Barkod"
              autoFocus
            />
            <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600/50 dark:text-slate-400/60" size={24} />
          </div>
          <button className="premium-button-primary h-16 px-10 text-lg" type="submit" disabled={loading || !barcode}>
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
            <span>Sorgula</span>
          </button>
        </form>

        <div className="mb-10 flex flex-wrap gap-4">
          <button
            className="premium-button-secondary px-5 py-3 text-sm opacity-60"
            type="button"
            disabled
            title="Kamera ile okutma sonraki adımda açılacak"
          >
            <Camera size={18} aria-hidden="true" className="text-cyan-600" />
            <span>Kamera ile Okut</span>
          </button>
          <Link className="premium-button-secondary px-5 py-3 text-sm" href="/app/urunler">
            <PackagePlus size={18} aria-hidden="true" className="text-orange-500" />
            <span>Hızlı Ürün Ekle</span>
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-400">
            {message}
          </div>
        )}

        <div className="relative min-h-[300px]">
          {!selectedBarcode ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <ScanLine size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">Barkod bekleniyor...</p>
            </div>
          ) : product ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 md:p-10">
              <p className="mb-4 inline-flex rounded-full bg-cyan-50 px-4 py-2 text-sm font-black uppercase text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                {product.category || "Kategorisiz"}
              </p>
              <h2 className="mb-6 text-4xl font-black tracking-tight text-slate-950 md:text-6xl dark:text-slate-50">{product.name}</h2>
              <div className="mb-8 text-7xl font-black tracking-tight text-cyan-600 md:text-8xl dark:text-cyan-300">
                {currency.format(product.sale_price)}
              </div>
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                <span className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700">
                  Stok: {product.stock_quantity}
                </span>
                <span className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700">
                  Barkod: {product.barcode}
                </span>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button className="action-sale min-h-16 px-8 text-xl" type="button" onClick={handleSale} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                  <span>Satış Yap</span>
                </button>
                <button className="action-no-sale min-h-16 px-8 text-xl" type="button" onClick={resetResult}>
                  <RotateCcw size={24} />
                  <span>Satış Yok</span>
                </button>
              </div>
            </div>
          ) : notFound ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-orange-50 p-10 text-center ring-1 ring-orange-200 dark:bg-orange-500/10 dark:ring-orange-500/20">
              <Search size={36} className="mb-4 text-orange-600 dark:text-orange-400" />
              <h2 className="mb-2 text-2xl font-bold text-orange-600 dark:text-orange-400">Ürün bulunamadı</h2>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                <strong className="text-slate-950 dark:text-slate-50">{selectedBarcode}</strong> barkod numaralı ürün sistemde kayıtlı değil.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link className="premium-button-amber shadow-none" href="/app/urunler">
                  <PackagePlus size={20} />
                  <span>Hemen Ürün Ekle</span>
                </Link>
                <button className="premium-button-secondary" type="button" onClick={resetResult}>
                  <RotateCcw size={20} />
                  <span>Satış Yok</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
