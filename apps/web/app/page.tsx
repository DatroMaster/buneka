import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Barcode,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  MonitorSmartphone,
  ScanBarcode,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { plans } from "@/lib/content/plans";
import { sectors } from "@/lib/content/sectors";

const features = [
  {
    icon: ScanBarcode,
    title: "Fiyat sorgulama",
    text: "Barkodu okut veya yaz. Ürün fiyatı anında ekrana gelir.",
  },
  {
    icon: WalletCards,
    title: "Günlük kasa",
    text: "Satış gerçekleştiyse tek tuşla kaydet, gün sonunda toplamı gör.",
  },
  {
    icon: Boxes,
    title: "Stok takibi",
    text: "Stok paketi açıksa satıştan sonra stok düşer, azalan ürün görünür.",
  },
];

const modules = [
  "Son kullanma tarihi",
  "Raf etiketi",
  "Veresiye defteri",
  "Çoklu cihaz",
  "Excel ürün aktarımı",
  "Bulut yedekleme",
  "Giyim beden/renk",
  "Petshop tekrar alım",
  "Hırdavat birim takibi",
  "Toplu fiyat güncelleme",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F4ED] text-[#20231F] selection:bg-[#4F6F52] selection:text-white">
      <header className="sticky top-0 z-50 border-b border-[#E4DED2] bg-[#F7F4ED]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2F4A35] text-white">
              <Barcode size={19} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">Buneka</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-[#667064] md:flex">
            <a href="#cozumler" className="hover:text-[#20231F]">Çözümler</a>
            <a href="#sektorler" className="hover:text-[#20231F]">Sektörler</a>
            <a href="#paketler" className="hover:text-[#20231F]">Paketler</a>
            <a href="#moduller" className="hover:text-[#20231F]">Modüller</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-bold text-[#2F4A35] sm:inline-flex">
              Giriş
            </Link>
            <Link
              href="/demo"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#4F6F52] px-5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(79,111,82,0.22)] transition hover:-translate-y-0.5 hover:bg-[#2F4A35]"
            >
              <ScanBarcode size={17} />
              Demo Paneli Aç
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#E4DED2]">
        <div className="mx-auto grid min-h-[calc(100svh-64px)] max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.62fr_1fr] lg:py-24">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E4DED2] bg-white px-4 py-2 text-sm font-bold text-[#2F4A35] shadow-sm">
              <ShieldCheck size={16} />
              Kurulumsuz başlar. Telefonda çalışır.
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-[#20231F] md:text-7xl">
              Barkodu okut,
              <br />
              fiyatı gör,
              <br />
              satışını bil.
            </h1>

            <p className="mt-8 max-w-2xl text-lg font-medium leading-8 text-[#667064] md:text-xl">
              Buneka, küçük işletmeler için yıllık lisanslı fiyat sorgulama,
              kasa ve stok takip sistemidir. Telefonla denenir, barkod
              okuyucuyla hızlanır, gereksiz karmaşa çıkarmaz.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#4F6F52] px-7 text-base font-extrabold text-white shadow-[0_18px_40px_rgba(79,111,82,0.24)] transition hover:-translate-y-1 hover:bg-[#2F4A35]"
              >
                Demo Paneli Aç
                <ArrowRight size={19} />
              </Link>
              <a
                href="#paketler"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[#D8B46A] bg-white px-7 text-base font-extrabold text-[#2F4A35] transition hover:-translate-y-1 hover:bg-[#FFF8E8]"
              >
                Paketleri İncele
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 text-sm font-bold text-[#667064] sm:grid-cols-3">
              {["Fiyat hafızası", "Günlük kasa", "Stok görünürlüğü"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#4F6F52]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[34px] border border-[#E4DED2] bg-white p-5 shadow-[0_34px_90px_rgba(32,35,31,0.12)]">
              <div className="rounded-[26px] bg-[#0F1A12] p-5 text-white">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-bold text-white/70">Buneka</span>
                  <span className="rounded-full bg-[#4F6F52]/25 px-3 py-1 text-xs font-bold text-[#BFE0C4]">
                    Canlı kasa
                  </span>
                </div>

                <div className="rounded-3xl border border-[#2F4A35] bg-[#1A2B1E] p-5">
                  <p className="text-sm font-bold text-[#BFE0C4]">Bu ne kadar?</p>
                  <div className="mt-4 rounded-2xl border border-[#2F4A35] bg-[#243328] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-lg bg-white/8 px-2 py-1 font-mono text-xs text-white/55">
                        8690000000028
                      </span>
                      <span className="rounded-full bg-[#3F7D53]/20 px-2 py-1 text-xs font-bold text-[#9FE0AE]">
                        Stok: 24
                      </span>
                    </div>
                    <h2 className="text-2xl font-black">Çikolata Mini</h2>
                    <p className="mt-5 text-5xl font-black text-[#D8B46A]">35 TL</p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="rounded-2xl bg-[#3F7D53] px-4 py-4 text-sm font-extrabold text-white">
                      Satış Yapıldı
                    </button>
                    <button className="rounded-2xl bg-white/8 px-4 py-4 text-sm font-extrabold text-white">
                      Ana Ekrana Dön
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    ["Fiyat sorgusu", "126"],
                    ["Günlük kasa", "8.420 TL"],
                    ["Stok uyarısı", "5"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/6 p-3">
                      <p className="text-xs text-white/50">{label}</p>
                      <p className="mt-1 text-lg font-black">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cozumler" className="bg-white px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#C8913A]">Çalışan çekirdek</p>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Az şey göster. Doğru şeyi göster.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                className="rounded-[24px] border border-[#E4DED2] bg-[#F7F4ED] p-8 shadow-[0_18px_50px_rgba(32,35,31,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(32,35,31,0.09)]"
                key={feature.title}
              >
                <feature.icon className="mb-8 text-[#4F6F52]" size={30} />
                <h3 className="text-2xl font-black">{feature.title}</h3>
                <p className="mt-4 leading-7 text-[#667064]">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sektorler" className="border-y border-[#E4DED2] bg-[#EFE8DC] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#C8913A]">Sektörler</p>
              <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
                Her işletmenin fiyat ve stok derdi farklıdır.
              </h2>
            </div>
            <p className="max-w-md text-lg leading-8 text-[#667064]">
              Sektör kartlarını aç, hangi modülün ne işe yaradığını ve günlük akışı gör.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sectors.slice(0, 6).map((sector) => (
              <Link
                href={`/sektorler/${sector.slug}`}
                key={sector.slug}
                className="group rounded-[24px] border border-[#E4DED2] bg-white p-7 shadow-[0_18px_50px_rgba(32,35,31,0.05)] transition hover:-translate-y-1 hover:border-[#D8B46A] hover:shadow-[0_24px_70px_rgba(32,35,31,0.09)]"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className="grid h-13 w-13 place-items-center rounded-2xl bg-[#EDF4ED] text-[#4F6F52]">
                    <sector.icon size={24} />
                  </span>
                  <ChevronRight className="text-[#C8913A] transition group-hover:translate-x-1" size={22} />
                </div>
                <h3 className="text-2xl font-black">{sector.title}</h3>
                <p className="mt-3 leading-7 text-[#667064]">{sector.short}</p>
                <span className="mt-6 inline-flex text-sm font-black text-[#2F4A35]">
                  Sektör paketini incele
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="paketler" className="bg-white px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#C8913A]">Paketler</p>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Yıllık lisans. Net paket. İhtiyaç oldukça modül.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex rounded-[24px] border bg-white p-7 shadow-[0_18px_50px_rgba(32,35,31,0.05)] ${
                  plan.badge ? "border-[#D8B46A] ring-2 ring-[#D8B46A]/30" : "border-[#E4DED2]"
                } flex-col`}
              >
                {plan.badge && (
                  <span className="mb-4 w-fit rounded-full bg-[#D8B46A] px-3 py-1 text-xs font-black text-[#20231F]">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-[#667064]">{plan.summary}</p>
                <div className="my-6 border-y border-[#E4DED2] py-5">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-sm font-bold text-[#667064]">/ yıl</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm font-bold text-[#20231F]">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-[#4F6F52]" size={17} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-[#F7F4ED] px-5 text-sm font-black text-[#2F4A35] transition hover:bg-[#EDF4ED]"
                >
                  Bu Paketi İncele
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="moduller" className="bg-[#F7F4ED] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              İş büyüdükçe modül aç.
            </h2>
            <p className="max-w-md text-lg leading-8 text-[#667064]">
              Ana paketi sade tut, ihtiyaç oldukça ek özellikleri yıllık lisansla aç.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {modules.map((module) => (
              <span
                key={module}
                className="rounded-full border border-[#E4DED2] bg-white px-5 py-3 text-sm font-black text-[#2F4A35] shadow-sm"
              >
                {module}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0F1A12] px-5 py-24 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <BadgeCheck className="mb-6 text-[#D8B46A]" size={34} />
            <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Bu ne kadar? Buneka gösterir.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Demo panelde ürün akışını dene. Sonra işletme verinle lisanslı kullanıma geç.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
            <Link
              href="/demo"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#D8B46A] px-7 text-base font-black text-[#20231F] transition hover:-translate-y-1"
            >
              <MonitorSmartphone size={20} />
              Demo Paneli Aç
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 text-base font-black text-white transition hover:-translate-y-1 hover:bg-white/12"
            >
              <CircleDollarSign size={20} />
              Lisans Girişi
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0F1A12] px-5 py-10 text-white/55 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Barcode size={24} className="text-[#D8B46A]" />
            <span className="font-black text-white">Buneka</span>
          </div>
          <p className="text-sm">
            Buneka resmi yazarkasa veya mali belge sistemi değildir; küçük işletme operasyon hafızasıdır.
          </p>
        </div>
      </footer>
    </main>
  );
}
