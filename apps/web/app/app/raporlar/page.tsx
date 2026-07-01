"use client";

import { BarChart3, Boxes, ScanBarcode, WalletCards } from "lucide-react";

const reports = [
  {
    icon: ScanBarcode,
    title: "Fiyat sorgusu",
    text: "Gün içinde kaç ürün sorulduğunu ve hangi ürünlere ilgi geldiğini gösterir.",
  },
  {
    icon: WalletCards,
    title: "Kasa özeti",
    text: "Satış kayıtlarından günlük toplam ve ödeme türü görünümü üretir.",
  },
  {
    icon: Boxes,
    title: "Stok uyarısı",
    text: "Minimum stok seviyesine yaklaşan ürünleri hızlıca görmenizi sağlar.",
  },
  {
    icon: BarChart3,
    title: "Ürün performansı",
    text: "En çok satılan ve en çok sorgulanan ürünleri karşılaştırır.",
  },
];

export default function RaporlarPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Raporlar</h1>
        <p className="text-[#8A9B8E]">
          Fiyat sorgusu, satış ve stok hareketlerini sade özetlerle görün.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <article key={report.title} className="rounded-3xl border border-[#2F4A35] bg-[#243328] p-7">
            <report.icon size={32} className="mb-5 text-[#C8913A]" />
            <h2 className="mb-3 text-xl font-bold text-white">{report.title}</h2>
            <p className="leading-7 text-[#8A9B8E]">{report.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
