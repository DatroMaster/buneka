"use client";

import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Boxes,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  FileSpreadsheet,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogIn,
  MessageCircle,
  PackagePlus,
  Printer,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  UserCog,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";

const contents = [
  { href: "#hizli-baslangic", label: "Hızlı başlangıç" },
  { href: "#gunluk-akis", label: "Barkod okutma" },
  { href: "#urun-ekleme", label: "Ürün ekleme" },
  { href: "#moduller", label: "Modül rehberleri" },
  { href: "#sorun-cozme", label: "Sorun çözme" },
  { href: "#sss", label: "Sık sorulan sorular" },
  { href: "#guven", label: "Güven ve yasal bilgi" },
  { href: "#destek", label: "Destek" },
];

const roles = [
  {
    title: "İşletme sahibi için",
    text: "Kasa, stok, veresiye, rapor ve çalışan takibini tek yerden görün.",
    icon: UserCog,
  },
  {
    title: "Çalışan için",
    text: "Barkod okut, fiyatı gör, satış yapıldı veya satış yok seçimini hızlıca yap.",
    icon: Users,
  },
  {
    title: "Kurulum yapan kişi için",
    text: "Ürünleri ekle, barkod okuyucuyu test et, Excel aktarımı yap ve ayarları tamamla.",
    icon: Wrench,
  },
];

const quickSetup = [
  "İşletme bilgilerini tamamla",
  "İlk 10 ürünü ekle",
  "Barkod okuyucuyu Not Defteri'nde test et",
  "Bu ne kadar? ekranını aç",
  "İlk satış kaydını yap",
  "Günlük kasa raporunu kontrol et",
];

const dailyFlow = [
  {
    title: "Barkodu okut",
    text: "Ürün barkodunu okuyucu, kamera veya manuel girişle okutun.",
    icon: ScanLine,
  },
  {
    title: "Fiyatı gör",
    text: "Ürün adı, fiyatı ve stok bilgisi ekranda net görünür.",
    icon: BadgeCheck,
  },
  {
    title: "Satışı kaydet",
    text: "Satış yapıldıysa kasaya işler, satış yoksa sadece sorgu olarak kalır.",
    icon: ShoppingCart,
  },
  {
    title: "Kasanı takip et",
    text: "Günlük satış, stok hareketi ve en çok sorulan ürünleri izleyin.",
    icon: BarChart3,
  },
];

const scannerHelp = [
  {
    title: "USB barkod okuyucu nasıl bağlanır?",
    text: "Cihazı USB girişine takın. Çoğu okuyucu klavye gibi çalışır ve ek program istemez.",
  },
  {
    title: "Not Defteri'nde nasıl test edilir?",
    text: "Not Defteri'ni açın, imleci boş alana getirin ve barkodu okutun. Kod yazılıyorsa cihaz çalışıyordur.",
  },
  {
    title: "Barkod okunmuyor ise ne yapılır?",
    text: "Barkodun kırışık olmadığını, ışığın çizgileri tamamen gördüğünü ve cihazın USB bağlantısını kontrol edin.",
  },
  {
    title: "Okunuyor ama ürün bulunmuyorsa?",
    text: "Ürün daha önce eklenmemiştir. Ürünler ekranından barkod, ad, fiyat ve stok bilgisini kaydedin.",
  },
  {
    title: "Enter göndermeyen cihaz nasıl ayarlanır?",
    text: "Cihazın kullanım kılavuzundaki Enter/CR suffix barkodunu okutun. Gerekirse destek hattına model bilgisini gönderin.",
  },
  {
    title: "Kamera ile barkod okutma ne zaman kullanılır?",
    text: "Ek cihaz yoksa veya saha/raf kontrolü yapılıyorsa kamera pratik bir yedek yöntemdir.",
  },
];

