import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Boxes,
  Camera,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  Home,
  LayoutDashboard,
  LogIn,
  PackageSearch,
  ScanLine,
  Settings,
  ShoppingCart,
  WalletCards,
} from "lucide-react";
import { BarcodeDeviceCards } from "@/components/BarcodeDeviceCards";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Kullanıcı Rehberi | Buneka",
  description: "Buneka kullanımı, barkod okuyucu kurulumu, barkod okutma adımları ve sistem özellikleri.",
};

const quickFlow = [
  {
    title: "Ürünü okut",
    text: "Barkod okuyucu, kamera ya da manuel barkod alanıyla ürünü saniyeler içinde bulun.",
    icon: ScanLine,
  },
  {
    title: "Fiyatı göster",
    text: "Ürün adı ve fiyat ekrana net biçimde gelir; çalışan müşteriye bekletmeden cevap verir.",
    icon: PackageSearch,
  },
  {
    title: "Satışı kaydet",
    text: "Satış yapıldıysa tek dokunuşla kasaya işleyin; yapılmadıysa sorgu hareketi olarak bırakın.",
    icon: ShoppingCart,
  },
  {
    title: "Raporu izleyin",
    text: "Günlük kasa, stok, veresiye ve en çok sorulan ürünleri tek ekrandan takip edin.",
    icon: BarChart3,
  },
];

const scannerSteps = [
  "USB barkod okuyucuyu bilgisayara takın; çoğu cihaz klavye gibi çalışır ve ek kurulum istemez.",
  "Buneka'da Bu ne kadar? ekranını açın ve imlecin barkod alanında olduğundan emin olun.",
  "Okuyucuyu barkoda doğru tutun. Barkod temiz, düz ve okunabilir olmalı.",
  "Okuma ışığını barkod çizgilerinin tamamını görecek şekilde hizalayın; cihaz bip sesi verdiğinde kod alana düşer.",
  "Ürün sistemde varsa fiyat görünür. Yoksa ürün ekleme ekranından ad, fiyat, kategori ve stok bilgisini kaydedin.",
];

const features = [
  {
    title: "Fiyat sorgulama",
    text: "Çalışan ürünü okutur, fiyatı büyük ve net ekranda görür.",
    icon: ScanLine,
  },
  {
    title: "Ürün yönetimi",
    text: "Barkod, kategori, fiyat, alış fiyatı ve stok bilgilerini düzenli tutar.",
    icon: Boxes,
  },
  {
    title: "Günlük kasa",
    text: "Satış yapılan ürünler kasa raporuna otomatik yansır.",
    icon: WalletCards,
  },
  {
    title: "Stok takibi",
    text: "Stok giriş-çıkış hareketlerini ve minimum stok uyarılarını izlersiniz.",
    icon: PackageSearch,
  },
  {
    title: "Veresiye defteri",
    text: "Borç, tahsilat ve kalan bakiye takibini dijital olarak yönetirsiniz.",
    icon: CreditCard,
  },
  {
    title: "Toplu ürün aktarımı",
    text: "Excel listesiyle çok sayıda ürünü tek seferde sisteme alırsınız.",
    icon: FileSpreadsheet,
  },
  {
    title: "Fatura fotoğrafı",
    text: "Tedarikçi faturasının fotoğrafını çek; ürünler, adetler ve fiyatlar saniyeler içinde işlensin.",
    icon: Camera,
  },
  {
    title: "Ayarlar ve lisans",
    text: "İşletme bilgisi, ödeme tipi, stok uyarısı ve lisans durumunu kontrol edersiniz.",
    icon: Settings,
  },
];

const checklist = [
  "İşletme bilgilerini ve sektörünüzü Ayarlar ekranında tamamlayın.",
  "En sık satılan ürünleri önce ekleyin; sonra Excel veya fatura fotoğrafıyla toplu aktarımı büyütün.",
  "Barkod okuyucuyu test etmek için ürün barkodunu Not Defteri'ne okutun; kod yazılıyorsa Buneka'da da çalışır.",
  "Çalışanlara iki aksiyonu öğretin: Satış Yapıldı ve Satış Yok. Bu ayrım raporların kalitesini artırır.",
];

