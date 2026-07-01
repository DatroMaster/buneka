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
  ShoppingBasket
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
    stock: 48
  },
  {
    barcode: "8690000000028",
    name: "Çikolata Mini",
    category: "Atıştırmalık",
    price: 18.5,
    stock: 22
  },
  {
    barcode: "8690000000035",
    name: "Defter A5",
    category: "Kırtasiye",
    price: 42,
    stock: 8
  },
  {
    barcode: "8690000000042",
    name: "Kalem Mavi",
    category: "Kırtasiye",
    price: 9.75,
    stock: 65
  }
];

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2
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

    const topBarcode = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return products.find((product) => product.barcode === topBarcode)?.name ?? "-";
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
        createdAt: new Date()
      }
    ]);
  }

  function resetResult() {
    setSelectedBarcode("");
    setBarcode("");
  }

  return (
    <main className="demo-page">
      <div className="topbar">
        <Link className="button button-secondary" href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Buneka
        </Link>
        <span className="status-line">
          <Barcode size={16} aria-hidden="true" />
          Demo verisi ayrı tutulur
        </span>
      </div>

      <div className="demo-shell">
        <section className="card scanner-panel" aria-labelledby="demo-title">
          <div className="scanner-title">
            <ScanLine size={44} color="var(--green)" aria-hidden="true" />
            <div>
              <h1 id="demo-title">Bu ne kadar?</h1>
              <p>Ürün fiyat sorgulaması yap. Barkodu okut veya yaz.</p>
            </div>
          </div>

          <form className="barcode-form" onSubmit={onSubmit}>
            <input
              className="barcode-input"
              inputMode="numeric"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="8690000000011"
              aria-label="Barkod"
            />
            <button className="button button-primary" type="submit">
              <Search size={20} aria-hidden="true" />
              Sorgula
            </button>
          </form>

          <div className="quick-codes" aria-label="Örnek barkodlar">
            {products.map((product) => (
              <button
                className="quick-code"
                key={product.barcode}
                type="button"
                onClick={() => lookup(product.barcode)}
              >
                {product.name}
              </button>
            ))}
          </div>

          <div className="quick-codes">
            <button className="button button-secondary" type="button">
              <Camera size={18} aria-hidden="true" />
              Kamera ile Okut
            </button>
            <button className="button button-secondary" type="button">
              <PackagePlus size={18} aria-hidden="true" />
              Ürün Ekle
            </button>
          </div>

          <div className="product-result">
            {!selectedBarcode ? (
              <div className="empty-state">
                <p>Barkod bekleniyor.</p>
              </div>
            ) : selectedProduct ? (
              <div className="card result-panel">
                <p className="eyebrow" style={{ color: "var(--amber)" }}>
                  {selectedProduct.category}
                </p>
                <h2 className="product-name">{selectedProduct.name}</h2>
                <div className="product-price">
                  {currency.format(selectedProduct.price)}
                </div>
                <div className="tag-row">
                  <span className="tag">Stokta kalan: {selectedProduct.stock}</span>
                  <span className="tag">Barkod: {selectedProduct.barcode}</span>
                </div>
                <div className="result-actions">
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={recordSale}
                  >
                    <CheckCircle2 size={20} aria-hidden="true" />
                    Satış Yapıldı
                  </button>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={resetResult}
                  >
                    <RotateCcw size={20} aria-hidden="true" />
                    Ana Ekrana Dön
                  </button>
                  <button className="button button-secondary" type="button">
                    <ShoppingBasket size={20} aria-hidden="true" />
                    Detayları Göster
                  </button>
                </div>
              </div>
            ) : (
              <div className="card result-panel">
                <p className="eyebrow" style={{ color: "var(--red)" }}>
                  Ürün kayıtlı değil
                </p>
                <h2 className="product-name">Hızlı ürün ekleme</h2>
                <p>Barkod: {selectedBarcode}</p>
                <div className="result-actions">
                  <button className="button button-primary" type="button">
                    <PackagePlus size={20} aria-hidden="true" />
                    Ürün Ekle
                  </button>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={resetResult}
                  >
                    <RotateCcw size={20} aria-hidden="true" />
                    Ana Ekrana Dön
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="card report-panel" aria-label="Demo günlük rapor">
          <h2>Günlük demo raporu</h2>
          <div className="report-list">
            <div className="report-item">
              <span>Fiyat sorgusu</span>
              <span className="report-value">{queries.length}</span>
            </div>
            <div className="report-item">
              <span>Satış kaydı</span>
              <span className="report-value">{sales.length}</span>
            </div>
            <div className="report-item">
              <span>Günlük kasa</span>
              <span className="report-value">{currency.format(totalAmount)}</span>
            </div>
            <div className="report-item">
              <span>En çok sorgulanan</span>
              <span className="report-value">{mostQueried}</span>
            </div>
          </div>
          <div className="tag-row">
            <span className="tag">Buneka Kasa</span>
            <span className="tag">Buneka Stok</span>
            <span className="tag">Buneka Patron</span>
          </div>
          <Link className="button button-amber" href="/login" style={{ marginTop: 18 }}>
            <CircleDollarSign size={20} aria-hidden="true" />
            Lisans Talebi
          </Link>
        </aside>
      </div>
    </main>
  );
}
