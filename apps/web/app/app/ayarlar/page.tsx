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
        <h1 className="mb-2 text-3xl font-bold text-white">Ayarlar</h1>
        <p className="text-[#8A9B8E]">İşletme ve sistem ayarlarınız.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {settings.map((item) => (
          <article key={item.title} className="rounded-3xl border border-[#2F4A35] bg-[#243328] p-7">
            <item.icon size={32} className="mb-5 text-[#4F6F52]" />
            <h2 className="mb-3 text-xl font-bold text-white">{item.title}</h2>
            <p className="leading-7 text-[#8A9B8E]">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-[#2F4A35] bg-[#243328] p-7">
        <Settings size={28} className="mb-4 text-[#C8913A]" />
        <h2 className="mb-3 text-xl font-bold text-white">Sonraki ayar adımları</h2>
        <p className="max-w-2xl leading-7 text-[#8A9B8E]">
          Çoklu cihaz, varsayılan ödeme tipi, stok uyarı seviyesi ve toplu ürün aktarımı ayarları bu panelden yönetilecek.
        </p>
      </div>
    </div>
  );
}
