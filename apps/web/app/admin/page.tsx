import Link from "next/link";
import {
  BadgePercent,
  ClipboardList,
  KeyRound,
  LineChart,
  MonitorSmartphone,
  Puzzle,
  Store,
  Users,
} from "lucide-react";
import { PageHeader } from "@/app/app/_components/PageHeader";

const activeRoutes = [
  { href: "/admin/customers", title: "Müşteriler", text: "İşletme, sahip ve lisans durumu.", icon: Users, tone: "cyan" },
  { href: "/admin/licenses", title: "Lisanslar", text: "Paket ata, yenile, süresini yönet.", icon: KeyRound, tone: "emerald" },
  { href: "/admin/modules", title: "Modüller", text: "Müşteri bazlı ek modül erişimi.", icon: Puzzle, tone: "amber" },
] as const;

const upcomingRoutes = [
  { href: "/admin/campaigns", title: "Kampanyalar", text: "Paket ve müşteri hedefli kampanyalar — sonraki faz.", icon: BadgePercent },
  { href: "/admin/analytics", title: "Analitik", text: "Kullanım ve paket dağılımı — sonraki faz.", icon: LineChart },
  { href: "/admin/devices", title: "Cihazlar", text: "Barkod okuyucu ve donanım kataloğu — sonraki faz.", icon: MonitorSmartphone },
  { href: "/admin/resellers", title: "Bayiler", text: "Kanal ve komisyon takibi — sonraki faz.", icon: Store },
  { href: "/admin/audit", title: "İşlem kayıtları", text: "Kritik admin hareketleri — sonraki faz.", icon: ClipboardList },
] as const;

const TONE_STYLES: Record<string, string> = {
  cyan: "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20",
  emerald: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
  amber: "bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Yönetim Paneli" subtitle="Müşteri, lisans ve modül yönetimi burada." />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {activeRoutes.map((route) => (
          <Link key={route.href} href={route.href} className="data-card p-6 transition-transform hover:-translate-y-0.5">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${TONE_STYLES[route.tone]}`}>
              <route.icon size={24} />
            </div>
            <h2 className="font-display text-lg font-bold text-slate-950 dark:text-slate-50">{route.title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{route.text}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-display mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Sonraki fazda açılacak
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {upcomingRoutes.map((route) => (
          <div key={route.href} className="data-card p-6 opacity-70">
            <route.icon size={22} className="mb-3 text-slate-400 dark:text-slate-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">{route.title}</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{route.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
