import Link from "next/link";
import {
  Barcode,
  ScanBarcode,
  WalletCards,
  Boxes,
  BarChart3,
  BookOpen,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Store,
  Scissors,
  Dog,
  Sparkles,
  Shirt,
  Wrench,
  ChevronRight,
  TrendingUp,
  Eye,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen font-sans selection:bg-[#40916C] selection:text-white bg-[#F8F6F0]">
      {/* ──────────────────────────────────────────────────────── HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D2818]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A843] text-[#0D2818]">
              <Barcode size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Buneka</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-[#F1F5F2]/80">
            <a href="#cozumler" className="hover:text-white transition-colors">Çözümler</a>
            <a href="#sektorler" className="hover:text-white transition-colors">Sektörler</a>
            <a href="#paketler" className="hover:text-white transition-colors">Paketler</a>
          </nav>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-white/90 hover:text-white">
              Giriş Yap
            </Link>
            <Link href="/demo" className="px-5 py-2 rounded-xl text-sm font-bold bg-[#D4A843] text-[#0D2818] hover:bg-[#E8985E] transition-all shadow-lg shadow-[#D4A843]/20">
              Ücretsiz Deneyin
            </Link>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────── HERO */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 bg-gradient-to-b from-[#0D2818] via-[#1B4332] to-[#2D6A4F] overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#40916C]/30 border border-[#40916C]/50 text-[#F1F5F2] font-semibold text-xs tracking-wide uppercase mb-8">
              Küçük İşletmelerin Dijital Hafızası
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 font-display">
              Barkodu okut,<br />
              fiyatı gör,<br />
              <span className="text-[#D4A843]">satışını bil.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#F1F5F2]/80 leading-relaxed max-w-xl mb-10 font-medium">
              Buneka, küçük işletmeler için yılllık lisanslı fiyat sorgulama, kasa ve stok takip sistemidir. Dükkanınızda uçtan uca kontrol sağlar, karmaşa yaratmaz.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/demo" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-[#D4A843] text-[#0D2818] hover:bg-[#E8985E] shadow-xl shadow-[#D4A843]/20 transition-all hover:-translate-y-1">
                Ücretsiz Deneyin <ArrowRight size={18} />
              </Link>
              <a href="#paketler" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
                Paketleri İncele
              </a>
            </div>

            <div className="flex items-center gap-8 text-sm font-semibold text-white/60">
              <span>✓ 10.000+ Sorgu</span>
              <span>✓ 500+ İşletme</span>
              <span>✓ %99.9 Uptime</span>
            </div>
          </div>

          <div className="hidden lg:block relative">
            {/* Dark Mockup Card */}
            <div className="relative w-full max-w-sm mx-auto bg-[#0F1A12] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <span className="text-white/50 text-sm font-medium">Buneka</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
              </div>
              
              <div className="bg-[#1A2B1E] border border-[#2F4A35] rounded-2xl p-5 mb-4 shadow-inner">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#4F6F52]/20 text-[#8A9B8E] text-xs px-2 py-1 rounded font-mono">123456789</span>
                  <span className="text-[#3F7D53] text-xs font-bold px-2 py-1 bg-[#3F7D53]/20 rounded-full">Stok: 48</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-4">Ethiopia Filtre Kahve 250g</h3>
                <div className="text-4xl font-extrabold text-[#D4A843]">₺340,00</div>
              </div>
              
              <button className="w-full bg-[#3F7D53] hover:bg-[#2D6A4F] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-2 transition-colors">
                <CheckCircle2 size={20} /> Satış Yapıldı
              </button>
              <button className="w-full bg-[#1A2B1E] text-white/80 font-bold py-3 rounded-xl transition-colors">
                Ana Ekrana Dön
              </button>

              {/* Floating Mini Stats */}
              <div className="absolute -left-12 top-20 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-[pulse_4s_ease-in-out_infinite]">
                <TrendingUp size={18} className="text-[#D4A843]" />
                <div>
                  <div className="text-xs text-white/70">Günlük Ciro</div>
                  <div className="text-sm font-bold text-white">₺8.420</div>
                </div>
              </div>
              
              <div className="absolute -right-8 bottom-24 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-[pulse_5s_ease-in-out_infinite_reverse]">
                <Eye size={18} className="text-white" />
                <div>
                  <div className="text-xs text-white/70">İlgi (Alınmadı)</div>
                  <div className="text-sm font-bold text-white">12 Ürün</div>
                </div>
              </div>
            </div>
            
            {/* Glow behind mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#40916C]/40 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── SOLUTIONS */}
      <section id="cozumler" className="py-24 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1B1F1C] mb-4 font-display">İşletmenizi güçlendiren çözümler</h2>
            <p className="text-lg text-[#667064] max-w-2xl mx-auto">Karmaşık eğitimlere gerek kalmadan, ilk günden değer katan modüller.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ScanBarcode, title: "Fiyat Sorgulama", desc: "Barkod okutun, ürün bilgisi ve fiyat anında ekranda. USB, Bluetooth veya kamera ile anında çalışır." },
              { icon: WalletCards, title: "Kasa Takibi", desc: "Günlük ciro, tahmini kâr ve satış detayları tek ekranda. Gün sonu raporu otomatik oluşur." },
              { icon: Boxes, title: "Stok Yönetimi", desc: "Stok girişi, satışla otomatik düşme, minimum stok uyarısı. Tedarikçi bazlı profesyonel takip." },
              { icon: BarChart3, title: "Akıllı Raporlar", desc: "En çok satılan, en çok sorgulanan, satışa dönmeyen ilgi raporları. SERENIS işletme notu." },
              { icon: BookOpen, title: "Veresiye Defteri", desc: "Müşteri bazlı borç takibi, ödeme kaydı, veresiye hatırlatması ile güvenilir cari yönetimi." },
              { icon: DollarSign, title: "Dolar Bazlı Fiyat", desc: "Dolar üzerinden alış fiyatı girin, sistem güncel kurla TL'ye çevirir ve en yakın üst rakama yuvarlar." }
            ].map((s, i) => (
              <div key={i} className="bg-[#F8F6F0] p-8 rounded-3xl border border-[#E4DED2] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1B4332]/5 transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E4DED2] flex items-center justify-center mb-6">
                  <s.icon size={24} className="text-[#40916C]" />
                </div>
                <h3 className="text-xl font-bold text-[#1B1F1C] mb-3">{s.title}</h3>
                <p className="text-[#667064] leading-relaxed mb-6 font-medium">{s.desc}</p>
                <a href="#paketler" className="inline-flex items-center font-bold text-[#40916C] hover:text-[#1B4332]">
                  Detayları Gör <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── SECTORS */}
      <section id="sektorler" className="py-24 px-6 bg-[#F8F6F0] border-y border-[#E4DED2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1B1F1C] mb-4 font-display">Her sektöre özel çözümler</h2>
            <p className="text-lg text-[#667064] max-w-2xl mx-auto">Sektörünüzün dinamiklerine uygun özel modüllerle işinizi kolaylaştırıyoruz.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Store, title: "Market & Bakkal", desc: "Hızlı barkod okutma, SKT takibi, raf etiketi yönetimi." },
              { icon: Scissors, title: "Kırtasiye", desc: "Sezon takibi, paket ürün oluşturma, okul listesi kaydı." },
              { icon: Dog, title: "Petshop", desc: "Mama stoku, tekrar alım uyarısı, skt takibi." },
              { icon: Sparkles, title: "Kozmetik", desc: "Marka raporu, deneme ilgisi takibi, kampanya." },
              { icon: Shirt, title: "Giyim", desc: "Beden ve renk varyantı, sezon yönetimi, iade." },
              { icon: Wrench, title: "Hırdavat", desc: "Birim takibi (metre/kg), tedarikçi fiyat değişimi." }
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-[#E4DED2] shadow-sm hover:border-[#D4A843] transition-colors">
                <div className="w-12 h-12 bg-[#40916C]/10 rounded-full flex items-center justify-center shrink-0">
                  <s.icon size={22} className="text-[#40916C]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B1F1C] mb-1">{s.title}</h3>
                  <p className="text-sm text-[#667064] leading-relaxed mb-3">{s.desc}</p>
                  <a href="#" className="text-sm font-bold text-[#D4A843] hover:text-[#E8985E] flex items-center">
                    Sektör modülünü incele <ChevronRight size={14} className="ml-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── PACKAGES */}
      <section id="paketler" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1B1F1C] mb-4 font-display">İhtiyacınız kadar. İşiniz büyüdükçe ölçeklenir.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Buneka Fiyat", price: "₺6.000", desc: "Fiyat sorgulama, ürün ekleme, basit rapor", color: "text-[#667064]" },
              { name: "Buneka Kasa", price: "₺9.000", desc: "+ Satış kaydı, günlük kasa, sorgu raporu", color: "text-[#1B4332]", pop: true },
              { name: "Buneka Stok", price: "₺15.000", desc: "+ Stok takibi, min. stok uyarısı, kâr detayı", color: "text-[#1B4332]" },
              { name: "Buneka Patron", price: "₺24.000", desc: "+ SERENIS notu, çoklu cihaz, patron paneli", color: "text-[#1B4332]" }
            ].map((p, i) => (
              <div key={i} className={`relative flex flex-col p-8 bg-white rounded-3xl transition-all ${p.pop ? 'border-2 border-[#D4A843] shadow-2xl shadow-[#D4A843]/10 scale-[1.02] z-10' : 'border border-[#E4DED2] shadow-sm hover:shadow-lg'}`}>
                {p.pop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4A843] text-[#0D2818] px-4 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-md">
                    En Popüler
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#1B1F1C] mb-2">{p.name}</h3>
                <div className="mb-6 border-b border-[#E4DED2] pb-6">
                  <span className="text-4xl font-extrabold text-[#1B1F1C] tracking-tighter">{p.price}</span>
                  <span className="text-sm font-medium text-[#667064] ml-1">/yıl</span>
                </div>
                <ul className="flex-1 space-y-4 mb-8">
                  {p.desc.split(', ').map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm font-medium text-[#1B1F1C]">
                      <CheckCircle2 size={18} className="text-[#40916C] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login" className={`w-full py-4 text-center rounded-xl font-bold transition-all ${p.pop ? 'bg-[#D4A843] text-[#0D2818] hover:bg-[#E8985E]' : 'bg-[#F8F6F0] text-[#1B1F1C] hover:bg-[#E4DED2]'}`}>
                  Hemen Başla
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-sm font-bold text-[#667064] tracking-widest uppercase mb-6">Ek modüllerle büyüyün</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {['Son kullanma tarihi', 'Raf etiketi', 'Veresiye defteri', 'Çoklu cihaz', 'Çok şube', 'SERENIS notu', 'Giyim beden/renk', 'Petshop tekrar alım', 'Kırtasiye sezonu', 'Hırdavat birim', 'Toplu fiyat güncelleme', 'Dolar bazlı fiyat'].map(mod => (
                <span key={mod} className="bg-white border border-[#E4DED2] px-4 py-2 rounded-full text-sm font-semibold text-[#1B1F1C] shadow-sm">
                  {mod}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#1B4332] to-[#0D2818] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 font-display">İşletmenizin dijital hafızasını başlatın.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/demo" className="px-8 py-4 rounded-2xl text-base font-bold bg-[#D4A843] text-[#0D2818] hover:bg-[#E8985E] shadow-xl shadow-[#D4A843]/20 transition-all">
              Ücretsiz Deneyin
            </Link>
            <a href="mailto:info@buneka.com" className="px-8 py-4 rounded-2xl text-base font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
              İletişime Geçin
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── FOOTER */}
      <footer className="py-12 bg-[#0F1A12] text-white/50 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <Barcode size={32} className="text-[#40916C]" />
          </div>
          <p className="text-sm font-medium mb-2 text-white/70">© 2026 Buneka. Tüm hakları saklıdır.</p>
          <p className="text-xs max-w-lg mx-auto">Buneka resmi yazarkasa veya mali belge düzenleyici değildir. Operasyonel destek sistemidir.</p>
        </div>
      </footer>
    </main>
  );
}
