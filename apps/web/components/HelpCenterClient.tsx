"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogIn,
  MessageCircle,
  Printer,
  ScanLine,
  Search,
  ShieldCheck,
  ShoppingCart,
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

type GuideTopic = {
  id: string;
  label: string;
  icon: typeof ScanLine;
  summary: string;
  headings: { id: string; label: string }[];
  body: ReactNode;
};

const scannerSteps = [
  "Barkod okuyucuyu USB girişine takın.",
  "Not Defteri'ni açıp barkodu okutun.",
  "Kod yazılıyorsa Buneka Fiyat Gör ekranını açın.",
  "Ürünü okutun; fiyat geldiyse satış veya sepet seçimini yapın.",
];

const productSteps = [
  "Ürünler ekranından Yeni Ürün seçin.",
  "Barkod, ad, kategori, satış fiyatı ve stok bilgisini girin.",
  "İlk gün en çok satılan ürünleri girip listeyi sonra büyütün.",
  "Toplu ürün için Excel şablonu veya toplu ekleme akışını kullanın.",
];

const cashSteps = [
  "Satış varsa Satış Yap veya Sepete Ekle seçimini kullanın.",
  "Günlük Kasa ekranında toplam kasa, sorgu ve son satışları izleyin.",
  "Vardiya sonunda kasa ekranını kontrol ederek günü kapatın.",
];

const stockSteps = [
  "Stok Takibi ekranında giriş/çıkış hareketlerini izleyin.",
  "Minimum stok seviyesini belirleyin.",
  "Stok düşmeyen ürünlerde satışın sisteme işlendiğini kontrol edin.",
];

const searchIndex = [
  { topic: "quick", title: "Hızlı başlangıç", text: scannerSteps.join(" ") },
  { topic: "barcode", title: "Barkod okuyucu kurulumu", text: scannerSteps.join(" ") },
  { topic: "products", title: "Ürün ekleme ve Excel", text: productSteps.join(" ") },
  { topic: "sales", title: "Satış ve günlük kasa", text: cashSteps.join(" ") },
  { topic: "stock", title: "Stok ve veresiye", text: stockSteps.join(" ") },
  { topic: "support", title: "Sorun çözme ve destek", text: "ürün bulunmuyor fiyat görünmüyor lisans destek whatsapp" },
];

