"use client";

import { BarChart3, Boxes, ScanBarcode, WalletCards } from "lucide-react";
import { PageHeader } from "../_components/PageHeader";

const reports = [
  {
    icon: ScanBarcode,
    title: "Fiyat sorgusu",
    text: "Gün içinde kaç ürün sorulduğunu ve hangi ürünlere ilgi geldiğini gösterir.",
    tone: "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100",
  },
  {
    icon: WalletCards,
    title: "Kasa özeti",
    text: "Satış kayıtlarından günlük toplam ve ödeme türü görünümü üretir.",
    tone: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
  },
  {
    icon: Boxes,
    title: "Stok uyarısı",
    text: "Minimum stok seviyesine yaklaşan ürünleri hızlıca görmenizi sağlar.",
    tone: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  },
  {
    icon: BarChart3,
    title: "Ürün performansı",
    text: "En çok satılan ve en çok sorgulanan ürünleri karşılaştırır.",
    tone: "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100",
  },
];

export default function RaporlarPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Raporlar" subtitle="Fiyat sorgusu, satış ve stok hareketlerini sade özetlerle görün." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <article key={report.title} className="data-card p-7">
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${report.tone}`}>
              <report.icon size={24} />
            </div>
            <h2 className="font-display mb-3 text-xl font-bold text-slate-950">{report.title}</h2>
            <p className="leading-7 text-slate-500">{report.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