const moduleGuides = [
  {
    title: "Fiyat Sorgulama",
    icon: ScanLine,
    use: "Barkod okutulduğunda ürün fiyatını ve stok bilgisini hızlı gösterir.",
    who: "Kasadaki çalışan, işletme sahibi ve fiyat sorusu alan herkes.",
    when: "Müşteri fiyat sorduğunda veya ürün etiketi kontrol edilirken.",
    steps: ["Bu ne kadar? ekranını açın", "Barkodu okutun", "Fiyatı müşteriye söyleyin", "Satış olduysa Satış Yap'a basın"],
    mistake: "Satış olduğu halde Satış Yap'a basmamak.",
    tip: "Çalışanlara satış yok seçiminin de rapora değer kattığını anlatın.",
  },
  {
    title: "Ürün Yönetimi",
    icon: Boxes,
    use: "Barkod, ürün adı, kategori, fiyat ve stok bilgisini düzenli tutar.",
    who: "Kurulum yapan kişi veya ürün/fiyat güncelleyen yetkili.",
    when: "Yeni ürün geldiğinde, fiyat değiştiğinde veya stok sayımı yapılırken.",
    steps: ["Ürünler ekranını açın", "Yeni ürün ekleyin", "Barkod ve fiyat bilgisini girin", "Stok miktarını kaydedin"],
    mistake: "Aynı barkodu iki farklı ürüne yazmak.",
    tip: "İlk gün en çok satılan 10 ürünle başlayın, sonra listeyi büyütün.",
  },
  {
    title: "Günlük Kasa",
    icon: WalletCards,
    use: "Gün içindeki satış tutarı, sorgu sayısı ve kasa hareketini özetler.",
    who: "İşletme sahibi ve gün sonu kontrolü yapan çalışan.",
    when: "Gün sonunda, vardiya değişiminde veya kasa kontrolünde.",
    steps: ["Günlük Kasa ekranını açın", "Toplam kasa ve satış adedini kontrol edin", "Son satışları inceleyin"],
    mistake: "Satışları sisteme işlemeyip kasa raporunun eksik kalmasına neden olmak.",
    tip: "Gün sonu rutininizi kasa ekranını kontrol ederek kapatın.",
  },
  {
    title: "Stok Takibi",
    icon: PackagePlus,
    use: "Stok giriş-çıkışlarını ve minimum stok uyarılarını görünür yapar.",
    who: "Depo/raf takibi yapan kişi ve işletme sahibi.",
    when: "Ürün geldiğinde, satış sonrası stok düştüğünde veya sayım yapılırken.",
    steps: ["Stok Takibi ekranını açın", "Stok girişi yapın", "Minimum stok seviyesini belirleyin"],
    mistake: "Yeni gelen ürünü stok girişine işlememek.",
    tip: "Hızlı dönen ürünlere daha yüksek minimum stok seviyesi verin.",
  },
  {
    title: "Veresiye Defteri",
    icon: CreditCard,
    use: "Müşteri borç, tahsilat ve kalan bakiye takibini dijital olarak yönetir.",
    who: "Bakkal, market, kırtasiye, petshop ve mahalle esnafı.",
    when: "Müşteriye borç yazıldığında veya tahsilat alındığında.",
    steps: ["Veresiye ekranını açın", "Müşteriyi seçin veya ekleyin", "Borç kaydı oluşturun", "Tahsilatta ödeme tamamla seçin"],
    mistake: "Tahsilat alınıp sisteme işlenmezse kasa ve veresiye raporu uyuşmaz.",
    tip: "Tahsilatı aldığınız anda sisteme işleyin.",
  },
  {
    title: "Excel Toplu Aktarım",
    icon: FileSpreadsheet,
    use: "Çok sayıda ürünü tek tek girmeden sisteme ekler.",
    who: "Kurulum yapan kişi veya büyük ürün listesi olan işletme.",
    when: "İlk kurulumda veya tedarikçi listesi geldiğinde.",
    steps: ["Şablonu indirin", "Barkod, ad, fiyat ve stok alanlarını doldurun", "Toplu aktarım ekranından yükleyin"],
    mistake: "Fiyat veya barkod sütununu boş bırakmak.",
    tip: "Yüklemeden önce ilk 5 satırı kontrol edin.",
  },
  {
    title: "Fatura Fotoğrafı",
    icon: Camera,
    use: "Tedarikçi faturasının fotoğrafından ürün, adet ve fiyat bilgilerini çıkarmaya yardımcı olur.",
    who: "Ürün girişi yapan işletme sahibi veya çalışan.",
    when: "Tedarikçiden yeni ürün geldiğinde.",
    steps: ["Faturayı düz zeminde çekin", "Gölgeyi azaltın", "Aktarım ekranından fotoğrafı yükleyin", "Gelen ürünleri kontrol edin"],
    mistake: "Bulanık veya yarım fatura fotoğrafı yüklemek.",
    tip: "Son onaydan önce ürün adını ve fiyatı mutlaka gözden geçirin.",
  },
  {
    title: "Lisans ve Ayarlar",
    icon: Settings,
    use: "İşletme bilgisi, ödeme tipi, stok uyarısı ve lisans durumunu yönetir.",
    who: "İşletme sahibi veya yetkili yönetici.",
    when: "İlk kurulumda, lisans yenilemede veya işletme bilgisi değiştiğinde.",
    steps: ["Ayarlar ekranını açın", "İşletme bilgilerini tamamlayın", "Lisans ve yetki bölümünü kontrol edin"],
    mistake: "Eksik işletme bilgisiyle kullanıcı hesabı açmak.",
    tip: "Lisans bitiş tarihini düzenli kontrol edin.",
  },
];

