import Link from "next/link";
import {
  BadgePercent,
  ClipboardList,
  KeyRound,
  LineChart,
  MonitorSmartphone,
  Puzzle,
  Store,
  Users
} from "lucide-react";

const routes = [
  ["/admin/customers", "Müşteriler", "İşletme ve mağaza kayıtları.", Users],
  ["/admin/licenses", "Lisanslar", "Paket, başlangıç ve bitiş tarihi.", KeyRound],
  ["/admin/modules", "Modüller", "Ek yıllık modül yönetimi.", Puzzle],
  ["/admin/campaigns", "Kampanyalar", "Paket ve müşteri teklifleri.", BadgePercent],
  ["/admin/analytics", "Analitik", "Kullanım ve paket dağılımı.", LineChart],
  ["/admin/devices", "Cihazlar", "Barkod okuyucu ve donanım kataloğu.", MonitorSmartphone],
  ["/admin/resellers", "Bayiler", "Kanal ve komisyon takibi.", Store],
  ["/admin/audit", "İşlem kayıtları", "Kritik admin hareketleri.", ClipboardList]
] as const;

export default function AdminPage() {
  return (
    <main className="workspace-page">
      <section className="workspace-hero">
        <span className="status-line">super_admin</span>
        <h1>Yönetim paneli</h1>
        <p>Müşteri, lisans, modül, kampanya ve kullanım takibi burada yönetilecek.</p>
      </section>
      <section className="workspace-grid">
        {routes.map(([href, title, text, Icon]) => (
          <Link className="card route-card" href={href} key={href}>
            <Icon size={28} color="var(--green)" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
