import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Barcode,
  Boxes,
  Building2,
  Calculator,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleHelp,
  MonitorSmartphone,
  PackagePlus,
  ScanBarcode,
  ShieldCheck,
  Store,
  WalletCards
} from "lucide-react";

const plans = [
  {
    name: "Buneka Fiyat",
    price: "6.000 TL",
    launch: "5.000 TL",
    summary: "Barkodla fiyat sorgulama.",
    features: ["Fiyat sorgulama", "Ürün ekleme", "Basit rapor"]
  },
  {
    name: "Buneka Kasa",
    price: "9.000 TL",
    launch: "7.500 TL",
    summary: "Fiyat sorgulama, satış kaydı ve günlük kasa.",
    features: ["Satış Yapıldı", "Günlük kasa", "Sorgu raporu"]
  },
  {
    name: "Buneka Stok",
    price: "15.000 TL",
    launch: "12.000 TL",
    summary: "Fiyat, kasa, stok takibi ve stok uyarısı.",
    features: ["Stokta kalan", "Minimum stok", "Kâr detayı"]
  },
  {
    name: "Buneka Patron",
    price: "24.000 TL",
    launch: "18.000 TL",
    summary: "Gelişmiş rapor, mobil patron ekranı ve SERENIS notu.",
    features: ["SERENIS notu", "Kampanya", "Çoklu cihaz"]
  }
];

const modules = [
  "Son kullanma tarihi",
  "Raf etiketi",
  "Veresiye defteri",
  "Çoklu cihaz",
  "Excel ürün aktarımı",
  "Bulut yedekleme",
  "Giyim varyantı",
  "Petshop uyarısı"
];

