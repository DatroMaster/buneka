import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F4ED]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#4F6F52] opacity-10 blur-[100px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[600px] w-[600px] rounded-full bg-[#C8913A] opacity-10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card flex flex-col space-y-8 rounded-3xl p-10">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4F6F52] text-white shadow-[0_8px_24px_rgba(79,111,82,0.4)]">
              <span className="text-3xl font-black">B</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#20231F]">
              Buneka'ya Giriş
            </h2>
            <p className="mt-3 text-[15px] font-medium text-[#667064]">
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
              <div className="rounded-xl bg-[#b65a3c]/10 p-3 text-center text-sm font-semibold text-[#b65a3c] backdrop-blur-md">
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
