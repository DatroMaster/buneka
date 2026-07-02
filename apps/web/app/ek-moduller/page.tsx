import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BunekaMark } from "@/components/BunekaMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { modules } from "@/lib/content/modules";

export const metadata = {
  title: "Ek Modüller | Buneka",
  description: "Buneka lisansınıza ekleyebileceğiniz tüm ek modüller ve yıllık ücretleri.",
};

export default function EkModullerPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[color:var(--color-text)]">
      <header className="border-b border-[color:var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-black">
            <BunekaMark size={22} />
            Buneka
          </Link>
          <div className="flex items-center gap-3">
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
            {modules.map((module) => (
              <article key={module.label} className="data-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
                  <module.icon size={24} />
                </div>
                <h2 className="font-display text-lg font-bold">{module.label}</h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">{module.description}</p>
                <p className="mt-4 text-sm font-black text-cyan-600 dark:text-cyan-300">{module.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
