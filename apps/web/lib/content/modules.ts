import {
  BookUser,
  Clock,
  CloudUpload,
  FileSpreadsheet,
  type LucideIcon,
  Ruler,
  Shirt,
  Smartphone,
  Tag,
  Wrench,
  ReceiptText,
} from "lucide-react";

export type Module = {
  icon: LucideIcon;
  label: string;
  description: string;
  price: string;
};

export const modules: Module[] = [
  {
    icon: Clock,
    label: "Son kullanma tarihi takibi",
    description: "Ürünlerin son kullanma tarihine göre uyarı alın, israfı azaltın.",
    price: "3.000 TL/yıl",
  },
  {
    icon: Tag,
    label: "Raf etiketi yazdırma",
    description: "Barkod ve fiyat bilgisini içeren raf etiketleri hazırlayın.",
    price: "3.000 TL/yıl",
  },
  {
    icon: FileSpreadsheet,
    label: "Excel toplu ürün aktarımı",
    description: "Ürün listenizi Excel'den tek seferde içe aktarın.",
    price: "3.000 TL/yıl",
  },
  {
    icon: Smartphone,
    label: "Çoklu cihaz senkronizasyonu",
    description: "Aynı işletmeyi birden fazla cihazdan eş zamanlı yönetin.",
    price: "6.000 TL/yıl",
  },
  {
    icon: BookUser,
    label: "Cari müşteri ve veresiye defteri",
    description: "Müşteri borç/ödeme takibini dijital deftere taşıyın, tüm çalışanlar aynı veriyi görür.",
    price: "6.000 TL/yıl",
  },
  {
    icon: CloudUpload,
    label: "Bulut yedekleme",
    description: "Tüm verileriniz düzenli olarak buluta yedeklenir.",
    price: "3.000 TL/yıl",
  },
  {
    icon: Shirt,
    label: "Beden ve renk varyantı",
    description: "Giyim ürünlerinde beden/renk bazlı stok takibi yapın.",
    price: "6.000 TL/yıl",
  },
  {
    icon: Ruler,
    label: "Metre, kilo ve birim takibi",
    description: "Hırdavat gibi birimli ürünlerde esnek ölçü desteği.",
    price: "6.000 TL/yıl",
  },
  {
    icon: Wrench,
    label: "Uzaktan / yerinde kurulum desteği",
    description: "Kurulum ve eğitim desteğini ekibimizden alın.",
    price: "3.000 TL/yıl'dan başlar",
  },
  {
    icon: ReceiptText,
    label: "Fatura fotoğrafından ürün aktarımı",
    description: "Tedarikçi faturasının fotoğrafını çek; ürünler, adetler ve fiyatlar saniyeler içinde işlensin.",
    price: "6.000 TL/yıl",
  },
];
