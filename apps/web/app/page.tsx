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
  WalletCards,
  Eye,
  TrendingUp,
  Store as StoreIcon
} from "lucide-react";

const plans = [
  {
    name: "FiyatGör Başlangıç",
    price: "7.500 TL",
    summary: "Barkodla fiyat sorgulama ve basit stok/kasa takibi.",
    features: ["Fiyat gösterme", "Satış & Satış Yok butonu", "Günlük kasa özeti", "Kaçan satış raporu"]
  },
  {
    name: "FiyatGör İşletme",
    price: "18.000 TL",
    summary: "Fiyat, kasa, stok takibi ve akıllı uyarılar.",
    features: ["Kullanıcı yetkileri", "Minimum stok uyarısı", "Mobil patron ekranı", "Haftalık detaylı rapor"]
  },
  {
    name: "FiyatGör Patron",
    price: "45.000 TL",
    summary: "Gelişmiş kâr analizi, personel takibi ve SERENIS zekâsı.",
    features: ["Çoklu şube desteği", "Kâr analizi (Brüt/Net)", "SERENIS İşletme Notu", "Bulut yedekleme"]
  }
];

const faqs = [
  {
    question: "FiyatGör muhasebe programı veya yazarkasa mıdır?",
    answer: "Hayır. FiyatGör Mini Kasa, resmi yazarkasa yerine geçmez. İşletmenin fiyat, stok, satış ve kâr takibini kolaylaştıran yardımcı yönetim ve hafıza sistemidir."
  },
  {
    question: "Aylık ödeme var mı?",
    answer: "Size uygun modele göre değişir. Dilerseniz tek seferlik lisans bedeliyle, dilerseniz düşük aylık abonelik modeliyle kullanabilirsiniz."
  },
  {
    question: "Sadece telefonla kullanabilir miyim?",
    answer: "Evet. Başlangıçta sadece telefon kamerasıyla okutarak kullanabilirsiniz, işler büyüdükçe bir USB barkod okuyucu takarak hızlanabilirsiniz."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F4ED] text-[#2c3f2d] selection:bg-[#4F6F52] selection:text-white font-sans overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#b65a3c]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#4F6F52]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-xl bg-[#F7F4ED]/70 border-b border-[#4F6F52]/10 transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F6F52] to-[#3a523c] text-white shadow-lg shadow-[#4F6F52]/20 group-hover:scale-105 transition-transform">
            <Barcode size={22} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1a261b]">FiyatGör</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#4F6F52]/80">
          <a href="#nedir" className="hover:text-[#b65a3c] transition-colors">Ana Fikir</a>
          <a href="#farkimiz" className="hover:text-[#b65a3c] transition-colors">Farkımız</a>
          <a href="#paketler" className="hover:text-[#b65a3c] transition-colors">Paketler</a>
          <a href="#sss" className="hover:text-[#b65a3c] transition-colors">S.S.S</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-[#4F6F52] hover:bg-[#4F6F52]/5 transition-colors">
            <ShieldCheck size={18} />
            Giriş Yap
          </Link>
          <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#b65a3c] to-[#9a4b31] shadow-lg shadow-[#b65a3c]/30 hover:shadow-[#b65a3c]/50 hover:scale-105 transition-all">
            <ScanBarcode size={18} />
            Sisteme Başla
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F6F52]/10 text-[#4F6F52] font-semibold text-sm mb-8 animate-fade-in-up">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F6F52] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4F6F52]"></span>
          </span>
          Küçük İşletmeler İçin Yeni Nesil İşletme Hafızası
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1a261b] max-w-4xl leading-tight mb-6 animate-fade-in-up" style={{animationDelay: '100ms'}}>
          Dükkanın hafızası cebinizde, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6F52] to-[#b65a3c]">kasanız gözünüzün önünde.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#4F6F52]/80 max-w-2xl mb-10 font-medium animate-fade-in-up" style={{animationDelay: '200ms'}}>
          Barkodu okutun, fiyatı görün. Satış olursa kasanıza işlesin. Ama en önemlisi: <strong className="text-[#b65a3c]">Müşterinin fiyatını sorup almadığı ürünleri görün.</strong>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
          <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-white bg-[#4F6F52] shadow-xl shadow-[#4F6F52]/30 hover:bg-[#3a523c] hover:scale-105 transition-all">
            Hemen Ücretsiz Başla
            <ArrowRight size={20} />
          </Link>
          <a href="#nedir" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-[#4F6F52] bg-white border border-[#4F6F52]/20 hover:bg-[#4F6F52]/5 transition-all">
            Sistemi Keşfet
          </a>
        </div>
      </section>

      {/* 4 Core Questions Section */}
      <section id="nedir" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a261b] mb-4">Küçük esnaf için 4 altın soru</h2>
          <p className="text-[#4F6F52]/80 text-lg max-w-2xl mx-auto">Sistemsiz çalışan küçük işletmeye çok basit ama kusursuz bir işletme hafızası kazandırıyoruz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ScanBarcode, title: "Bu ürünün fiyatı ne?", desc: "Barkodu okutun, alış-satış fiyatını ve kârınızı anında görün." },
            { icon: WalletCards, title: "Bugün ne kadar sattım?", desc: "Satış tuşuna basın, cironuz ve günlük kârınız arka planda biriksin." },
            { icon: TrendingUp, title: "En çok ne satıldı?", desc: "Hangi ürünün dükkanı ayakta tuttuğunu günlük raporlarla görün." },
            { icon: Eye, title: "Ne soruldu ama alınmadı?", desc: "İşte asıl zeka! Fiyatı sorulup vazgeçilen ürünleri tespit edin." }
          ].map((item, idx) => (
            <div key={idx} className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#4F6F52]/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#4F6F52]/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 rounded-3xl -z-10" />
              <div className="h-14 w-14 rounded-2xl bg-[#4F6F52]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#4F6F52] transition-all duration-300">
                <item.icon size={28} className="text-[#4F6F52] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#1a261b] mb-3">{item.title}</h3>
              <p className="text-[#4F6F52]/70 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Big Differentiator */}
      <section id="farkimiz" className="py-24 px-6 md:px-12 bg-[#4F6F52] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b65a3c]/30 rounded-full blur-[100px]"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Esnafın en büyük kaybı satmadığı üründe değil,<br/>
            <span className="text-[#e8b29f]">neyi neden satamadığını bilmemesindedir.</span>
          </h2>
          <p className="text-[#e2e8e3] text-xl max-w-3xl mx-auto leading-relaxed mb-12">
            Klasik kasa sistemleri sadece sattığınızı gösterir. FiyatGör Mini Kasa ise; müşteri raftan ürünü getirip fiyat sorduğunda ve almaktan vazgeçtiğinde bunu "İlgi" olarak kaydeder. 
            <br/><br/><strong>"İçecek B çok soruluyor ama az satılıyor. Fiyat yüksek olabilir!"</strong> diyen bir asistana sahip olun.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-white/60 text-sm font-semibold mb-1">Okutma</div>
              <div className="text-3xl font-bold text-white">80 Kez</div>
              <div className="text-[#e8b29f] text-sm mt-2">Çikolata A ürünü soruldu</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-white/60 text-sm font-semibold mb-1">Gerçekleşen Satış</div>
              <div className="text-3xl font-bold text-white">64 Adet</div>
              <div className="text-[#e8b29f] text-sm mt-2">Satışa döndü</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[#b65a3c] shadow-[0_0_30px_rgba(182,90,60,0.3)] transform scale-105">
              <div className="text-white/80 text-sm font-semibold mb-1">Satışa Dönmeme Oranı</div>
              <div className="text-3xl font-bold text-[#e8b29f]">%20 Fire</div>
              <div className="text-white/70 text-sm mt-2">Gizli fırsatı yakalayın</div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a261b] mb-4">Kimler İçin Tasarlandı?</h2>
          <p className="text-[#4F6F52]/80 text-lg max-w-2xl mx-auto">Karmaşık zincir market yazılımlarına binlerce lira ödemek istemeyen, hızlı ve pratik esnaf için.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Bakkal & Büfe", icon: StoreIcon, desc: "Hızlı okut, kasayı gör." },
            { label: "Kırtasiye", icon: PackagePlus, desc: "Sezonluk ürün ve paket takibi." },
            { label: "Petshop", icon: BadgeCheck, desc: "Mama stok ve skt takibi." },
            { label: "Kozmetik", icon: Building2, desc: "Denendi ama alınmadı raporu." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/50 backdrop-blur-sm border border-[#4F6F52]/10 rounded-3xl p-6 text-center hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#b65a3c]/10 text-[#b65a3c] flex items-center justify-center mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#1a261b] mb-2">{item.label}</h3>
              <p className="text-sm text-[#4F6F52]/70 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Packages */}
      <section id="paketler" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a261b] mb-4">İşiniz Büyüdükçe Ölçeklenen Paketler</h2>
          <p className="text-[#4F6F52]/80 text-lg max-w-2xl mx-auto">Tek seferlik kurulum veya aylık cüzi aboneliklerle. İlk müşterilere özel erken erişim indirimleriyle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div key={plan.name} className={`relative flex flex-col p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${idx === 1 ? 'bg-gradient-to-b from-white to-[#F7F4ED] border-[#b65a3c] shadow-[0_0_40px_rgba(182,90,60,0.15)] md:-mt-4 md:mb-4' : 'bg-white/60 border-white/40 shadow-xl shadow-[#4F6F52]/5'}`}>
              {idx === 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#b65a3c] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  En Çok Tercih Edilen
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#1a261b] mb-2">{plan.name}</h3>
              <p className="text-[#4F6F52]/70 font-medium mb-6 h-12">{plan.summary}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-[#1a261b]">{plan.price}</span>
                <span className="text-[#4F6F52]/60 font-medium text-sm ml-2">/ tek seferlik</span>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#4F6F52]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={12} className="text-[#4F6F52]" />
                    </div>
                    <span className="font-semibold text-[#2c3f2d] text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/login" className={`w-full py-4 rounded-xl font-bold text-center transition-all ${idx === 1 ? 'bg-[#b65a3c] text-white hover:bg-[#9a4b31] shadow-lg shadow-[#b65a3c]/30' : 'bg-[#4F6F52]/10 text-[#4F6F52] hover:bg-[#4F6F52] hover:text-white'}`}>
                Hemen Başla
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="sss" className="py-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a261b] mb-4">Sıkça Sorulan Sorular</h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg shadow-[#4F6F52]/5">
              <h3 className="text-xl font-bold text-[#1a261b] mb-3 flex items-start gap-4">
                <CircleHelp className="text-[#b65a3c] flex-shrink-0 mt-1" size={24} />
                {faq.question}
              </h3>
              <p className="text-[#4F6F52]/80 font-medium pl-10 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#4F6F52]/10 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F6F52] text-white">
            <Barcode size={24} strokeWidth={2.5} />
          </div>
        </div>
        <p className="text-[#4F6F52]/60 font-medium mb-2">© 2026 FiyatGör Mini Kasa. Tüm hakları saklıdır.</p>
        <p className="text-[#4F6F52]/40 text-sm">Resmi mali belge düzenleyici değildir, operasyonel zeka sistemidir.</p>
      </footer>
    </main>
  );
}
