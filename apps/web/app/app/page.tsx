import Link from "next/link";
import {
  Boxes,
  ChartNoAxesCombined,
  PackageSearch,
  Settings,
  Store,
  WalletCards
} from "lucide-react";

const routes = [
  {
    href: "/app/price",
    title: "Bu ne kadar?",
    text: "Fiyat sorgulama ana ekranı.",
    icon: PackageSearch
  },
  {
    href: "/app/cash",
    title: "Günlük kasa",
    text: "Satış kaydı ve günlük toplam.",
    icon: WalletCards
  },
  {
    href: "/app/stock",
    title: "Stokta kalan",
    text: "Stok takibi ve minimum uyarı.",
    icon: Boxes
  },
  {
    href: "/app/products",
    title: "Ürünler",
    text: "Barkod, fiyat ve ürün bilgileri.",
    icon: Store
  },
  {
    href: "/app/reports",
    title: "Raporlar",
    text: "Sorgu, satış ve stok özeti.",
    icon: ChartNoAxesCombined
  },
  {
    href: "/app/settings",
    title: "Ayarlar",
    text: "İşletme ve kullanıcı ayarları.",
    icon: Settings
  }
];

export default function CustomerAppPage() {
  return (
    <main className="workspace-page">
      <section className="workspace-hero">
        <span className="status-line">Müşteri uygulaması</span>
        <h1>Bu ne kadar?</h1>
        <p>
          Gerçek müşteri akışı Supabase Auth, aktif lisans ve paket yetkileri
          bağlandıktan sonra açılacak.
        </p>
      </section>
      <section className="workspace-grid">
        {routes.map((route) => (
          <Link className="card route-card" href={route.href} key={route.href}>
            <route.icon size={28} color="var(--green)" aria-hidden="true" />
            <h3>{route.title}</h3>
            <p>{route.text}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
