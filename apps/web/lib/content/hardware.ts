export const hardwareOptions = {
  standardScanner: {
    id: "standard-scanner",
    label: "Bilgisayara bağlanan barkod okuyucu",
    badge: "Hediye",
    priceLabel: "Ücretsiz dahil",
    summary: "USB ile bilgisayara bağlanır, Fiyat Gör ekranında klavye gibi çalışır.",
    specs: ["USB bağlantı", "1D/2D barkod desteği", "Bilgisayara tak-çalıştır", "Buneka kurulumunda ücretsiz"],
  },
  androidTerminal: {
    id: "android-terminal",
    label: "Android Wi-Fi + Bluetooth El Terminali",
    model: "Zebra TC21 3GB/32GB",
    badge: "Opsiyon",
    priceLabel: "Güncel internet fiyatı kontrol edilir",
    livePriceLabel: "Akakçe örnek en ucuz: 19.331,55 TL",
    priceUpdatedAt: "03.07.2026",
    summary: "Buneka, isteyen müşteriye Android el terminaliyle teslim edilebilir.",
    sourceUrl:
      "https://www.akakce.com/el-terminali/en-ucuz-zebra-tc21-tc210k-01b212-tr-fiyati%2C1905701759.html",
    specs: [
      "Android 10",
      "3 GB RAM / 32 GB depolama",
      "5 inç dokunmatik ekran",
      "Wi-Fi + Bluetooth",
      "1D/2D barkod okuyucu",
      "13 MP kamera",
    ],
    marketNotes: [
      "Akakçe: 74 satıcı içinde kargo dahil en ucuz 19.331,55 TL",
      "Cimri: 24.999 TL'den başlayan teklifler",
      "Hepsiburada: 22.979 TL - 36.959,95 TL fiyat aralığı",
    ],
  },
};

export type HardwareDeliveryOption = "standard" | "terminal";

export function getHardwareDeliveryText(option: HardwareDeliveryOption) {
  if (option === "terminal") {
    return `${hardwareOptions.androidTerminal.model} ${hardwareOptions.androidTerminal.label} ile teslimat istiyorum. Güncel internet fiyatı kontrol edilerek ayrıca bilgilendirilsin.`;
  }

  return `${hardwareOptions.standardScanner.label} hediyeli standart teslimat istiyorum.`;
}
