"use client";

import { MonitorSmartphone, Settings, ShieldCheck, Store } from "lucide-react";

const settings = [
  {
    icon: Store,
    title: "İşletme bilgileri",
    text: "İşletme adı, mağaza ve şehir bilgileri Supabase profili üzerinden yönetilir.",
  },
  {
    icon: MonitorSmartphone,
    title: "Cihaz kullanımı",
    text: "Telefon, USB barkod okuyucu ve masaüstü kullanım akışı desteklenir.",
  },
  {
    icon: ShieldCheck,
    title: "Lisans ve yetki",
    text: "Paket özellikleri lisans ve yetki kayıtlarına göre açılır.",
  },
];

export default function AyarlarPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-950">Ayarlar</h1>
        <p className="text-slate-500">İşletme ve sistem ayarlarınız.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {settings.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7">
            <item.icon size={32} className="mb-5 text-cyan-600" />
            <h2 className="mb-3 text-xl font-bold text-slate-950">{item.title}</h2>
            <p className="leading-7 text-slate-500">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7">
        <Settings size={28} className="mb-4 text-orange-500" />
        <h2 className="mb-3 text-xl font-bold text-slate-950">Sonraki ayar adımları</h2>
        <p className="max-w-2xl leading-7 text-slate-500">
          Çoklu cihaz, varsayılan ödeme tipi, stok uyarı seviyesi ve toplu ürün aktarımı ayarları bu panelden yönetilecek.
        </p>
      </div>
    </div>
  );
}