const troubleshooting = [
  "Barkod okunmuyor: USB bağlantısını, barkod yüzeyini ve okuyucu ışığını kontrol edin.",
  "Ürün bulunmuyor: Ürün daha önce sisteme eklenmemiş olabilir.",
  "Fiyat görünmüyor: Ürün kartında satış fiyatı alanı boş olabilir.",
  "Stok düşmüyor: Satış Yap butonuna basıldığından emin olun.",
  "Excel yüklenmiyor: Şablon başlıklarını değiştirmeyin ve zorunlu alanları boş bırakmayın.",
  "Lisans görünmüyor: Ayarlar ekranından lisans durumunu kontrol edin.",
];

const faqs = [
  {
    q: "Buneka yazarkasa yerine geçer mi?",
    a: "Hayır. Buneka resmi yazarkasa veya mali belge sistemi değildir; operasyon takibi için yardımcı işletme yönetim sistemidir.",
  },
  {
    q: "İnternet olmadan çalışır mı?",
    a: "Canlı veritabanı ve çoklu cihaz senkronizasyonu için internet bağlantısı gerekir.",
  },
  {
    q: "Kaç cihazdan kullanılır?",
    a: "Paket ve lisans kapsamına göre çoklu cihaz erişimi açılabilir.",
  },
  {
    q: "Lisans bitince ne olur?",
    a: "Lisans süresi dolduğunda erişim ve paket özellikleri kısıtlanabilir. Yenileme için destek hattıyla görüşebilirsiniz.",
  },
  {
    q: "Veriler güvende mi?",
    a: "Veriler yetkili hesaplarla yönetilir. Kullanıcı yetkileri ve lisans kontrolü panel üzerinden takip edilir.",
  },
  {
    q: "Çalışanlar her şeyi görebilir mi?",
    a: "Kullanıcı rolü ve paket kapsamına göre erişim alanları sınırlandırılabilir.",
  },
];

type SearchResult = {
  title: string;
  text: string;
  href: string;
  kind: string;
};

