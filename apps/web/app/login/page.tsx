import { Home, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BunekaMark } from "@/components/BunekaMark";
import { BunekaNedirButton } from "@/components/BunekaNedir";
import { BunekaWordmark } from "@/components/BunekaWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      <div aria-hidden className="home-grid-pattern pointer-events-none absolute inset-0" />

      <div className="absolute left-6 top-6 z-20">
        <BunekaNedirButton />
      </div>
      <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-cyan-400 hover:text-cyan-500 dark:border-slate-700 dark:text-slate-300"
          aria-label="Ana sayfa"
          title="Ana sayfa"
        >
          <Home size={16} />
        </Link>
        <ThemeToggle className="border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card glow-border flex flex-col space-y-8 rounded-2xl p-10">
          <div className="text-center">
            <Link href="/" className="mx-auto mb-5 flex w-fit items-center justify-center gap-2.5">
              <BunekaMark size={36} />
              <BunekaWordmark className="text-lg text-slate-950 dark:text-slate-50" />
            </Link>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-300">
              <ShieldCheck size={12} /> Güvenli giriş
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              Buneka&apos;ya Giriş
            </h2>
            <p className="mt-3 text-[15px] font-medium text-slate-500 dark:text-slate-400">
              Küçük işletmenin hafızası
            </p>
          </div>

          <form className="mt-4 space-y-5" action={login}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  E-posta adresi
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="premium-input"
                  placeholder="E-posta adresiniz"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="premium-input"
                  placeholder="Şifreniz"
                />
              </div>
            </div>

            {params?.error && (
              <div className="rounded-xl bg-amber-500/10 p-3 text-center text-sm font-semibold text-amber-700 backdrop-blur-md dark:text-amber-400">
                {params.error}
              </div>
            )}

            <div className="pt-2">
              <button type="submit" className="premium-button-primary w-full">
                Giriş Yap
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
