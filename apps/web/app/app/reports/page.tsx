import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";

export default function ReportsPage() {
  return (
    <main className="workspace-page">
      <section className="workspace-hero">
        <span className="status-line">reports</span>
        <h1>Raporlar</h1>
        <p>Fiyat sorgusu, satış ve stok özetlerini tek yerde görün.</p>
        <Link className="button button-primary" href="/app/raporlar">
          <BarChart3 size={20} aria-hidden="true" />
          Rapor Panelini Aç
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
