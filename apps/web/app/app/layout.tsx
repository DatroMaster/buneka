import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import Link from "next/link";
import { Search, LayoutDashboard, Package, BarChart3, Settings, LogOut } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: appUser } = await supabase
    .from("app_users")
    .select("*, organizations(name)")
    .eq("auth_user_id", user.id)
    .single();

  const navigation = [
    { name: "Fiyat Sorgula", href: "/app/price", icon: Search },
    { name: "Günlük Kasa", href: "/app/cash", icon: LayoutDashboard },
    { name: "Stok Takibi", href: "/app/stock", icon: Package },
    { name: "Ürünler", href: "/app/products", icon: Package },
    { name: "Raporlar", href: "/app/reports", icon: BarChart3 },
    { name: "Ayarlar", href: "/app/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F4ED]">
      {/* Sidebar */}
      <aside className="w-[280px] flex-col border-r border-[#E4DED2] bg-white/60 backdrop-blur-xl hidden md:flex z-10 shadow-[4px_0_24px_rgba(32,35,31,0.02)]">
        <div className="flex h-20 items-center px-8 border-b border-[#E4DED2]/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F6F52] text-white shadow-md">
            <span className="text-xl font-black">B</span>
          </div>
          <div className="ml-4">
            <h1 className="text-[19px] font-extrabold tracking-tight text-[#20231F]">Buneka</h1>
            {appUser?.organizations && (
              <p className="text-xs font-semibold text-[#667064] truncate max-w-[140px]">
                {/* @ts-ignore */}
                {appUser.organizations.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center rounded-xl px-4 py-3.5 text-sm font-semibold text-[#667064] transition-all duration-200 hover:bg-[#F7F4ED] hover:text-[#4F6F52] hover:shadow-sm"
                >
                  <Icon className="mr-3 h-[18px] w-[18px] opacity-70 group-hover:opacity-100 transition-opacity" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#E4DED2]/50 p-4 bg-white/40">
          <div className="flex items-center rounded-xl p-3 transition-colors hover:bg-white/60 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4DED2] font-bold text-[#4F6F52]">
              {(appUser?.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#20231F]">
                {appUser?.name || user.email}
              </p>
              <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-[#C8913A]">
                {appUser?.role === "owner" ? "İşletme Sahibi" : "Kasiyer"}
              </p>
            </div>
            <LogOut className="h-4 w-4 text-[#667064] opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-[#4F6F52]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="h-full overflow-y-auto px-6 py-8 md:px-10 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
