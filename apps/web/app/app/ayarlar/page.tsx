"use client";

import { MonitorSmartphone, Settings, ShieldCheck, Store } from "lucide-react";
import { PageHeader } from "../_components/PageHeader";

const settings = [
  {
    icon: Store,
    title: "İşletme bilgileri",
    text: "İşletme adı, mağaza ve şehir bilgileri Supabase profili üzerinden yönetilir.",
    tone: "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100",
  },
  {
    icon: MonitorSmartphone,
    title: "Cihaz kullanımı",
    text: "Telefon, USB barkod okuyucu ve masaüstü kullanım akışı desteklenir.",
    tone: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
  },
  {
    icon: ShieldCheck,
    title: "Lisans ve yetki",
    text: "Paket özellikleri lisans ve yetki kayıtlarına göre açılır.",
    tone: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  },
];

export default function AyarlarPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Ayarlar" subtitle="İşletme ve sistem ayarlarınız." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {settings.map((item) => (
          <article key={item.title} className="data-card p-7">
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.tone}`}>
              <item.icon size={24} />
            </div>
            <h2 className="font-display mb-3 text-xl font-bold text-slate-950">{item.title}</h2>
            <p className="leading-7 text-slate-500">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="data-card mt-6 p-7">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
          <Settings size={24} />
        </div>
        <h2 className="font-display mb-3 text-xl font-bold text-slate-950">Sonraki ayar adımları</h2>
        <p className="max-w-2xl leading-7 text-slate-500">
          Çoklu cihaz, varsayılan ödeme tipi, stok uyarı seviyesi ve toplu ürün aktarımı ayarları bu panelden yönetilecek.
        </p>
      </div>
    </div>
  );
}