const faqs = [
  {
    question: "Buneka muhasebe programı mı?",
    answer: "Hayır. Buneka küçük işletmenin fiyat, kasa ve stok hafızasıdır."
  },
  {
    question: "Aylık ödeme var mı?",
    answer: "Hayır. Paketler yıllık lisansla açılır."
  },
  {
    question: "Telefonla başlanır mı?",
    answer: "Evet. Telefonla başlar, barkod okuyucuyla hızlanır."
  }
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Buneka ana sayfa">
          <span className="brand-mark">
            <Barcode size={20} aria-hidden="true" />
          </span>
          <span>Buneka</span>
        </Link>
        <nav className="nav-links" aria-label="Ana menü">
          <a href="#nedir">Nedir?</a>
          <a href="#paketler">Paketler</a>
          <a href="#moduller">Modüller</a>
          <a href="#sss">SSS</a>
        </nav>
        <div className="header-actions">
          <Link className="button button-secondary" href="/login">
            <ShieldCheck size={18} aria-hidden="true" />
            Giriş
          </Link>
          <Link className="button button-primary" href="/demo">
            <ScanBarcode size={18} aria-hidden="true" />
            Demo Paneli Aç
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Yıllık lisanslı küçük işletme SaaS</p>
          <h1>Buneka</h1>
          <p className="hero-copy">
            Barkodu okut, fiyatı gör, satışını bil. Karmaşık POS değil; küçük
            işletmenin sade fiyat, kasa ve stok hafızası.
          </p>
          <div className="hero-actions">
            <Link className="button button-amber" href="/demo">
              <ScanBarcode size={20} aria-hidden="true" />
              Bu ne kadar?
            </Link>
            <a className="button button-secondary" href="#paketler">
              <ArrowRight size={20} aria-hidden="true" />
              Paketleri Gör
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="nedir">
        <div className="section-header">
          <div>
            <h2>Kasa ekranı gibi hızlı, işletme hafızası gibi kalıcı.</h2>
            <p>
              Her barkod okutma fiyat sorgusu olarak kaydedilir. Satış
              gerçekleşirse tek dokunuşla kasaya ve rapora dönüşür.
            </p>
          </div>
        </div>
        <div className="grid grid-3">
          <article className="card feature-card">
            <ScanBarcode size={30} aria-hidden="true" />
            <h3>Fiyat sorgulama</h3>
            <p>Barkodu okut veya yaz. Ürün kayıtlıysa fiyat hemen görünür.</p>
          </article>
          <article className="card feature-card">
            <WalletCards size={30} aria-hidden="true" />
            <h3>Günlük kasa</h3>
            <p>Satış Yapıldı seçildiğinde günlük kasa akışı oluşur.</p>
          </article>
          <article className="card feature-card">
            <Boxes size={30} aria-hidden="true" />
            <h3>Stok hafızası</h3>
            <p>Stok paketi açıksa satıştan sonra stok düşer ve uyarı oluşur.</p>
          </article>
        </div>
      </section>

      <section className="section alt">
        <div className="section-header">
          <div>
            <h2>Bakkal, kırtasiye, petshop, kozmetik ve küçük mağazalar için.</h2>
            <p>
              Telefonla başla, barkod okuyucuyla hızlan. İhtiyaç büyüdükçe
              modül aç.
            </p>
          </div>
        </div>
        <div className="grid grid-4">
          {[
            ["Bakkal", Store],
            ["Kırtasiye", PackagePlus],
            ["Petshop", BadgeCheck],
            ["Kozmetik", Building2]
          ].map(([label, Icon]) => (
            <article className="card feature-card" key={String(label)}>
              <Icon size={28} aria-hidden="true" />
              <h3>{String(label)}</h3>
              <p>Fiyat, kasa ve stok takibini sade tutar.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="paketler">
        <div className="section-header">
          <div>
            <h2>Yıllık lisans paketleri</h2>
            <p>İlk 100 işletme için erken kullanım lisansı uygulanır.</p>
          </div>
        </div>
        <div className="grid grid-4">
          {plans.map((plan) => (
            <article className="card plan-card" key={plan.name}>
              <h3>{plan.name}</h3>
              <p>{plan.summary}</p>
              <div className="price">{plan.price}</div>
              <p>Erken kullanım: {plan.launch}</p>
              <div className="tag-row">
                {plan.features.map((feature) => (
                  <span className="tag" key={feature}>
                    {feature}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="section-header">
          <div>
            <h2>Demo panel hazır.</h2>
            <p>
              Örnek ürünlerle barkod gir, fiyatı gör, Satış Yapıldı akışını
              dene.
            </p>
          </div>
          <Link className="button button-primary" href="/demo">
            <MonitorSmartphone size={20} aria-hidden="true" />
            Demo Paneli Aç
          </Link>
        </div>
        <Image
          src="/images/buneka-hero-counter.png"
          alt="Buneka barkod ve fiyat sorgulama ekranı"
          width={1400}
          height={900}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: 460,
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid var(--border)"
          }}
          priority
        />
      </section>

      <section className="section" id="moduller">
        <div className="section-header">
          <div>
            <h2>İş büyüdükçe modül aç.</h2>
            <p>Ek modüller yıllık lisansla eklenir; ana paket zorlanmaz.</p>
          </div>
        </div>
        <div className="grid grid-4">
          {modules.map((module) => (
            <article className="card module-card" key={module}>
              <CheckCircle2 size={22} color="var(--green)" aria-hidden="true" />
              <h3>{module}</h3>
              <p>Yıllık modül olarak açılır.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt" id="sss">
        <div className="section-header">
          <div>
            <h2>Sık sorulan sorular</h2>
          </div>
        </div>
        <div className="grid grid-3">
          {faqs.map((item) => (
            <article className="card feature-card" key={item.question}>
              <CircleHelp size={26} aria-hidden="true" />
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Kurulum sırası net.</h2>
            <p>
              Önce çalışan çekirdek. Sonra lisans sistemi. Sonra admin panel.
              Sonra modüller.
            </p>
          </div>
          <Link className="button button-primary" href="/demo">
            <Calculator size={20} aria-hidden="true" />
            Hemen Dene
          </Link>
        </div>
        <div className="grid grid-3">
          <article className="card metric-card">
            <ChartNoAxesCombined size={28} aria-hidden="true" />
            <h3>Fiyat ilgisi</h3>
            <p>Satışa dönmeyen sorgular da işletme hafızasına girer.</p>
          </article>
          <article className="card metric-card">
            <WalletCards size={28} aria-hidden="true" />
            <h3>Satış kaydı</h3>
            <p>Satış Yapıldı seçimi kasa ve rapor akışını başlatır.</p>
          </article>
          <article className="card metric-card">
            <Boxes size={28} aria-hidden="true" />
            <h3>Stok takibi</h3>
            <p>Stok paketi açıksa kalan miktar görünür.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
