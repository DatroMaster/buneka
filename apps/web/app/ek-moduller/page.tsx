import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, Package } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappLink } from "@/lib/contact";
import { modules } from "@/lib/content/modules";

export const metadata = {
  title: "Ek Modüller | Buneka",
  description: "Buneka lisansınıza ekleyebileceğiniz tüm ek modüller ve yıllık ücretleri.",
};

const CAPILLARY_COLORS = [
  "glow-border-turquoise",
  "glow-border-amber",
  "glow-border-green",
  "glow-border-violet",
  "glow-border-rose",
];

export default function EkModullerPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[color:var(--color-text)]">
      <header className="border-b border-[color:var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <BunekaMark size={22} />
            <BunekaWordmark className="text-sm text-[color:var(--color-text)]" />
          </Link>
          <div className="flex items-center gap-3">
            <BunekaNedirButton />
            <Link href="/demo" className="premium-button-primary text-sm">
              Demo Paneli Aç
            </Link>
            <ThemeToggle className="border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-cyan-400" />
          </div>
        </div>
      </header>

      <section className="px-5 py-14 md:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-black text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]"
          >
            <ArrowLeft size={16} /> Ana sayfaya dön
          </Link>
          <h1 className="font-display max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            İş büyüdükçe ihtiyacınız olan modülü açın.
          </h1>
          <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
            Tüm modüller mevcut lisans paketinizin üzerine, yıllık ek ücretle eklenir. Hangi modülün ne
            yaptığını ve ne kadar tuttuğunu aşağıda görebilirsiniz.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <article
                key={module.label}
                className={`flex flex-col rounded-xl bg-[color:var(--color-card)] p-6 ${CAPILLARY_COLORS[index % CAPILLARY_COLORS.length]}`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
                  <module.icon size={24} />
                </div>
                <h2 className="font-display text-lg font-bold">{module.label}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-[color:var(--color-muted)]">{module.description}</p>
                <p className="mt-4 text-sm font-black text-cyan-600 dark:text-cyan-300">{module.price}</p>
                <a
                  href={whatsappLink(`Merhaba, "${module.label}" modülünü lisansıma eklemek istiyorum.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-button-secondary mt-4 w-full text-sm"
                >
                  <MessageCircle size={16} className="text-emerald-500" /> Bu Modülü Talep Et
                </a>
              </article>
            ))}
          </div>

          <div className="glow-border mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-[color:var(--color-card)] p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
                <Package size={20} />
              </div>
              <div>
                <p className="font-display text-lg font-bold">Modüller, bir lisans paketinin üzerine eklenir.</p>
                <p className="text-sm text-[color:var(--color-muted)]">Önce size uygun paketi seçin, sonra ihtiyaç duydukça modül ekleyin.</p>
              </div>
            </div>
            <Link href="/paketler" className="premium-button-primary shrink-0 text-sm">
              Paketleri İncele <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