function StepList({ items }: { items: string[] }) {
  return (
    <div className="guide-step-list">
      {items.map((item, index) => (
        <div key={item} className="guide-step-item">
          <span>{index + 1}</span>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}

function InfoCard({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "amber" | "danger";
  title: string;
  children: ReactNode;
}) {
  const Icon = tone === "danger" ? AlertTriangle : tone === "amber" ? HelpCircle : CheckCircle2;
  return (
    <div className={`guide-info guide-info-${tone}`}>
      <Icon size={18} />
      <div>
        <b>{title}</b>
        <p>{children}</p>
      </div>
    </div>
  );
}

function MetricDemo() {
  return (
    <div className="guide-screen-demo">
      <div className="guide-demo-header">
        <span />
        <span />
        <span />
      </div>
      <div className="guide-demo-input">
        <ScanLine size={18} />
        <b>Barkod okutun...</b>
      </div>
      <div className="guide-demo-product">
        <small>İÇECEK</small>
        <strong>Örnek Su 500ml</strong>
        <em>₺24,68</em>
      </div>
      <div className="guide-demo-actions">
        <span>Satış Yap</span>
        <span>Sepete Ekle</span>
        <span>Satış Yok</span>
      </div>
    </div>
  );
}

const topics: GuideTopic[] = [
  {
    id: "quick",
    label: "Hızlı başlangıç",
    icon: BookOpenCheck,
    summary: "İlk kurulumdan ilk satış kaydına kadar en kısa yol.",
    headings: [
      { id: "ilk-kurulum", label: "İlk kurulum" },
      { id: "ilk-satis", label: "İlk satış" },
      { id: "kontrol", label: "Kontrol listesi" },
    ],
    body: (
      <>
        <section id="ilk-kurulum" className="guide-panel">
          <h2>15 dakikada satışa hazır hale gelin.</h2>
          <p>İşletme bilgisi, ilk ürünler ve barkod testi tamamlandığında Buneka günlük kullanıma hazır olur.</p>
          <StepList items={["İşletme bilgilerini tamamla", "İlk 10 ürünü ekle", "Barkod okuyucuyu test et", "Fiyat Gör ekranını aç"]} />
        </section>
        <section id="ilk-satis" className="guide-panel guide-split">
          <div>
            <h2>İlk satış akışı</h2>
            <p>Barkodu okutun, fiyatı görün, satış olduysa kasaya işleyin. Çoklu ürünlerde Sepete Ekle kullanılır.</p>
            <StepList items={cashSteps} />
          </div>
          <MetricDemo />
        </section>
        <section id="kontrol" className="guide-panel guide-grid">
          <InfoCard title="Barkod testi">Kod Not Defteri içinde yazılıyorsa okuyucu çalışıyor demektir.</InfoCard>
          <InfoCard tone="amber" title="Fiyat kontrolü">Satış fiyatı boşsa Fiyat Gör ekranında ürün sonucu eksik kalır.</InfoCard>
          <InfoCard tone="danger" title="Sık hata">Satış gerçekleştiği halde Satış Yap seçilmezse kasa ve stok eksik görünür.</InfoCard>
        </section>
      </>
    ),
  },
  {
    id: "barcode",
    label: "Barkod okutma",
    icon: ScanLine,
    summary: "USB okuyucu, kamera ve manuel barkod girişi nasıl kullanılır?",
    headings: [
      { id: "cihaz", label: "Cihaz kurulumu" },
      { id: "test", label: "Not Defteri testi" },
      { id: "hatalar", label: "Okuma hataları" },
    ],
    body: (
      <>
        <section id="cihaz" className="guide-panel">
          <h2>Barkod okuyucu klavye gibi çalışır.</h2>
          <p>Bilgisayara bağlanan barkod okuyucu hediye olarak sunulur. USB ile bağlayın ve ekstra program kurmadan test edin.</p>
          <StepList items={scannerSteps} />
        </section>
        <section id="test" className="guide-panel guide-grid">
          <InfoCard title="Doğru test">Not Defteri açıkken imleci boş alana getirip barkodu okutun.</InfoCard>
          <InfoCard tone="amber" title="Enter göndermiyorsa">Cihazın kullanım kılavuzundaki Enter/CR suffix barkodunu okutun.</InfoCard>
        </section>
        <section id="hatalar" className="guide-panel">
          <h2>Ürün bulunmuyorsa</h2>
          <p>Barkod okunuyor ama ürün gelmiyorsa ürün henüz sisteme eklenmemiştir. Ürünler ekranından barkod, ad ve fiyatı kaydedin.</p>
        </section>
      </>
    ),
  },
  {
    id: "products",
    label: "Ürün yönetimi",
    icon: FileSpreadsheet,
    summary: "Ürün ekleme, toplu aktarım, fiyat güncelleme ve fatura fotoğrafı.",
    headings: [
      { id: "tek-urun", label: "Tek ürün" },
      { id: "toplu-urun", label: "Toplu aktarım" },
      { id: "fatura", label: "Fatura fotoğrafı" },
    ],
    body: (
      <>
        <section id="tek-urun" className="guide-panel">
          <h2>Ürün kartı raf hafızasıdır.</h2>
          <p>Barkod, ürün adı, kategori, alış fiyatı, satış fiyatı ve stok bilgisi bu ekranda tutulur.</p>
          <StepList items={productSteps} />
        </section>
        <section id="toplu-urun" className="guide-panel">
          <h2>Excel ile hızlı başlangıç</h2>
          <p>Çok ürünlü işletmelerde şablonu indirip zorunlu alanları doldurun. Yüklemeden önce ilk 5 satırı kontrol edin.</p>
          <a href="/buneka-urun-sablonu.csv" download className="guide-action">
            <Download size={16} /> Excel şablonu indir
          </a>
        </section>
        <section id="fatura" className="guide-panel guide-grid">
          <InfoCard title="Fatura fotoğrafı">Tedarikçi faturasının fotoğrafını çek; ürünler, adetler ve fiyatlar saniyeler içinde işlensin.</InfoCard>
          <InfoCard tone="amber" title="Onay şartı">Aktarım öncesi ürün adı, adet ve fiyatları mutlaka gözden geçirin.</InfoCard>
        </section>
      </>
    ),
  },
  {
    id: "sales",
    label: "Satış ve kasa",
    icon: WalletCards,
    summary: "Satış Yap, Satış Yok, sepet ve günlük kasa ekranı.",
    headings: [
      { id: "satis-yap", label: "Satış Yap" },
      { id: "sepet", label: "Sepet" },
      { id: "gunluk-kasa", label: "Günlük kasa" },
    ],
    body: (
      <>
        <section id="satis-yap" className="guide-panel">
          <h2>Satış varsa kasaya işleyin.</h2>
          <p>Satış Yap seçimi ürün satışını, kasa hareketini ve stok düşüşünü aynı akışta kaydeder.</p>
          <StepList items={cashSteps} />
        </section>
        <section id="sepet" className="guide-panel guide-grid">
          <InfoCard title="Çoklu ürün">Müşteri birden çok ürün alıyorsa her ürünü Sepete Ekle ile toplayın.</InfoCard>
          <InfoCard tone="amber" title="Fiş çıktısı">Sepet fişi A4 yerine 80 mm termal fiş düzeninde yazdırılır veya PDF olarak kaydedilir.</InfoCard>
        </section>
        <section id="gunluk-kasa" className="guide-panel">
          <h2>Gün sonunu tek panelden görün.</h2>
          <p>Toplam kasa, satılan ürün, sorgu sayısı ve son satışlar günlük kasa ekranında takip edilir.</p>
        </section>
      </>
    ),
  },
  {
    id: "stock",
    label: "Stok ve veresiye",
    icon: ShoppingCart,
    summary: "Stok girişleri, minimum stok ve müşteri borç takibi.",
    headings: [
      { id: "stok", label: "Stok takibi" },
      { id: "veresiye", label: "Veresiye" },
      { id: "lisans", label: "Lisans" },
    ],
    body: (
      <>
        <section id="stok" className="guide-panel">
          <h2>Stok hareketini satıştan ayırın.</h2>
          <p>Ürünler ekranı ürün kartlarını yönetir; Stok Takibi ekranı giriş/çıkış hareketlerini izlemek içindir.</p>
          <StepList items={stockSteps} />
        </section>
        <section id="veresiye" className="guide-panel">
          <h2>Borç ve tahsilatı ayrı kaydedin.</h2>
          <p>İlk kayıt borç olarak açılır. Tahsilat alındığında ödeme tamamla akışıyla bakiye kapatılır.</p>
        </section>
        <section id="lisans" className="guide-panel guide-grid">
          <InfoCard title="Yetki">Lisans ve kullanıcı yetkilerini Ayarlar ekranından kontrol edin.</InfoCard>
          <InfoCard tone="amber" title="Süre">Lisans bitiş tarihini düzenli takip edin.</InfoCard>
        </section>
      </>
    ),
  },
  {
    id: "support",
    label: "Sorun çözme",
    icon: Wrench,
    summary: "Sık hatalar, güven notu ve destek köprüsü.",
    headings: [
      { id: "sik-hatalar", label: "Sık hatalar" },
      { id: "guven", label: "Güven notu" },
      { id: "destek", label: "Destek" },
    ],
    body: (
      <>
        <section id="sik-hatalar" className="guide-panel guide-grid">
          <InfoCard tone="danger" title="Ürün bulunmuyor">Ürün sisteme eklenmemiş veya barkod farklı yazılmış olabilir.</InfoCard>
          <InfoCard tone="danger" title="Stok düşmüyor">Satış Yap veya Sepeti Satışa Çevir akışının tamamlandığını kontrol edin.</InfoCard>
          <InfoCard tone="amber" title="Excel yüklenmiyor">Şablon başlıklarını değiştirmeyin ve zorunlu alanları boş bırakmayın.</InfoCard>
          <InfoCard title="Lisans görünmüyor">Ayarlar ekranından lisans durumunu ve kullanıcı yetkisini kontrol edin.</InfoCard>
        </section>
        <section id="guven" className="guide-panel">
          <h2>Buneka mali belge sistemi değildir.</h2>
          <p>Buneka resmi yazarkasa veya mali belge sistemi yerine geçmez; küçük işletmenin fiyat, satış, stok ve operasyon hafızasını düzenler.</p>
        </section>
        <section id="destek" className="guide-panel">
          <h2>Aradığınız cevabı bulamadıysanız</h2>
          <p>Destek hattına işletme adınızı, yaşadığınız ekranı ve mümkünse ekran görüntüsünü gönderin.</p>
          <a
            href={whatsappLink("Merhaba, Buneka rehberinden destek almak istiyorum. İşletme adım: ... Yaşadığım ekran: ...")}
            target="_blank"
            rel="noopener noreferrer"
            className="guide-action guide-action-support"
          >
            <MessageCircle size={16} /> Destek al
          </a>
        </section>
      </>
    ),
  },
];

export function HelpCenterClient() {
  const [activeTopicId, setActiveTopicId] = useState(topics[0].id);
  const [query, setQuery] = useState("");
  const activeTopic = topics.find((topic) => topic.id === activeTopicId) || topics[0];
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return searchIndex
      .filter((item) => `${item.title} ${item.text}`.toLocaleLowerCase("tr-TR").includes(normalizedQuery))
      .slice(0, 6);
  }, [normalizedQuery]);

  function handlePrint() {
    window.print();
  }

  return (
    <main className="guide-shell min-h-screen overflow-x-hidden">
      <header className="guide-topbar">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <BunekaMark size={28} className="shrink-0" />
            <BunekaWordmark className="whitespace-nowrap text-sm text-stone-100" />
          </Link>
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
            <Link href="/" className="guide-nav-button">
              <Home size={14} /> Ana Menü
            </Link>
            <Link href="/app" className="guide-nav-button">
              <LayoutDashboard size={14} /> Panele Dön
            </Link>
            <BunekaNedirButton />
            <ThemeToggle className="guide-icon-button" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[285px_minmax(0,1fr)]">
        <aside className="guide-sidebar">
          <p className="guide-sidebar-label">Konu başlıkları</p>
          <div className="mt-3 grid gap-2">
            {topics.map((topic) => {
              const Icon = topic.icon;
              const isActive = topic.id === activeTopic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`guide-topic-button ${isActive ? "guide-topic-button-active" : ""}`}
                >
                  <Icon size={18} />
                  <span>
                    <b>{topic.label}</b>
                    <small>{topic.summary}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="min-w-0 space-y-5">
          <section className="guide-hero">
            <span className="guide-kicker">
              <BookOpenCheck size={14} /> Buneka Kullanıcı Rehberi
            </span>
            <div className="guide-hero-grid">
              <div>
                <h1>{activeTopic.label}</h1>
                <p>{activeTopic.summary}</p>
              </div>
              <div className="guide-search-area">
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-300" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rehberde ara: barkod, stok, veresiye, Excel, lisans..."
                    className="guide-search-input"
                  />
                  {normalizedQuery && (
                    <div className="guide-search-results">
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <button
                            key={result.topic}
                            type="button"
                            onClick={() => {
                              setActiveTopicId(result.topic);
                              setQuery("");
                            }}
                          >
                            <b>{result.title}</b>
                            <small>{result.text}</small>
                          </button>
                        ))
                      ) : (
                        <p>Sonuç bulunamadı. Daha kısa bir kelime deneyin.</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="guide-quick-actions">
                  <Link href="/login" className="guide-action guide-action-primary">
                    <LogIn size={16} /> Giriş yap
                  </Link>
                  <button type="button" onClick={handlePrint} className="guide-action">
                    <Printer size={16} /> PDF kaydet
                  </button>
                  <a href="/buneka-urun-sablonu.csv" download className="guide-action">
                    <Download size={16} /> Excel şablonu
                  </a>
                </div>
              </div>
            </div>
          </section>

          <nav className="guide-heading-tabs" aria-label="Sayfa içi başlıklar">
            {activeTopic.headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`}>
                {heading.label}
              </a>
            ))}
          </nav>

          <div className="guide-content">{activeTopic.body}</div>

          <section className="guide-footer-note">
            <ShieldCheck size={18} />
            <p>
              Cevabı bulamadıysanız sağdaki destek butonundan yazın. Ekran adı ve işlem adımını gönderirseniz daha hızlı
              çözüm üretiriz.
            </p>
            <a
              href={whatsappLink("Merhaba, Buneka rehberinden destek almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Destek al <ArrowRight size={14} />
            </a>
          </section>
        </article>
      </div>
    </main>
  );
}
