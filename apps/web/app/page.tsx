import Link from "next/link";
import {
  ArrowRight,
  Barcode,
  Bluetooth,
  Boxes,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Eye,
  Mail,
  ScanBarcode,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  WalletCards,
  Zap,
} from "lucide-react";

/* ───────────────────────────────────────── data ── */

const questions = [
  {
    icon: ScanBarcode,
    title: "Bu ürün kaç para?",
    desc: "Barkodu okutun, fiyatı anında görün.",
  },
  {
    icon: WalletCards,
    title: "Bugün ne kadar satış yaptım?",
    desc: "Günlük kasa toplamınız her zaman elinizin altında.",
  },
  {
    icon: TrendingUp,
    title: "En çok hangi ürün sorgulandı?",
    desc: "Hangi ürünün fiyatı en çok soruluyor, hemen görün.",
  },
  {
    icon: Boxes,
    title: "Stokta ne kaldı?",
    desc: "Azalan stoklar için uyarı alın, eksik kalma.",
  },
  {
    icon: Calculator,
    title: "Kasada bugün ne var?",
    desc: "Gün sonu kasanızı tek bakışta kontrol edin.",
  },
  {
    icon: ShieldCheck,
    title: "Lisansım ne zaman bitiyor?",
    desc: "Lisans durumunuz her zaman şeffaf ve takip edilebilir.",
  },
];

const plans = [
  {
    name: "Buneka Fiyat",
    price: "6.000 TL",
    period: "/ yıl",
    desc: "Fiyat sorgulama",
    features: ["Barkod okutma", "Fiyat gösterme", "Basit rapor"],
    highlighted: false,
  },
  {
    name: "Buneka Kasa",
    price: "9.000 TL",
    period: "/ yıl",
    desc: "Fiyat + satış + günlük kasa",
    features: ["Satış kaydı", "Günlük kasa", "Sorgu raporu"],
    highlighted: true,
  },
  {
    name: "Buneka Stok",
    price: "15.000 TL",
    period: "/ yıl",
    desc: "Fiyat + kasa + stok",
    features: ["Stok takibi", "Min. stok uyarısı", "Kâr detayı"],
    highlighted: false,
  },
  {
    name: "Buneka Patron",
    price: "24.000 TL",
    period: "/ yıl",
    desc: "Gelişmiş rapor + yönetim",
    features: ["SERENIS notu", "Çoklu cihaz", "Patron paneli"],
    highlighted: false,
  },
];

const devices = [
  {
    icon: Smartphone,
    title: "Telefon Kamerası",
    desc: "Demo ve hızlı başlangıç için.",
  },
  {
    icon: ScanBarcode,
    title: "USB Barkod Okuyucu",
    desc: "Sabit kasa noktası için en pratik çözüm.",
  },
  {
    icon: Bluetooth,
    title: "Bluetooth Barkod Okuyucu",
    desc: "Tablet ve mobil kullanım için.",
  },
];

const modules = [
  "Son kullanma tarihi",
  "Raf etiketi",
  "Cari müşteri",
  "Çoklu cihaz",
  "Çok şube",
  "SERENIS işletme notu",
  "Giyim beden renk",
  "Petshop tekrar alım",
  "Kırtasiye sezonu",
  "Hırdavat birim takibi",
];

/* ───────────────────────────────────────── page ── */

