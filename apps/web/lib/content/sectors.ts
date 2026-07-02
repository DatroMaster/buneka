import {
  Apple,
  BookOpen,
  Dog,
  Gamepad2,
  Home,
  LucideIcon,
  Scissors,
  Shirt,
  Smartphone,
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
  {
    slug: "elektronik-aksesuar",
    icon: Smartphone,
    title: "Elektronik & Aksesuar",
    short: "Model, garanti ve hızlı fiyat kıyaslama.",
    headline: "Model karmaşasında fiyatı saniyede göster.",
    description:
      "Elektronik ve aksesuar satışında model çeşitliliği fazladır. Buneka barkodla anında fiyat ve stok bilgisi sunar.",
    features: ["Model bazlı fiyat sorgusu", "Stok azalma uyarısı", "Kâr marjı görünümü", "Hızlı satış kaydı"],
    modules: ["Excel toplu ürün aktarımı", "Çoklu cihaz", "Bulut yedekleme"],
    workflow: ["Barkodu okut", "Fiyatı göster", "Satışı kaydet", "Stok uyarısını takip et"],
  },
  {
    slug: "zuccaciye-ev-esyasi",
    icon: Home,
    title: "Züccaciye & Ev Eşyası",
    short: "Set/parça ürünlerde fiyat ve stok düzeni.",
    headline: "Set ve parça ürünlerde karışıklığı bitir.",
    description:
      "Züccaciye ve ev eşyasında set/parça ayrımı takip edilmesi gereken bir detaydır. Buneka her ürünü kendi barkoduyla düzenli tutar.",
    features: ["Set/parça ayrımı", "Fiyat sorgusu hafızası", "Stok azalma uyarısı", "Kategori görünümü"],
    modules: ["Raf etiketi", "Toplu ürün aktarımı", "Cari müşteri ve veresiye defteri"],
    workflow: ["Ürünü kategoriye ayır", "Fiyatı göster", "Satışı kaydet", "Kalan stoğu izle"],
  },
  {
    slug: "oyuncak",
    icon: Gamepad2,
    title: "Oyuncak",
    short: "Sezon, yaş grubu ve kampanya takibi.",
    headline: "Sezonluk yoğunlukta hız kazan.",
    description:
      "Oyuncakçılarda bayram/sezon dönemlerinde satış yoğunluğu artar. Buneka hızlı fiyat sorgusu ve kasa akışıyla yoğunluğu yönetilebilir kılar.",
    features: ["Yaş grubu/kategori notu", "Hızlı fiyat sorgusu", "Günlük kasa özeti", "Kampanya görünümü"],
    modules: ["Raf etiketi", "Excel toplu ürün aktarımı", "Çoklu cihaz"],
    workflow: ["Ürünü okut", "Fiyatı göster", "Satış Yapıldı ile kaydet", "Gün sonunda kasayı gör"],
  },
  {
    slug: "sarkuteri-manav",
    icon: Apple,
    title: "Şarküteri & Manav",
    short: "Kilo bazlı ürün ve günlük fiyat güncelleme.",
    headline: "Günlük değişen fiyatları anında yansıt.",
    description:
      "Şarküteri ve manavda fiyatlar sık değişir. Buneka toplu fiyat güncelleme ile günlük fiyat değişimini hızla yansıtır.",
    features: ["Kilo bazlı fiyat notu", "Toplu fiyat güncelleme", "Günlük kasa özeti", "Tedarikçi görünümü"],
    modules: ["Cari müşteri ve veresiye defteri", "Bulut yedekleme", "Metre, kilo ve birim takibi"],
    workflow: ["Günlük fiyatı gir/güncelle", "Barkodla fiyatı göster", "Satışı kaydet", "Kasayı gör"],
  },
];

export function getSector(slug: string) {
  return sectors.find((sector) => sector.slug === slug);
}

