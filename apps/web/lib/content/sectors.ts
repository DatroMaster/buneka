import {
  BookOpen,
  Dog,
  LucideIcon,
  Scissors,
  Shirt,
  Sparkles,
  Store,
  Wrench,
} from "lucide-react";

export type Sector = {
  slug: string;
  icon: LucideIcon;
  title: string;
  short: string;
  headline: string;
  description: string;
  features: string[];
  modules: string[];
  workflow: string[];
};

export const sectors: Sector[] = [
  {
    slug: "market-bakkal",
    icon: Store,
    title: "Market & Bakkal",
    short: "Hızlı barkod, raf fiyatı, günlük kasa ve stok uyarısı.",
    headline: "Raf, kasa ve stok hafızası tek yerde.",
    description:
      "Buneka market ve bakkallarda fiyat sorusunu hızlandırır, satış gerçekleştiğinde kasaya işler ve stok azaldığında görünür hale getirir.",
    features: ["Barkodla fiyat sorgulama", "Günlük kasa özeti", "Minimum stok uyarısı", "Raf etiketi hazırlığı"],
    modules: ["Son kullanma tarihi takibi", "Raf etiketi", "Toplu ürün aktarımı"],
    workflow: ["Barkodu okut", "Fiyatı göster", "Satış Yapıldı ile kasaya işle", "Stok uyarısını takip et"],
  },
  {
    slug: "kirtasiye",
    icon: BookOpen,
    title: "Kırtasiye",
    short: "Sezon ürünleri, okul listeleri ve hızlı fiyat sorgulama.",
    headline: "Sezon yoğunluğunda fiyat ve stok karmaşasını azalt.",
    description:
      "Kırtasiye işletmeleri için ürün çeşitliliği yüksektir. Buneka hızlı arama, kategori ve stok görünürlüğüyle yoğun dönemleri sadeleştirir.",
    features: ["Kategori bazlı ürün listesi", "Hızlı fiyat güncelleme", "Stokta kalan görünümü", "En çok sorgulanan ürünler"],
    modules: ["Kırtasiye sezon modülü", "Excel toplu ürün aktarımı", "Raf etiketi"],
    workflow: ["Ürünleri kategoriye ayır", "Barkodla fiyatı göster", "Satışı kaydet", "Eksilen ürünleri izle"],
  },
  {
    slug: "petshop",
    icon: Dog,
    title: "Petshop",
    short: "Mama, aksesuar ve tekrar alım takibi.",
    headline: "Müşterinin tekrar alacağı ürünleri kaçırma.",
    description:
      "Petshop ürünlerinde tekrar alım ve stok sürekliliği önemlidir. Buneka hangi ürünün sorulduğunu, satıldığını ve azaldığını gösterir.",
    features: ["Mama stok takibi", "Tekrar alım notları", "Marka/kategori görünümü", "Günlük satış özeti"],
    modules: ["Petshop tekrar alım uyarısı", "Son kullanma tarihi takibi", "Bulut yedekleme"],
    workflow: ["Ürünü okut", "Fiyatı göster", "Satışı kaydet", "Tekrar alım fırsatını not et"],
  },
  {
    slug: "kozmetik",
    icon: Sparkles,
    title: "Kozmetik",
    short: "Marka, seri, son kullanma ve kampanya görünürlüğü.",
    headline: "Marka çeşitliliğini daha düzenli yönet.",
    description:
      "Kozmetik işletmelerinde marka ve ürün çeşitliliği fazladır. Buneka fiyat, stok ve ilgi bilgisini sade bir ekranda toplar.",
    features: ["Marka bazlı ürün takibi", "Fiyat sorgusu hafızası", "Stok azalma uyarısı", "Kampanya görünümü"],
    modules: ["Kozmetik son kullanma ve marka raporu", "Raf etiketi", "Toplu fiyat güncelleme"],
    workflow: ["Markayı/kategoriyi tanımla", "Barkodla fiyatı göster", "Satışı kaydet", "Azalan ürünleri gör"],
  },
  {
    slug: "giyim",
    icon: Shirt,
    title: "Giyim",
    short: "Beden, renk ve sezon ürünleri için sade stok takibi.",
    headline: "Beden ve renk karmaşasını sadeleştir.",
    description:
      "Giyim mağazalarında aynı ürünün farklı varyantları vardır. Buneka temel fiyat ve stok akışını görünür kılar.",
    features: ["Beden/renk varyant notu", "Sezon ürün takibi", "Fiyat sorgusu", "Satış ve stok hareketi"],
    modules: ["Giyim beden ve renk varyantı", "Çoklu cihaz", "Excel ürün aktarımı"],
    workflow: ["Varyantı kaydet", "Fiyatı göster", "Satışı kaydet", "Kalan stoğu izle"],
  },
  {
    slug: "hirdavat",
    icon: Wrench,
    title: "Hırdavat",
    short: "Metre, kilo, adet ve tedarikçi fiyat düzeni.",
    headline: "Birimli ürünlerde fiyat hafızası oluştur.",
    description:
      "Hırdavat işletmelerinde farklı birimler ve tedarikçi fiyatları önemlidir. Buneka temel satış, fiyat ve stok düzenini kurar.",
    features: ["Birim notları", "Tedarikçi görünümü", "Fiyat sorgusu", "Stok hareketi"],
    modules: ["Hırdavat metre, kilo ve birim takibi", "Cari müşteri ve veresiye defteri", "Bulut yedekleme"],
    workflow: ["Birim bilgisini gir", "Fiyatı göster", "Satışı kaydet", "Stok hareketini takip et"],
  },
  {
    slug: "kuafor-kozmetik-satis",
    icon: Scissors,
    title: "Kuaför Yan Satış",
    short: "Şampuan, bakım ürünü ve küçük raf satışları.",
    headline: "Hizmet yanında ürün satışını görünür yap.",
    description:
      "Kuaför ve güzellik işletmeleri küçük raf ürünlerini de takip edebilir. Buneka fiyatı ve satış kaydını basit tutar.",
    features: ["Hızlı ürün ekleme", "Günlük satış özeti", "Stokta kalan", "Basit kategori takibi"],
    modules: ["Raf etiketi", "Kozmetik marka raporu", "Çoklu cihaz"],
    workflow: ["Ürünü ekle", "Fiyatı göster", "Satış Yapıldı ile kaydet", "Gün sonunda kasayı gör"],
  },
];

export function getSector(slug: string) {
  return sectors.find((sector) => sector.slug === slug);
}
