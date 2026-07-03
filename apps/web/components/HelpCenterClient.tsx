"use client";

import {
  AlertTriangle,
  ArrowRight,
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
  ThumbsDown,
  ThumbsUp,
  UserCog,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";

const contents = [
  { href: "#arama", label: "Akıllı arama" },
  { href: "#hizli-baslangic", label: "Hızlı başlangıç" },
  { href: "#gunluk-akis", label: "Günlük kullanım" },
  { href: "#urun-ekleme", label: "Ekran örnekleri" },
  { href: "#barkod", label: "Barkod okuyucu" },
  { href: "#moduller", label: "Modül rehberleri" },
  { href: "#sorun-cozme", label: "Uyarılar" },
  { href: "#sss", label: "Sık sorulanlar" },
  { href: "#guven", label: "Güven ve yasal bilgi" },
  { href: "#destek", label: "Canlı destek" },
];

const roles = [
  {
    title: "İşletme sahibi",
    text: "Kasa, stok, veresiye, rapor ve çalışan takibini tek merkezden görür.",
    icon: UserCog,
  },
  {
    title: "Kasadaki çalışan",
    text: "Barkodu okutur, fiyatı görür, satış yapıldı veya satış yok seçimini hızlıca yapar.",
    icon: Users,
  },
  {
    title: "Kurulum yapan kişi",
    text: "Ürünleri ekler, barkod okuyucuyu test eder, Excel aktarımı ve ayarları tamamlar.",
    icon: Wrench,
  },
];

const quickSetup = [
  "İşletme bilgilerini tamamla",
  "İlk 10 ürünü ekle",
  "Barkod okuyucuyu Not Defteri'nde test et",
  "Fiyat Gör ekranını aç",
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
    text: "Ürün adı, fiyatı ve stok bilgisi yüksek kontrastla ekrana gelir.",
    icon: BadgeCheck,
  },
  {
    title: "Satışı kaydet",
    text: "Tekli satış veya sepetli satış kasaya ve stok hareketlerine işler.",
    icon: ShoppingCart,
  },
  {
    title: "Raporu izle",
    text: "Günlük satış, sorgu sayısı ve en çok sorulan ürünleri takip edin.",
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
    text: "Barkodun kırışık olmadığını, ışığın çizgileri gördüğünü ve USB bağlantısını kontrol edin.",
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
    steps: ["Fiyat Gör ekranını aç", "Barkodu okut", "Fiyatı müşteriye söyle", "Satış olduysa Satış Yap'a bas"],
    mistake: "Satış olduğu halde Satış Yap'a basmamak.",
    tip: "Satış Yok seçimi de rapora değer katar; çalışanlara bu ayrımı anlatın.",
  },
  {
    title: "Ürün Yönetimi",
    icon: Boxes,
    use: "Barkod, ürün adı, kategori, fiyat ve stok bilgisini düzenli tutar.",
    who: "Kurulum yapan kişi veya ürün/fiyat güncelleyen yetkili.",
    when: "Yeni ürün geldiğinde, fiyat değiştiğinde veya stok sayımı yapılırken.",
    steps: ["Ürünler ekranını aç", "Yeni ürün ekle", "Barkod ve fiyat gir", "Stok miktarını kaydet"],
    mistake: "Aynı barkodu iki farklı ürüne yazmak.",
    tip: "İlk gün en çok satılan 10 ürünle başlayın, sonra listeyi büyütün.",
  },
  {
    title: "Günlük Kasa",
    icon: WalletCards,
    use: "Gün içindeki satış tutarı, sorgu sayısı ve kasa hareketini özetler.",
    who: "İşletme sahibi ve gün sonu kontrolü yapan çalışan.",
    when: "Gün sonunda, vardiya değişiminde veya kasa kontrolünde.",
    steps: ["Günlük Kasa ekranını aç", "Toplam kasa ve satış adedini kontrol et", "Son satışları incele"],
    mistake: "Satışları sisteme işlemeyip kasa raporunun eksik kalmasına neden olmak.",
    tip: "Gün sonu rutininizi kasa ekranını kontrol ederek kapatın.",
  },
  {
    title: "Stok Takibi",
    icon: PackagePlus,
    use: "Stok giriş-çıkışlarını ve minimum stok uyarılarını görünür yapar.",
    who: "Depo/raf takibi yapan kişi ve işletme sahibi.",
    when: "Ürün geldiğinde, satış sonrası stok düştüğünde veya sayım yapılırken.",
    steps: ["Stok Takibi ekranını aç", "Stok girişi yap", "Minimum stok seviyesini belirle"],
    mistake: "Yeni gelen ürünü stok girişine işlememek.",
    tip: "Hızlı dönen ürünlere daha yüksek minimum stok seviyesi verin.",
  },
  {
    title: "Veresiye Defteri",
    icon: CreditCard,
    use: "Müşteri borç, tahsilat ve kalan bakiye takibini dijital olarak yönetir.",
    who: "Bakkal, market, kırtasiye, petshop ve mahalle esnafı.",
    when: "Müşteriye borç yazıldığında veya tahsilat alındığında.",
    steps: ["Veresiye ekranını aç", "Müşteriyi seç veya ekle", "Borç kaydı oluştur", "Tahsilatta ödeme tamamla"],
    mistake: "Tahsilat alınıp sisteme işlenmezse kasa ve veresiye raporu uyuşmaz.",
    tip: "Tahsilatı aldığınız anda sisteme işleyin.",
  },
  {
    title: "Excel Toplu Aktarım",
    icon: FileSpreadsheet,
    use: "Çok sayıda ürünü tek tek girmeden sisteme ekler.",
    who: "Kurulum yapan kişi veya büyük ürün listesi olan işletme.",
    when: "İlk kurulumda veya tedarikçi listesi geldiğinde.",
    steps: ["Şablonu indir", "Barkod, ad, fiyat ve stok alanlarını doldur", "Toplu aktarım ekranından yükle"],
    mistake: "Fiyat veya barkod sütununu boş bırakmak.",
    tip: "Yüklemeden önce ilk 5 satırı kontrol edin.",
  },
  {
    title: "Fatura Fotoğrafı",
    icon: Camera,
    use: "Tedarikçi faturasının fotoğrafından ürün, adet ve fiyat bilgilerini çıkarmaya yardımcı olur.",
    who: "Ürün girişi yapan işletme sahibi veya çalışan.",
    when: "Tedarikçiden yeni ürün geldiğinde.",
    steps: ["Faturayı düz zeminde çek", "Gölgeyi azalt", "Fotoğrafı yükle", "Gelen ürünleri kontrol et"],
    mistake: "Bulanık veya yarım fatura fotoğrafı yüklemek.",
    tip: "Son onaydan önce ürün adını ve fiyatı mutlaka gözden geçirin.",
  },
  {
    title: "Lisans ve Ayarlar",
    icon: Settings,
    use: "İşletme bilgisi, ödeme tipi, stok uyarısı ve lisans durumunu yönetir.",
    who: "İşletme sahibi veya yetkili yönetici.",
    when: "İlk kurulumda, lisans yenilemede veya işletme bilgisi değiştiğinde.",
    steps: ["Ayarlar ekranını aç", "İşletme bilgilerini tamamla", "Lisans ve yetki bölümünü kontrol et"],
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
];

type SearchResult = {
  title: string;
  text: string;
  href: string;
  kind: string;
};

const searchIndex: SearchResult[] = [
  ...contents.map((item) => ({ title: item.label, text: "Rehber bölümü", href: item.href, kind: "Bölüm" })),
  ...scannerHelp.map((item) => ({ title: item.title, text: item.text, href: "#barkod", kind: "Barkod" })),
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
    kind: "Uyarı",
  })),
  ...faqs.map((faq) => ({ title: faq.q, text: faq.a, href: "#sss", kind: "SSS" })),
];

function VisualCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="help-visual">
      <div className="help-visual-top">
        <span />
        <span />
        <span />
      </div>
      <p className="help-visual-title">{title}</p>
      <div className="mt-4 grid gap-2">
        {lines.map((line, index) => (
          <div key={line} className="help-visual-row">
            <span>{index + 1}</span>
            <b>{line}</b>
          </div>
        ))}
      </div>
      <div className="help-arrow-marker" />
    </div>
  );
}

function AlertBox({
  tone,
  title,
  children,
}: {
  tone: "info" | "warning" | "success";
  title: string;
  children: ReactNode;
}) {
  const Icon = tone === "warning" ? AlertTriangle : tone === "success" ? CheckCircle2 : ShieldCheck;
  return (
    <div className={`help-alert help-alert-${tone}`}>
      <Icon size={18} />
      <div>
        <p>{title}</p>
        <span>{children}</span>
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
      const haystack = [module.title, module.use, module.who, module.when, module.mistake, module.tip, ...module.steps]
        .join(" ")
        .toLocaleLowerCase("tr-TR");
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return searchIndex
      .filter((item) => `${item.title} ${item.text} ${item.kind}`.toLocaleLowerCase("tr-TR").includes(normalizedQuery))
      .slice(0, 7);
  }, [normalizedQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="help-center-dark min-h-screen overflow-x-hidden text-[color:var(--color-text)]">
      <header className="help-topbar">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <BunekaMark size={28} className="shrink-0" />
            <BunekaWordmark className="whitespace-nowrap text-sm text-stone-100" />
          </Link>
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
            <Link href="/" className="help-nav-button">
              <Home size={14} /> Ana Menü
            </Link>
            <Link href="/app" className="help-nav-button">
              <LayoutDashboard size={14} /> Panele Dön
            </Link>
            <BunekaNedirButton />
            <ThemeToggle className="help-icon-button" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[260px_minmax(0,1fr)_240px]">
        <aside className="hidden xl:block">
          <div className="help-side sticky top-24">
            <p className="help-sidebar-label">Dokümantasyon</p>
            <nav className="mt-4 grid gap-1.5">
              {contents.map((item, index) => (
                <a key={item.href} href={item.href} className="help-sidebar-link">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="help-mini-callout mt-5">
              <BookOpenCheck size={18} />
              <p>İlk kez kuruyorsanız Hızlı Başlangıç akışından ilerleyin.</p>
            </div>
          </div>
        </aside>

        <article className="min-w-0 space-y-6">
          <section id="arama" className="help-hero">
            <div className="max-w-4xl">
              <Link href="/" className="help-breadcrumb">
                Ana sayfa / Kullanıcı rehberi
              </Link>
              <span className="help-kicker">
                <BookOpenCheck size={14} /> Buneka Yardım Merkezi
              </span>
              <h1>Kurulum, barkod okutma, satış, stok ve kasa rehberi</h1>
              <p>
                Buneka&apos;yı 15 dakika içinde kurun; fiyat sorgulama, sepetli satış, stok takibi, veresiye ve kasa
                kontrolünü aynı işletme diliyle yönetin.
              </p>
            </div>

            <div className="help-search-shell">
              <div className="relative">
                <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rehberde ara: barkod, stok, veresiye, Excel, lisans..."
                  className="help-search-input"
                />
                {normalizedQuery && (
                  <div className="help-search-results">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <a key={`${result.kind}-${result.title}`} href={result.href} onClick={() => setQuery("")}>
                          <span>{result.kind}</span>
                          <b>{result.title}</b>
                          <small>{result.text}</small>
                        </a>
                      ))
                    ) : (
                      <p>Sonuç bulunamadı. Barkod, stok, veresiye veya lisans gibi başka bir kelime deneyin.</p>
                    )}
                  </div>
                )}
              </div>
              <div className="grid gap-2 sm:grid-cols-4">
                <Link href="/login" className="help-action help-action-primary">
                  <LogIn size={16} /> Giriş yap
                </Link>
                <a
                  href={whatsappLink("Merhaba, Buneka Yardım Merkezi üzerinden destek almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="help-action help-action-success"
                >
                  <MessageCircle size={16} /> Destek al
                </a>
                <button type="button" onClick={handlePrint} className="help-action">
                  <Printer size={16} /> PDF kaydet
                </button>
                <a href="/buneka-urun-sablonu.csv" download className="help-action help-action-warning">
                  <Download size={16} /> Excel şablonu
                </a>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            {roles.map((role) => (
              <article key={role.title} className="help-topic-card">
                <role.icon size={24} />
                <h2>{role.title}</h2>
                <p>{role.text}</p>
              </article>
            ))}
          </section>

          <section id="hizli-baslangic" className="help-section grid gap-4 lg:grid-cols-[0.9fr_1.25fr]">
            <div>
              <span className="help-kicker help-kicker-amber">Hızlı Başlangıç</span>
              <h2>Satışa hazır hale gelin.</h2>
              <p>
                Yazılımı hiç bilmeyen kullanıcılar için en kısa akış: işletme bilgisi, ilk ürünler, barkod testi ve ilk
                satış kaydı.
              </p>
              <Link href="/app" className="help-start-button">
                Adım adım başla <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {quickSetup.map((step, index) => (
                <div key={step} className="help-step">
                  <span>{index + 1}</span>
                  <b>{step}</b>
                </div>
              ))}
            </div>
          </section>

          <section id="gunluk-akis" className="help-section">
            <div className="help-section-head">
              <div>
                <span className="help-kicker">Günlük Akış</span>
                <h2>Barkodu okut, fiyatı gör, satışını bil.</h2>
              </div>
              <AlertBox tone="info" title="Bilgi">
                Barkod okuyucu çoğu zaman klavye gibi çalışır. Kod alana yazılır ve Enter gönderir.
              </AlertBox>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {dailyFlow.map((step, index) => (
                <article key={step.title} className="help-flow-card">
                  <step.icon size={22} />
                  <span>0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="urun-ekleme" className="grid gap-4 lg:grid-cols-3">
            <VisualCard title="Ürün ekleme ekranı" lines={["Barkod", "Ürün adı", "Satış fiyatı", "Stok"]} />
            <VisualCard title="Günlük kasa raporu" lines={["Toplam kasa", "Satılan ürün", "Sorgu sayısı", "Son satışlar"]} />
            <VisualCard title="Fatura fotoğrafı akışı" lines={["Fotoğraf çek", "Ürünleri kontrol et", "Aktarımı onayla"]} />
          </section>

          <section id="barkod" className="help-section">
            <span className="help-kicker">Cihaz Kurulumu</span>
            <h2>Cihaz ve barkod okuyucu kurulumu</h2>
            <p>
              Küçük işletmeci için en kritik konu cihazın hemen çalışmasıdır. Önce Not Defteri testiyle cihazı
              doğrulayın, sonra Buneka fiyat ekranını açın.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {scannerHelp.map((item, index) => (
                <article key={item.title} className="help-doc-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="moduller" className="help-section">
            <div className="help-section-head">
              <div>
                <span className="help-kicker">Modül Rehberleri</span>
                <h2>Her modül ne işe yarar?</h2>
                <p>Kim kullanır, ne zaman kullanılır, hangi hata yapılmamalı ve pratik ipucu tek yerde.</p>
              </div>
              {normalizedQuery && <span className="help-result-pill">{filteredModules.length} sonuç</span>}
            </div>
            <div className="mt-5 grid gap-4">
              {filteredModules.map((module) => (
                <article key={module.title} className="help-module-card">
                  <div className="help-module-intro">
                    <module.icon size={25} />
                    <h3>{module.title}</h3>
                    <p>{module.use}</p>
                  </div>
                  <div className="help-module-grid">
                    <div>
                      <b>Kim kullanır?</b>
                      <p>{module.who}</p>
                    </div>
                    <div>
                      <b>Ne zaman?</b>
                      <p>{module.when}</p>
                    </div>
                    <div className="md:col-span-2">
                      <b>Adım adım</b>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {module.steps.map((step) => (
                          <span key={step}>{step}</span>
                        ))}
                      </div>
                    </div>
                    <AlertBox tone="warning" title="Sık hata">{module.mistake}</AlertBox>
                    <AlertBox tone="success" title="İpucu">{module.tip}</AlertBox>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="sorun-cozme" className="help-section">
            <span className="help-kicker help-kicker-red">Uyarılar</span>
            <h2>Sorun çözme merkezi</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {troubleshooting.map((item) => (
                <AlertBox key={item} tone="warning" title={item.split(":")[0] || "Kontrol"}>
                  {item.includes(":") ? item.split(":").slice(1).join(":").trim() : item}
                </AlertBox>
              ))}
            </div>
          </section>

          <section id="sss" className="help-section">
            <span className="help-kicker">SSS</span>
            <h2>Sık sorulan sorular</h2>
            <div className="mt-5 grid gap-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="help-faq group">
                  <summary>
                    <span><HelpCircle size={18} /> {faq.q}</span>
                    <b>+</b>
                  </summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="guven" className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
            <div className="help-section help-legal">
              <ShieldCheck size={24} />
              <h2>Önemli bilgilendirme</h2>
              <p>
                Buneka, resmi yazarkasa veya mali belge sistemi değildir. Küçük işletmelerin fiyat sorgulama, satış
                hafızası, stok takibi, veresiye ve operasyon düzeni için geliştirilmiş yardımcı bir işletme yönetim
                sistemidir.
              </p>
            </div>
            <div className="help-section">
              <ClipboardCheck size={24} className="text-emerald-300" />
              <h2>Destek almadan önce</h2>
              <ul className="mt-4 grid gap-2">
                {[
                  "İnternet bağlantınız var mı?",
                  "Barkod okuyucu Not Defteri'nde çalışıyor mu?",
                  "Ürün sisteme eklendi mi?",
                  "Fiyat alanı dolu mu?",
                  "Lisans durumunuz aktif mi?",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-semibold text-stone-300">
                    <CheckCircle2 size={16} className="text-emerald-300" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="destek" className="help-section help-support-section">
            <h2>Bu yazı yardımcı oldu mu?</h2>
            <p>Yanıtlar rehber içeriğini geliştirmek için kullanılır. Cevabı bulamadıysanız doğrudan destek alın.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="help-vote"><ThumbsUp size={16} /> Evet</button>
              <button type="button" className="help-vote"><ThumbsDown size={16} /> Hayır</button>
              <a
                href={whatsappLink("Merhaba, Buneka'da destek almak istiyorum. İşletme adım: ... Yaşadığım adım: ...")}
                target="_blank"
                rel="noopener noreferrer"
                className="help-start-button"
              >
                <MessageCircle size={17} /> Canlı destek
              </a>
            </div>
          </section>
        </article>

        <aside className="hidden xl:block">
          <div className="help-on-page sticky top-24">
            <p>Bu sayfada</p>
            <nav className="mt-3 grid gap-2">
              {contents.slice(0, 8).map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
            </nav>
            <div className="help-mini-callout mt-5">
              <MessageCircle size={18} />
              <p>Aradığınız cevabı bulamazsanız destek hattı ekranın sağ altında.</p>
            </div>
          </div>
        </aside>
      </div>

      <a
        href={whatsappLink("Merhaba, Buneka rehberinden yazıyorum. Destek almak istiyorum.")}
        target="_blank"
        rel="noopener noreferrer"
        className="help-floating-support"
        aria-label="Canlı destek"
      >
        <MessageCircle size={22} />
      </a>
    </main>
  );
}