export default function KullaniciRehberiPage() {
  return (
    <main className="home-viewport relative min-h-screen overflow-x-hidden text-[color:var(--home-ink)]">
      <div aria-hidden className="home-grid-pattern pointer-events-none fixed inset-0" />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BunekaMark size={26} />
          <BunekaWordmark className="text-sm text-[color:var(--home-ink)]" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]">
            <Home size={14} /> Ana Menü
          </Link>
          <Link href="/app" className="hidden h-9 items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 text-xs font-black text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)] sm:flex">
            <LayoutDashboard size={14} /> Panele Dön
          </Link>
          <BunekaNedirButton />
          <ThemeToggle className="border-[color:var(--home-border)] text-[color:var(--home-ink)] hover:border-[color:var(--home-glow)]" />
        </div>
        <Link
          href="/login"
          className="cta-primary-animated inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[color:var(--home-glow)] to-blue-500 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.18)] sm:hidden"
        >
          <LogIn size={17} /> Sisteme Giriş Yap
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 px-3 pb-8 sm:px-6">
        <div className="glow-border rounded-3xl bg-[color:var(--home-surface)]/78 p-5 backdrop-blur-xl sm:p-7">
          <Link href="/" className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--home-muted)] hover:text-[color:var(--home-ink)]">
            <ArrowLeft size={13} /> Ana sayfa
          </Link>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--home-glow)]">
                <BadgeCheck size={13} /> Kullanıcı Rehberi
              </span>
              <h1 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
                Buneka&apos;yı günlük satış akışında nasıl kullanırsınız?
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--home-muted)] sm:text-base">
                Bu rehber barkod okuyucunun nasıl bağlanacağını, ürünün nasıl okutulacağını ve fiyat, kasa, stok,
                veresiye, rapor, toplu aktarım gibi temel ekranların hangi sırayla kullanılacağını anlatır.
              </p>
            </div>
            <div className="grid gap-2 rounded-2xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/7 p-4">
              {["Barkodu okut", "Fiyatı gör", "Satışını bil", "Kasanı takip et"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-[color:var(--home-surface)]/80 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--home-glow)] text-xs font-black text-slate-950">
                    {index + 1}
                  </span>
                  <span className="font-display text-sm font-black">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quickFlow.map((step) => (
            <article key={step.title} className="glow-border rounded-2xl bg-[color:var(--home-surface)]/74 p-4 backdrop-blur-xl">
              <step.icon size={20} className="text-[color:var(--home-glow)]" />
              <h2 className="mt-3 font-display text-lg font-black">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--home-muted)]">{step.text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glow-border rounded-2xl bg-[color:var(--home-surface)]/74 p-5 backdrop-blur-xl">
            <h2 className="font-display text-2xl font-black">Barkod okuma cihazı nasıl kullanılır?</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--home-muted)]">
              USB barkod okuyucular genellikle klavye gibi davranır. Yani cihaz barkodu okuduğunda numarayı aktif
              yazı alanına yazar ve çoğu model Enter tuşu gönderebilir.
            </p>
            <div className="mt-4 grid gap-3">
              {scannerSteps.map((step, index) => (
                <div key={step} className="flex gap-3 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface-soft)] p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--home-glow)] text-xs font-black text-slate-950">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-[color:var(--home-muted)]">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glow-border rounded-2xl bg-[color:var(--home-surface)]/74 p-5 backdrop-blur-xl">
            <h2 className="font-display text-2xl font-black">Sistemin temel özellikleri</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--home-muted)]">
              Buneka fiyat sorusunu, satış kaydını ve stok hafızasını aynı operasyon akışında toplar.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface-soft)] p-3">
                  <div className="flex items-center gap-2">
                    <feature.icon size={17} className="text-[color:var(--home-glow)]" />
                    <h3 className="font-display text-sm font-black">{feature.title}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--home-muted)]">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="glow-border rounded-2xl bg-[color:var(--home-surface)]/74 p-5 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl font-black">Uygun fiyatlı barkod cihazları</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--home-muted)]">
                Paketlere ek olarak aşağıdaki cihazlar başlangıç için uygundur. Fiyatlar kaynak sayfadan canlı
                kontrol edilir; kaynak erişimi engellenirse son doğrulanan fiyat gösterilir.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--home-border)] px-3 py-1.5 text-xs font-black text-[color:var(--home-glow)]">
              <CheckCircle2 size={14} /> USB cihazlarla uyumlu
            </span>
          </div>
          <div className="mt-4">
            <BarcodeDeviceCards />
          </div>
        </section>

        <section className="glow-border rounded-2xl bg-[color:var(--home-surface)]/74 p-5 backdrop-blur-xl">
          <h2 className="font-display text-2xl font-black">İlk kurulum kontrol listesi</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {checklist.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface-soft)] p-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
                <p className="text-sm leading-6 text-[color:var(--home-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
