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
      <div className="glass-card rounded-[2rem] p-8 md:p-12">
        <div className="mb-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4F6F52] text-white shadow-lg">
            <ScanLine size={32} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#20231F]">Bu ne kadar?</h1>
            <p className="mt-1 font-medium text-[#667064]">
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
            <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667064]/50" size={24} />
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
            <Camera size={18} aria-hidden="true" className="text-[#4F6F52]" />
            <span>Kamera ile Okut</span>
          </button>
          <Link className="premium-button-secondary px-5 py-3 text-sm" href="/app/urunler">
            <PackagePlus size={18} aria-hidden="true" className="text-[#C8913A]" />
            <span>Hızlı Ürün Ekle</span>
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-[#E4DED2] bg-white px-5 py-4 text-sm font-bold text-[#2F4A35]">
            {message}
          </div>
        )}

        <div className="relative min-h-[300px]">
          {!selectedBarcode ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#E4DED2] bg-white/30 text-center">
              <ScanLine size={48} className="mb-4 text-[#E4DED2]" />
              <p className="text-lg font-semibold text-[#667064]">Barkod bekleniyor...</p>
            </div>
          ) : product ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-[0_12px_40px_rgba(32,35,31,0.08)] ring-1 ring-[#E4DED2]">
              <p className="mb-3 inline-flex rounded-full bg-[#C8913A]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[#C8913A]">
                {product.category || "Kategorisiz"}
              </p>
              <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-[#20231F]">{product.name}</h2>
              <div className="mb-8 text-6xl font-black tracking-tighter text-[#4F6F52]">
                {currency.format(product.sale_price)}
              </div>
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                <span className="rounded-lg bg-[#F7F4ED] px-4 py-2 text-sm font-bold text-[#667064]">
                  Stok: {product.stock_quantity}
                </span>
                <span className="rounded-lg bg-[#F7F4ED] px-4 py-2 text-sm font-bold text-[#667064]">
                  Barkod: {product.barcode}
                </span>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button className="premium-button-primary px-8 text-lg" type="button" onClick={handleSale} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                  <span>Satış Yapıldı</span>
                </button>
                <button className="premium-button-secondary px-8 text-lg" type="button" onClick={resetResult}>
                  <RotateCcw size={24} />
                  <span>Ana Ekrana Dön</span>
                </button>
              </div>
            </div>
          ) : notFound ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl bg-[#b65a3c]/5 p-10 text-center ring-1 ring-[#b65a3c]/20">
              <Search size={36} className="mb-4 text-[#b65a3c]" />
              <h2 className="mb-2 text-2xl font-bold text-[#b65a3c]">Ürün bulunamadı</h2>
              <p className="mb-8 text-[#667064]">
                <strong className="text-[#20231F]">{selectedBarcode}</strong> barkod numaralı ürün sistemde kayıtlı değil.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link className="premium-button-primary bg-[#C8913A] shadow-none hover:bg-[#b58030]" href="/app/urunler">
                  <PackagePlus size={20} />
                  <span>Hemen Ürün Ekle</span>
                </Link>
                <button className="premium-button-secondary" type="button" onClick={resetResult}>
                  <RotateCcw size={20} />
                  <span>Ana Ekrana Dön</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
