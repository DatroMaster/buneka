import { modules, type Module } from "./modules";

const MODULE_ALIASES: Record<string, string> = {
  "Raf etiketi": "Raf etiketi yazdırma",
  "Toplu ürün aktarımı": "Excel toplu ürün aktarımı",
  "Excel ürün aktarımı": "Excel toplu ürün aktarımı",
  "Çoklu cihaz": "Çoklu cihaz senkronizasyonu",
  "Giyim beden ve renk varyantı": "Beden ve renk varyantı",
  "Hırdavat metre, kilo ve birim takibi": "Metre, kilo ve birim takibi",
  "Kozmetik marka raporu": "Fatura fotoğrafından ürün aktarımı",
  "Kozmetik son kullanma ve marka raporu": "Son kullanma tarihi takibi",
  "Kırtasiye sezon modülü": "Excel toplu ürün aktarımı",
  "Petshop tekrar alım uyarısı": "Cari müşteri ve veresiye defteri",
  "Toplu fiyat güncelleme": "Excel toplu ürün aktarımı",
};

export function resolveModule(moduleName: string): Module | undefined {
  const label = MODULE_ALIASES[moduleName] || moduleName;
  return modules.find((module) => module.label === label);
}

export function getModulePrice(moduleName: string) {
  return resolveModule(moduleName)?.price || "3.000 TL/yıl";
}
