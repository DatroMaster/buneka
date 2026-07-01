"use client";

import { Settings } from "lucide-react";

export default function AyarlarPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ayarlar</h1>
        <p className="text-[#8A9B8E]">İşletme ve sistem ayarlarınız.</p>
      </div>
      
      <div className="bg-[#243328] border border-[#2F4A35] rounded-3xl p-12 text-center text-[#8A9B8E]">
        <Settings size={64} className="mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Ayarlar Yapılandırılıyor</h2>
        <p className="max-w-md mx-auto">Dolar bazlı fiyat, çoklu cihaz yetkilendirmesi, fiş şablonu ve fiş yazıcı bağlantı ayarları çok yakında devrede olacak.</p>
      </div>
    </div>
  );
}
