"use client";

import { BarChart3 } from "lucide-react";

export default function RaporlarPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Akıllı Raporlar</h1>
        <p className="text-[#8A9B8E]">İşletmenizin performans analizi.</p>
      </div>
      
      <div className="bg-[#243328] border border-[#2F4A35] rounded-3xl p-12 text-center text-[#8A9B8E]">
        <BarChart3 size={64} className="mx-auto mb-4 opacity-50 text-[#C8913A]" />
        <h2 className="text-xl font-bold text-white mb-2">Detaylı Raporlar Yakında</h2>
        <p className="max-w-md mx-auto">Gelişmiş kâr analizi, en çok sorulan ama satılmayan ürünler (SERENIS) ve personel performansı modülleri aktif ediliyor.</p>
      </div>
    </div>
  );
}