export default function HomePage() {
  return (
    <main
      className="min-h-screen text-[#20231F] selection:bg-[#4F6F52] selection:text-white font-sans overflow-x-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 10%, rgba(200,145,58,0.14), transparent 28%),
          radial-gradient(circle at 80% 20%, rgba(79,111,82,0.18), transparent 32%),
          linear-gradient(180deg, #F7F4ED 0%, #EFE8DC 100%)
        `,
      }}
    >
      {/* ════════════════════════════════════ 1. HEADER ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#F7F4ED]/80 border-b border-[#E4DED2]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F6F52] text-white shadow-md group-hover:scale-105 transition-transform">
              <Barcode size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#20231F]">
              Buneka
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#667064]">
            <a
              href="#sorular"
              className="hover:text-[#4F6F52] transition-colors"
            >
              Ana Fikir
            </a>
            <a
              href="#paketler"
              className="hover:text-[#4F6F52] transition-colors"
            >
              Paketler
            </a>
            <a href="#demo" className="hover:text-[#4F6F52] transition-colors">
              Demo
            </a>
            <a href="#sss" className="hover:text-[#4F6F52] transition-colors">
              S.S.S
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-[#4F6F52] hover:bg-[#4F6F52]/5 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C8913A] shadow-md shadow-[#C8913A]/25 hover:bg-[#b5802f] hover:shadow-lg transition-all"
            >
              Demo Paneli Aç
            </Link>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════ 2. HERO ═══ */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#20231F] leading-[1.1] mb-6">
              Barkodu okut,
              <br />
              fiyatı gör,
              <br />
              <span className="text-[#4F6F52]">satışını bil.</span>
            </h1>

            <p className="text-lg text-[#667064] leading-relaxed max-w-xl mb-6">
              Buneka, küçük işletmeler için yıllık lisanslı fiyat sorgulama,
              kasa ve stok takip sistemidir. Telefonla denenir, barkod
              okuyucuyla hızlanır, gereksiz karmaşa çıkarmaz.
            </p>

            {/* Micro trust */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#4F6F52] mb-8">
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-[#C8913A]" />
                Kurulumsuz başlar.
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone size={14} className="text-[#C8913A]" />
                Telefonda çalışır.
              </span>
              <span className="flex items-center gap-1.5">
                <ScanBarcode size={14} className="text-[#C8913A]" />
                Barkod cihazıyla hızlanır.
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-[#C8913A] shadow-lg shadow-[#C8913A]/25 hover:bg-[#b5802f] hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Demo Paneli Aç
                <ArrowRight size={18} />
              </Link>
              <a
                href="#paketler"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-[#4F6F52] bg-white border border-[#4F6F52]/20 hover:bg-[#F7F4ED] hover:-translate-y-0.5 transition-all"
              >
                Paketleri İncele
              </a>
            </div>
          </div>

          {/* Right — phone mockup (desktop only) */}
          <div className="order-1 lg:order-2 hidden lg:flex justify-center relative">
            {/* Phone frame */}
            <div className="relative w-[280px] rounded-[2.5rem] border-2 border-[#E4DED2] bg-white shadow-2xl shadow-[#20231F]/10 overflow-hidden">
              {/* Notch */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-24 h-5 bg-[#20231F] rounded-full" />
              </div>

              {/* Screen content */}
              <div className="px-4 pb-6 space-y-4">
                <h3 className="text-center text-lg font-bold text-[#20231F]">
                  Bu ne kadar?
                </h3>

                {/* Fake barcode input */}
                <div className="flex items-center gap-2 rounded-xl border border-[#E4DED2] bg-[#F7F4ED] px-3 py-2.5 text-sm text-[#667064]">
                  <ScanBarcode size={16} className="text-[#4F6F52]" />
                  <span>Barkod okutun...</span>
                </div>

                {/* Product card */}
                <div className="rounded-xl border border-[#E4DED2] bg-[#F7F4ED] p-4">
                  <p className="font-bold text-[#20231F] text-sm mb-1">
                    Su 500ml
                  </p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-[#4F6F52]">
                      ₺12,00
                    </span>
                    <span className="text-xs font-medium text-[#667064]">
                      Stok: 48
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <div className="w-full py-2.5 rounded-xl bg-[#3F7D53] text-white text-sm font-bold text-center">
                    Satış Yapıldı
                  </div>
                  <div className="w-full py-2.5 rounded-xl bg-white border border-[#E4DED2] text-[#20231F] text-sm font-bold text-center">
                    Ana Ekrana Dön
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-2">
                <div className="w-32 h-1 bg-[#20231F]/20 rounded-full" />
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -left-12 top-12 rounded-2xl bg-white border border-[#E4DED2] shadow-lg px-4 py-3 text-center">
              <p className="text-xs font-medium text-[#667064]">Günlük kasa</p>
              <p className="text-lg font-extrabold text-[#4F6F52]">₺8.420</p>
            </div>

            <div className="absolute -right-8 top-28 rounded-2xl bg-white border border-[#E4DED2] shadow-lg px-4 py-3 text-center">
              <p className="text-xs font-medium text-[#667064]">
                Fiyat sorgusu
              </p>
              <p className="text-lg font-extrabold text-[#C8913A]">126</p>
            </div>

            <div className="absolute -left-6 bottom-32 rounded-2xl bg-white border border-[#E4DED2] shadow-lg px-4 py-3 text-center">
              <p className="text-xs font-medium text-[#667064]">Satış</p>
              <p className="text-lg font-extrabold text-[#4F6F52]">42</p>
            </div>

            <div className="absolute -right-14 bottom-16 rounded-2xl bg-white border border-[#E4DED2] shadow-lg px-4 py-3 text-center">
              <p className="text-xs font-medium text-[#667064]">
                Stok uyarısı
              </p>
              <p className="text-lg font-extrabold text-[#B65A3C]">5 ürün</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ 3. DÜKKAN SAHİBİNİN SORULARI ═══ */}
      <section
        id="sorular"
        className="py-24 bg-[#EFE8DC]/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20231F] mb-4 max-w-2xl mx-auto leading-snug">
              Dükkan sahibinin kafasındaki soruları Buneka cevaplar.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E4DED2] p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-full bg-[#4F6F52]/10 flex items-center justify-center mb-5">
                  <q.icon size={22} className="text-[#4F6F52]" />
                </div>
                <h3 className="text-lg font-bold text-[#20231F] mb-2">
                  {q.title}
                </h3>
                <p className="text-sm text-[#667064] leading-relaxed">
                  {q.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ 4. ÜÇ ADIMDA KULLANIM ═══ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20231F] mb-4">
              Üç adımda çalışır.
            </h2>
          </div>

          {/* Steps */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line — desktop horizontal */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-[#E4DED2]" />
            {/* Connecting line — mobile vertical */}
            <div className="md:hidden absolute top-0 bottom-0 left-8 w-0.5 bg-[#E4DED2]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
              {[
                {
                  num: "1",
                  icon: ScanBarcode,
                  title: "Barkodu okut",
                  desc: "Telefon kamerasıyla veya barkod okuyucuyla ürünü taratın.",
                },
                {
                  num: "2",
                  icon: Eye,
                  title: "Fiyatı gör",
                  desc: "Ürünün fiyatı ve stok bilgisi anında ekranda belirir.",
                },
                {
                  num: "3",
                  icon: CheckCircle2,
                  title: "Satış olursa Satış Yapıldı de",
                  desc: "Satış gerçekleşirse tek tuşla kaydedin.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex md:flex-col items-start md:items-center gap-6 md:gap-0 pl-16 md:pl-0 relative"
                >
                  {/* Number circle */}
                  <div className="absolute left-2 md:static flex-shrink-0 h-14 w-14 rounded-full bg-[#4F6F52] text-white flex items-center justify-center text-xl font-extrabold shadow-lg shadow-[#4F6F52]/20 z-10">
                    {step.num}
                  </div>

                  <div className="md:mt-6 md:text-center">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#4F6F52]/10 mb-3">
                      <step.icon size={20} className="text-[#4F6F52]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#20231F] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#667064] leading-relaxed max-w-xs">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Small note */}
          <p className="text-center text-sm text-[#667064] mt-12 max-w-md mx-auto">
            Satış yapılmayacaksa sadece{" "}
            <span className="font-semibold text-[#20231F]">
              Ana Ekrana Dön
            </span>
            .
          </p>
        </div>
      </section>

      {/* ════════════════════════ 5. PAKETLER ═══ */}
      <section id="paketler" className="py-24 bg-[#EFE8DC]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20231F] mb-4 max-w-2xl mx-auto leading-snug">
              İhtiyacın kadar kullan.
              <br className="hidden sm:block" /> İşin büyüdükçe modül aç.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  plan.highlighted
                    ? "bg-white border-[#C8913A] shadow-xl shadow-[#C8913A]/10 scale-[1.03] z-10"
                    : "bg-white border-[#E4DED2] shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#C8913A] px-4 py-1 text-xs font-bold text-white shadow-md">
                    En çok tercih edilen
                  </div>
                )}

                <h3 className="text-xl font-bold text-[#20231F] mb-1 mt-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#667064] mb-5">{plan.desc}</p>

                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-[#20231F]">
                    {plan.price}
                  </span>
                  <span className="text-sm font-medium text-[#667064] ml-1">
                    {plan.period}
                  </span>
                </div>

                <ul className="flex-1 space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-[#20231F]"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-[#3F7D53] flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="#demo"
                  className={`block w-full py-3 rounded-xl text-center text-sm font-bold transition-all ${
                    plan.highlighted
                      ? "bg-[#C8913A] text-white hover:bg-[#b5802f] shadow-md"
                      : "bg-[#4F6F52]/10 text-[#4F6F52] hover:bg-[#4F6F52] hover:text-white"
                  }`}
                >
                  Detaylı Bilgi
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ 6. DEMO PANEL ═══ */}
      <section id="demo" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20231F] mb-4">
              Telefondan hemen deneyin.
            </h2>
            <p className="text-lg text-[#667064] leading-relaxed mb-10 max-w-xl mx-auto">
              Demo paneli açın, örnek ürünleri yükleyin, barkodu okutun ve
              Buneka&apos;nın nasıl çalıştığını görün.
            </p>

            {/* Demo preview card */}
            <div className="mx-auto max-w-sm rounded-3xl border border-[#E4DED2] bg-white shadow-xl overflow-hidden mb-10">
              <div className="bg-[#4F6F52] px-6 py-4 text-white text-left">
                <p className="text-xs font-medium opacity-70">Buneka Demo</p>
                <p className="text-lg font-bold">Demo Paneli</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-[#E4DED2] bg-[#F7F4ED] p-3">
                  <ScanBarcode size={18} className="text-[#4F6F52]" />
                  <span className="text-sm text-[#667064]">
                    Barkod okutun veya arayın...
                  </span>
                </div>
                <div className="rounded-xl bg-[#F7F4ED] p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#20231F]">
                      Kalem Mavi
                    </span>
                    <span className="text-sm font-extrabold text-[#4F6F52]">
                      ₺18,50
                    </span>
                  </div>
                  <span className="text-xs text-[#667064]">Stok: 120</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 py-2 rounded-lg bg-[#3F7D53] text-white text-xs font-bold text-center">
                    Satış Yapıldı
                  </div>
                  <div className="flex-1 py-2 rounded-lg border border-[#E4DED2] text-[#20231F] text-xs font-bold text-center">
                    Ana Ekrana Dön
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl text-lg font-bold text-white bg-[#C8913A] shadow-lg shadow-[#C8913A]/25 hover:bg-[#b5802f] hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Demo Paneli Aç
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════ 7. CİHAZLAR ═══ */}
      <section className="py-24 bg-[#EFE8DC]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20231F] mb-4">
              Telefonla başla, barkod okuyucuyla hızlan.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {devices.map((d, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E4DED2] p-6 text-center shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="mx-auto h-14 w-14 rounded-full bg-[#4F6F52]/10 flex items-center justify-center mb-5">
                  <d.icon size={24} className="text-[#4F6F52]" />
                </div>
                <h3 className="text-lg font-bold text-[#20231F] mb-2">
                  {d.title}
                </h3>
                <p className="text-sm text-[#667064] leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ 8. EK MODÜLLER ═══ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20231F] mb-4">
              İş büyüdükçe Buneka da büyür.
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {modules.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#E4DED2] bg-white text-sm font-medium text-[#20231F] shadow-sm hover:border-[#4F6F52]/30 hover:shadow-md transition-all duration-200"
              >
                <ChevronRight size={14} className="text-[#4F6F52]" />
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ 9. KAPANIŞ CTA ═══ */}
      <section className="py-24 bg-[#EFE8DC]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20231F] mb-4 leading-snug">
              Dükkanınızın hafızasını bugün açın.
            </h2>
            <p className="text-lg text-[#667064] leading-relaxed mb-10 max-w-xl mx-auto">
              Büyük sistem kurmadan, küçük işletmenin en kritik sorularını
              cevaplayan sade bir yardımcıyla başlayın.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-[#C8913A] shadow-lg shadow-[#C8913A]/25 hover:bg-[#b5802f] hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Demo Paneli Aç
                <ArrowRight size={18} />
              </Link>
              <a
                href="mailto:info@buneka.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-[#4F6F52] bg-white border border-[#4F6F52]/20 hover:bg-[#F7F4ED] hover:-translate-y-0.5 transition-all"
              >
                <Mail size={18} />
                İletişime Geç
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ 10. FOOTER ═══ */}
      <footer className="py-12 border-t border-[#E4DED2]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F6F52] text-white">
              <Barcode size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-sm font-medium text-[#667064] mb-2">
            © 2025 Buneka. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-[#667064]/60">
            Buneka resmi yazarkasa veya mali belge düzenleyici değildir.
          </p>
        </div>
      </footer>
    </main>
  );
}
