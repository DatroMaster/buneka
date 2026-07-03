export type BarcodeDevice = {
  id: string;
  name: string;
  type: string;
  bestFor: string;
  fallbackPrice: string;
  image: string;
  sourceUrl: string;
  features: string[];
};

export const barcodeDevices: BarcodeDevice[] = [
  {
    id: "performax-pr17",
    name: "Performax PR-17 Kablolu Barkod Okuyucu",
    type: "Kablolu 1D / USB",
    bestFor: "Fiyat sorgulama ve temel kasa kullanımı",
    fallbackPrice: "799,00 TL",
    image: "https://cdn.akakce.com/performax/performax-pr17-1d-kablolu-z.jpg",
    sourceUrl:
      "https://www.akakce.com/barkod-okuyucu/en-ucuz-performax-pr17-1d-kablolu-fiyati%2C485681351.html",
    features: ["USB tak-çalıştır", "El tipi kullanım", "1D barkod okuma"],
  },
  {
    id: "sunlux-xl6200a",
    name: "Sunlux XL-6200A Kablolu Barkod Okuyucu",
    type: "Kablolu 1D / Standlı",
    bestFor: "Market, kırtasiye ve hızlı ürün okutma",
    fallbackPrice: "996,36 TL",
    image: "https://cdn.akakce.com/sunlux/sunlux-xl-6200a-1d-kablolu-z.jpg",
    sourceUrl:
      "https://www.akakce.com/barkod-okuyucu/en-ucuz-sunlux-xl-6200a-1d-kablolu-fiyati%2C7119806.html",
    features: ["Standlı kullanım", "USB bağlantı", "Yoğun tezgah akışı"],
  },
  {
    id: "tiwox-vs240",
    name: "Tiwox VS-240 Masaüstü Karekod ve Barkod Okuyucu",
    type: "Masaüstü 1D/2D",
    bestFor: "Karekod, masaüstü okuma ve sabit tezgah",
    fallbackPrice: "1.706,89 TL",
    image: "https://cdn.akakce.com/x/tiwox/tiwox-vs-240-masaustu-karekod-ve.jpg",
    sourceUrl:
      "https://www.akakce.com/barkod-okuyucu/en-ucuz-tiwox-vs-240-masaustu-karekod-ve-fiyati%2C720291716.html",
    features: ["Karekod desteği", "Masaüstü kullanım", "USB bağlantı"],
  },
];
