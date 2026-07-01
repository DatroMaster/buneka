"use client";

import {
  Camera,
  CheckCircle2,
  PackagePlus,
  RotateCcw,
  ScanLine,
  Search,
  Loader2
} from "lucide-react";
import { FormEvent, useState } from "react";
import { lookupProduct, recordSale } from "./actions";
import type { Tables } from "@buneka/database";

type Product = Tables<"products">;

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2
});

export function PriceClient() {
  const [barcode, setBarcode] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [saleCompleted, setSaleCompleted] = useState(false);

  async function lookup(nextBarcode: string) {
    const cleanBarcode = nextBarcode.trim();
    if (!cleanBarcode) return;

    setLoading(true);
    setSelectedBarcode(cleanBarcode);
    setBarcode(cleanBarcode);
    setSaleCompleted(false);
    
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
    lookup(barcode);
  }

  async function handleSale() {
    if (!product) return;
    setLoading(true);
    await recordSale(product.id, product.sale_price);
    setLoading(false);
    setSaleCompleted(true);
    
    // Satış tamamlandıktan sonra bir süre mesajı gösterip ekranı temizle
    setTimeout(() => {
      resetResult();
    }, 2000);
  }

  function resetResult() {
    setSelectedBarcode("");
    setBarcode("");
    setProduct(null);
    setNotFound(false);
    setSaleCompleted(false);
  }

  return (
    <div className="mx-auto w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card rounded-[2rem] p-8 md:p-12">
        <div className="mb-10 flex items-center space-x-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F6F52] to-[#3F5941] text-white shadow-lg">
            <ScanLine size={32} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#20231F]">Bu ne kadar?</h1>
            <p className="mt-1 font-medium text-[#667064]">Ürün fiyatını sorgulayın. Barkodu okutun veya yazın.</p>
          </div>
        </div>

        <form className="mb-10 flex flex-col md:flex-row gap-4" onSubmit={onSubmit}>
          <div className="relative flex-1">
            <input
              className="premium-input pl-12 text-lg font-medium tracking-wider h-16"
              inputMode="numeric"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="Barkod numarasını buraya girin..."
              aria-label="Barkod"
              autoFocus
            />
            <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667064]/50" size={24} />
          </div>
          <button 
            className="premium-button-primary h-16 px-10 text-lg"
            type="submit"
            disabled={loading || !barcode}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
            <span>Sorgula</span>
          </button>
        </form>

        <div className="mb-12 flex flex-wrap gap-4">
          <button className="premium-button-secondary py-3 px-5 text-sm" type="button">
            <Camera size={18} aria-hidden="true" className="text-[#4F6F52]" />
            <span>Kamera ile Okut</span>
          </button>
          <button className="premium-button-secondary py-3 px-5 text-sm" type="button">
            <PackagePlus size={18} aria-hidden="true" className="text-[#C8913A]" />
            <span>Hızlı Ürün Ekle</span>
          </button>
        </div>

        <div className="relative min-h-[300px]">
          {!selectedBarcode ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#E4DED2] bg-white/30 text-center transition-all">
              <ScanLine size={48} className="mb-4 text-[#E4DED2]" />
              <p className="text-lg font-semibold text-[#667064]">Barkod bekleniyor...</p>
            </div>
          ) : product ? (
            <div className={`relative flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-white to-[#F7F4ED]/50 p-10 text-center shadow-[0_12px_40px_rgba(32,35,31,0.08)] ring-1 ring-[#E4DED2] transition-all duration-500 ${saleCompleted ? 'scale-95 opacity-50 blur-sm' : 'animate-in zoom-in-95'}`}>
              
              {/* Absolute check animation overlay for sale completed */}
              {saleCompleted && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 rounded-3xl backdrop-blur-sm animate-in fade-in zoom-in">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4F6F52] text-white shadow-xl mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#4F6F52]">Satış Başarılı!</h3>
                </div>
              )}

              <p className="mb-3 inline-flex items-center rounded-full bg-[#C8913A]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[#C8913A]">
                {product.category || "Kategorisiz"}
              </p>
              <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-[#20231F] md:text-5xl">{product.name}</h2>
              
              <div className="mb-8">
                <span className="text-6xl font-black tracking-tighter text-[#4F6F52] drop-shadow-sm md:text-7xl">
                  {currency.format(product.sale_price)}
                </span>
              </div>
              
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                <span className="flex items-center rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#667064] shadow-sm ring-1 ring-[#E4DED2]">
                  <span className="mr-2 h-2 w-2 rounded-full bg-[#4F6F52]"></span>
                  Stok: {product.stock_quantity}
                </span>
                <span className="flex items-center rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#667064] shadow-sm ring-1 ring-[#E4DED2]">
                  <BarcodeIcon className="mr-2 h-4 w-4" />
                  Barkod: {product.barcode}
                </span>
              </div>
              
              <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                <button
                  className="premium-button-primary px-8 text-lg"
                  type="button"
                  onClick={handleSale}
                  disabled={loading || saleCompleted}
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                  <span>Satış Yapıldı</span>
                </button>
                <button
                  className="premium-button-secondary px-8 text-lg"
                  type="button"
                  onClick={resetResult}
                >
                  <RotateCcw size={24} />
                  <span>İptal (Kapat)</span>
                </button>
              </div>
            </div>
          ) : notFound ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl bg-[#b65a3c]/5 p-10 text-center ring-1 ring-[#b65a3c]/20 animate-in zoom-in-95">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b65a3c]/10 text-[#b65a3c]">
                <Search size={32} />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-[#b65a3c]">Ürün bulunamadı</h2>
              <p className="mb-8 text-[#667064]">
                <strong className="text-[#20231F]">{selectedBarcode}</strong> barkod numaralı ürün sistemde kayıtlı değil.
              </p>
              <div className="flex gap-4">
                <button className="premium-button-primary bg-[#C8913A] shadow-none hover:bg-[#b58030]" type="button">
                  <PackagePlus size={20} />
                  <span>Hemen Ürün Ekle</span>
                </button>
                <button
                  className="premium-button-secondary"
                  type="button"
                  onClick={resetResult}
                >
                  <RotateCcw size={20} />
                  <span>Geri Dön</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BarcodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5v14" />
      <path d="M8 5v14" />
      <path d="M12 5v14" />
      <path d="M17 5v14" />
      <path d="M21 5v14" />
    </svg>
  )
}