const WORKFLOW_DETAILS: Record<string, string> = {
  "Barkodu okut": "Kamerayla veya barkod okuyucuyla ürünü saniyeler içinde tanır.",
  "Fiyatı göster": "Satış fiyatı büyük puntoyla ekrana gelir, müşteri de görebilir.",
  "Satış Yapıldı ile kasaya işle": "Tek dokunuşla satış kaydedilir, günlük kasaya otomatik yansır.",
  "Stok uyarısını takip et": "Stok azaldığında sistem sizi otomatik uyarır.",
  "Ürünleri kategoriye ayır": "Ürünleri kategoriye göre gruplayın, aramayı hızlandırın.",
  "Satışı kaydet": "Satışı tek tıkla kaydedin, kasa ve stok otomatik güncellenir.",
  "Eksilen ürünleri izle": "Azalan stok kalemlerini anlık olarak görün.",
  "Ürünü okut": "Barkodu okutun, ürün bilgisi anında ekrana gelsin.",
  "Tekrar alım fırsatını not et": "Müşterinin tekrar alacağı ürünü not edip hatırlatma oluşturun.",
  "Markayı/kategoriyi tanımla": "Ürünü marka veya kategoriye göre tanımlayın.",
  "Azalan ürünleri gör": "Stoğu azalan ürünleri tek ekranda görün.",
  "Varyantı kaydet": "Beden/renk gibi varyant bilgisini ürüne ekleyin.",
  "Kalan stoğu izle": "Kalan stok miktarını anlık takip edin.",
  "Birim bilgisini gir": "Metre, kilo gibi birim bilgisini ürüne ekleyin.",
  "Stok hareketini takip et": "Giriş/çıkış hareketlerini geçmişten inceleyin.",
  "Ürünü ekle": "Yeni ürünü barkoduyla saniyeler içinde ekleyin.",
  "Satış Yapıldı ile kaydet": "Satışı tek dokunuşla kaydedin, kasa otomatik güncellensin.",
  "Gün sonunda kasayı gör": "Gün sonunda toplam kasa tutarını tek ekranda görün.",
  "Günlük fiyatı gir/güncelle": "Günlük değişen fiyatları toplu güncelleyin.",
  "Kasayı gör": "Günlük kasa tutarını anlık olarak görün.",
};

const MODULE_DETAILS: Record<string, string> = {
  "Son kullanma tarihi takibi": "Ürünlerin son kullanma tarihine göre uyarı alın, israfı azaltın.",
  "Raf etiketi": "Barkod ve fiyat bilgili raf etiketleri hazırlayın.",
  "Toplu ürün aktarımı": "Ürün listenizi tek seferde içe aktarın.",
  "Kırtasiye sezon modülü": "Okul/sezon dönemlerine özel hızlı ürün ve fiyat yönetimi.",
  "Excel toplu ürün aktarımı": "Excel dosyanızdan ürünleri tek seferde yükleyin.",
  "Petshop tekrar alım uyarısı": "Müşterinin tekrar alacağı ürünler için hatırlatma oluşturun.",
  "Bulut yedekleme": "Tüm verileriniz düzenli olarak buluta yedeklenir.",
  "Kozmetik son kullanma ve marka raporu": "Marka ve son kullanma tarihine göre özel rapor alın.",
  "Toplu fiyat güncelleme": "Kategoriye göre fiyatları tek seferde güncelleyin.",
  "Giyim beden ve renk varyantı": "Beden/renk varyantlarını tek üründe yönetin.",
  "Çoklu cihaz": "Aynı işletmeyi birden fazla cihazdan eş zamanlı yönetin.",
  "Hırdavat metre, kilo ve birim takibi": "Metre, kilo gibi birimli ürünlerde esnek ölçü desteği.",
  "Cari müşteri ve veresiye defteri": "Müşteri borç/ödeme takibini dijital deftere taşıyın.",
  "Kozmetik marka raporu": "Marka bazlı satış ve stok raporunu görün.",
  "Metre, kilo ve birim takibi": "Metre, kilo gibi birimli ürünlerde esnek ölçü desteği.",
};

export function getWorkflowDetail(step: string) {
  return WORKFLOW_DETAILS[step] || "Buneka bu adımı sizin için otomatikleştirir.";
}

export function getModuleDetail(moduleName: string) {
  return MODULE_DETAILS[moduleName] || "Lisansınıza yıllık ek ücretle eklenebilen bir modül.";
}