const searchIndex: SearchResult[] = [
  ...contents.map((item) => ({
    title: item.label,
    text: "Rehber bölümü",
    href: item.href,
    kind: "Bölüm",
  })),
  ...scannerHelp.map((item) => ({
    title: item.title,
    text: item.text,
    href: "#barkod",
    kind: "Barkod",
  })),
  ...moduleGuides.map((module) => ({
    title: module.title,
    text: [module.use, module.who, module.when, module.mistake, module.tip, ...module.steps].join(" "),
    href: "#moduller",
    kind: "Modül",
  })),
  ...troubleshooting.map((item) => ({
    title: item.split(":")[0] || "Sorun çözme",
    text: item,
    href: "#sorun-cozme",
    kind: "Sorun",
  })),
  ...faqs.map((faq) => ({
    title: faq.q,
    text: faq.a,
    href: "#sss",
    kind: "SSS",
  })),
];

function VisualCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-emerald-300/18 bg-neutral-950/74 p-4 shadow-sm">
      <p className="font-display text-base font-black text-stone-50">{title}</p>
      <p className="mt-1 text-xs font-semibold text-stone-500">Ekranda sade sırayla ilerlenir.</p>
      <div className="mt-3 grid gap-2">
        {lines.map((line, index) => (
          <div key={line} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-[10px] font-black text-neutral-950">
              {index + 1}
            </span>
            <span className="text-xs font-bold text-stone-300">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HelpCenterClient() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

  const filteredModules = useMemo(() => {
    if (!normalizedQuery) return moduleGuides;
    return moduleGuides.filter((module) => {
      const haystack = [
        module.title,
        module.use,
        module.who,
        module.when,
        module.mistake,
        module.tip,
        ...module.steps,
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR");
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return searchIndex
      .filter((item) => {
        const haystack = `${item.title} ${item.text} ${item.kind}`.toLocaleLowerCase("tr-TR");
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [normalizedQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="help-center-dark relative min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[color:var(--color-text)]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/82 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-cyan-300/15 dark:bg-[#07111F]/90 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-2.5">
              <BunekaMark size={26} className="shrink-0" />
              <BunekaWordmark className="whitespace-nowrap text-xs text-slate-950 dark:text-slate-100 sm:text-sm" />
            </Link>
            <ThemeToggle className="shrink-0 border-slate-200 bg-white/70 text-slate-700 hover:border-cyan-400 dark:border-cyan-300/20 dark:bg-transparent dark:text-slate-200 dark:hover:border-cyan-300 sm:hidden" />
          </div>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/" className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 text-xs font-black text-slate-700 hover:border-cyan-400 dark:border-cyan-300/20 dark:bg-transparent dark:text-slate-200 dark:hover:border-cyan-300">
              <Home size={14} /> Ana Menü
            </Link>
            <Link href="/app" className="hidden h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 text-xs font-black text-slate-700 hover:border-cyan-400 dark:border-cyan-300/20 dark:bg-transparent dark:text-slate-200 dark:hover:border-cyan-300 sm:flex">
              <LayoutDashboard size={14} /> Panele Dön
            </Link>
            <BunekaNedirButton />
            <ThemeToggle className="hidden border-slate-200 bg-white/70 text-slate-700 hover:border-cyan-400 dark:border-cyan-300/20 dark:bg-transparent dark:text-slate-200 dark:hover:border-cyan-300 sm:flex" />
          </div>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm sm:hidden"
          >
            <LogIn size={17} /> Sisteme Giriş Yap
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="order-2 lg:sticky lg:top-20 lg:order-none lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white/86 p-4 shadow-[0_18px_70px_rgba(10,25,49,0.10)] backdrop-blur dark:border-cyan-300/15 dark:bg-[#07111F]/85 dark:shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">İçindekiler</p>
            <nav className="mt-3 grid gap-1">
              {contents.map((item) => (
                <a key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-cyan-50 hover:text-cyan-700">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="order-1 grid gap-6 lg:order-none">
          <section className="rounded-3xl border border-slate-200 bg-white/88 p-5 shadow-[0_18px_80px_rgba(10,25,49,0.12)] backdrop-blur dark:border-cyan-300/15 dark:bg-[#07111F]/88 dark:shadow-[0_18px_80px_rgba(0,0,0,0.34)] sm:p-6">
            <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-950">
              Ana sayfa
            </Link>
            <div className="grid gap-5 lg:grid-cols-[1fr_390px] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">
                  <BookOpenCheck size={13} /> Buneka Yardım Merkezi
                </span>
                <h1 className="mt-4 max-w-4xl font-display text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl lg:text-5xl">
                  Kurulum, Barkod Okutma, Satış, Stok ve Kasa Takibi Rehberi
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Buneka&apos;yı 15 dakika içinde kurun, ilk ürünlerinizi ekleyin, barkodla fiyat sorgulayın, satışlarınızı
                  ve stok hareketlerinizi tek ekrandan takip edin.
                </p>
                <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm font-bold leading-6 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                  Dükkanın hafızası artık tek kişinin aklında değil, sistemde.
                </p>
              </div>
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white/64 p-3 shadow-sm dark:border-cyan-300/15 dark:bg-slate-950/35">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rehberde ara: barkod, stok, veresiye, Excel, lisans..."
                    className="h-[52px] w-full rounded-2xl border border-slate-200 bg-white/85 pl-11 pr-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-400/12 dark:border-cyan-300/20 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-300"
                  />
                  {normalizedQuery && (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-300/40 backdrop-blur dark:border-cyan-300/20 dark:bg-[#07111F]/95 dark:shadow-cyan-950/40">
                      {searchResults.length > 0 ? (
                        <div className="grid gap-1.5">
                          {searchResults.map((result) => (
                            <a
                              key={`${result.kind}-${result.title}`}
                              href={result.href}
                              onClick={() => setQuery("")}
                              className="rounded-xl border border-transparent px-3 py-2 transition hover:border-cyan-300/20 hover:bg-cyan-400/10"
                            >
                              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{result.kind}</span>
                              <p className="mt-0.5 text-sm font-black text-slate-950 dark:text-slate-100">{result.title}</p>
                              <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{result.text}</p>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="px-3 py-3 text-sm font-bold text-slate-300">
                          Sonuç bulunamadı. Barkod, stok, veresiye veya lisans gibi başka bir kelime deneyin.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-black text-white">
                    <LogIn size={16} /> Giriş yap
                  </Link>
                  <a
                    href={whatsappLink("Merhaba, Buneka Yardım Merkezi üzerinden destek almak istiyorum.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-black text-emerald-800"
                  >
                    <MessageCircle size={16} /> Destek al
                  </a>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700"
                  >
                    <Printer size={16} /> PDF kaydet
                  </button>
                  <a
                    href="/buneka-urun-sablonu.csv"
                    download
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 text-sm font-black text-cyan-800"
                  >
                    <Download size={16} /> Excel şablonu
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            {roles.map((role) => (
              <article key={role.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <role.icon size={22} className="text-cyan-700" />
                <h2 className="mt-3 font-display text-lg font-black">{role.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{role.text}</p>
              </article>
            ))}
          </section>

          <section id="hizli-baslangic" className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">15 Dakikalık Kurulum</p>
              <h2 className="mt-2 font-display text-3xl font-black">Satışa hazır hale gelin.</h2>
              <p className="mt-3 text-sm leading-6 text-emerald-900">
                Bu adımları tamamladığınızda Buneka fiyat sorgulama, satış kaydı ve kasa takibi için hazır hale gelir.
              </p>
            </div>
            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
              {quickSetup.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-black text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="gunluk-akis" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-black">Günlük Kullanım Akışı</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Barkodu okut, fiyatı gör, satışını bil, kasanı takip et. Buneka&apos;nın günlük dili bu kadar sade kalmalı.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {dailyFlow.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <step.icon size={22} className="text-cyan-700" />
                    <span className="text-xs font-black text-slate-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-black">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="urun-ekleme" className="grid gap-4 lg:grid-cols-3">
            <VisualCard title="Ürün ekleme ekranı örneği" lines={["Barkod", "Ürün adı", "Satış fiyatı", "Stok"]} />
            <VisualCard title="Günlük kasa raporu örneği" lines={["Toplam kasa", "Satılan ürün", "Sorgu sayısı", "Son satışlar"]} />
            <VisualCard title="Fatura fotoğrafı akışı" lines={["Fotoğraf çek", "Ürünleri kontrol et", "Aktarımı onayla"]} />
          </section>

          <section id="barkod" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-black">Cihaz ve Barkod Okuyucu Kurulumu</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Küçük işletmeci için en kritik konu cihazın hemen çalışmasıdır. Önce Not Defteri testiyle cihazı doğrulayın.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {scannerHelp.map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-display text-base font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="moduller" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <h2 className="font-display text-2xl font-black">Modül Rehberleri</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Her modül için ne işe yarar, kim kullanır, ne zaman kullanılır ve sık hata bilgisi.
                </p>
              </div>
              {normalizedQuery && (
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                  {filteredModules.length} sonuç
                </span>
              )}
            </div>
            <div className="mt-4 grid gap-4">
              {filteredModules.map((module) => (
                <article key={module.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[240px_1fr]">
                    <div>
                      <module.icon size={24} className="text-cyan-700" />
                      <h3 className="mt-3 font-display text-xl font-black">{module.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{module.use}</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Kim kullanır?</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{module.who}</p>
                      </div>
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Ne zaman?</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{module.when}</p>
                      </div>
                      <div className="rounded-xl bg-white p-3 md:col-span-2">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Adım adım</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {module.steps.map((step) => (
                            <span key={step} className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl bg-amber-50 p-3">
                        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Sık hata</p>
                        <p className="mt-1 text-sm font-semibold text-amber-900">{module.mistake}</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 p-3">
                        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">İpucu</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-900">{module.tip}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="sorun-cozme" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-black">Sorun Çözme Merkezi</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {troubleshooting.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
                  <p className="text-sm font-semibold leading-6 text-amber-950">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="sss" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-black">Sık Sorulan Sorular</h2>
            <div className="mt-4 grid gap-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-base font-black">
                    <span className="flex items-center gap-2">
                      <HelpCircle size={18} className="text-cyan-700" />
                      {faq.q}
                    </span>
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="guven" className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
              <ShieldCheck size={24} className="text-cyan-800" />
              <h2 className="mt-3 font-display text-2xl font-black">Önemli Bilgilendirme</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-cyan-950">
                Buneka, resmi yazarkasa veya mali belge sistemi değildir. Küçük işletmelerin fiyat sorgulama, satış
                hafızası, stok takibi, veresiye ve operasyon düzeni için geliştirilmiş yardımcı bir işletme yönetim
                sistemidir.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ClipboardCheck size={24} className="text-emerald-700" />
              <h2 className="mt-3 font-display text-2xl font-black">Destek almadan önce</h2>
              <ul className="mt-3 grid gap-2">
                {["İnternet bağlantınız var mı?", "Barkod okuyucu Not Defteri'nde çalışıyor mu?", "Ürün sisteme eklendi mi?", "Fiyat alanı dolu mu?", "Lisans durumunuz aktif mi?"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-600" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="destek" className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <h2 className="font-display text-2xl font-black">Hâlâ sorun yaşıyorsanız</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              WhatsApp destek hattımıza ekran görüntüsü, işletme adı ve yaşadığınız adımı gönderin. Böylece destek daha hızlı ve net ilerler.
            </p>
            <a
              href={whatsappLink("Merhaba, Buneka'da destek almak istiyorum. İşletme adım: ... Yaşadığım adım: ...")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-black text-slate-950"
            >
              <MessageCircle size={17} /> WhatsApp destek hattı
            </a>
          </section>
        </div>
      </section>
    </main>
  );
}
