"use client";

import type { Tables } from "@buneka/database";
import { AlertTriangle, Building2, KeyRound, Loader2, ScanBarcode, TrendingUp, WalletCards } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/app/app/_components/PageHeader";

type Organization = Tables<"organizations">;
type LicenseWithRelations = Tables<"licenses"> & {
  plans: Pick<Tables<"plans">, "name"> | null;
  organizations: Pick<Tables<"organizations">, "name"> | null;
};

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [salesByOrg, setSalesByOrg] = useState<Record<string, number>>({});
  const [queriesByOrg, setQueriesByOrg] = useState<Record<string, number>>({});
  const [licenses, setLicenses] = useState<LicenseWithRelations[]>([]);
  const supabase = useMemo(() => createClient(), []);

  const loadData = useCallback(async () => {
    setLoading(true);

    const [{ data: orgs }, { data: sales }, { data: queries }, { data: licenseRows }] = await Promise.all([
      supabase.from("organizations").select("*"),
      supabase.from("sales").select("organization_id, total_amount"),
      supabase.from("price_queries").select("organization_id"),
      supabase
        .from("licenses")
        .select("*, plans(name), organizations(name)")
        .eq("status", "active")
        .order("expires_at", { ascending: true }),
    ]);

    if (orgs) setOrganizations(orgs);

    if (sales) {
      const totals: Record<string, number> = {};
      for (const sale of sales) {
        totals[sale.organization_id] = (totals[sale.organization_id] || 0) + Number(sale.total_amount);
      }
      setSalesByOrg(totals);
    }

    if (queries) {
      const counts: Record<string, number> = {};
      for (const query of queries) {
        counts[query.organization_id] = (counts[query.organization_id] || 0) + 1;
      }
      setQueriesByOrg(counts);
    }

    if (licenseRows) setLicenses(licenseRows as LicenseWithRelations[]);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  const totalPlatformSales = Object.values(salesByOrg).reduce((sum, value) => sum + value, 0);
  const totalPlatformQueries = Object.values(queriesByOrg).reduce((sum, value) => sum + value, 0);

  const topBySales = [...organizations]
    .filter((org) => salesByOrg[org.id])
    .sort((a, b) => (salesByOrg[b.id] || 0) - (salesByOrg[a.id] || 0))
    .slice(0, 8);

  const topByQueries = [...organizations]
    .filter((org) => queriesByOrg[org.id])
    .sort((a, b) => (queriesByOrg[b.id] || 0) - (queriesByOrg[a.id] || 0))
    .slice(0, 8);

  const soon = new Date();
  soon.setDate(soon.getDate() + 30);
  const expiringLicenses = licenses.filter((license) => new Date(license.expires_at) <= soon);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Analitik" subtitle="Platform genelinde kullanım ve satış özetleri." />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="stat-card">
          <div className="stat-card-icon bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Toplam İşletme</p>
            <p className="text-2xl font-black text-cyan-600 dark:text-cyan-300">{organizations.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <WalletCards size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Platform Satış Hacmi</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-300">{formatMoney(totalPlatformSales)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
            <ScanBarcode size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Toplam Sorgu</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{totalPlatformQueries}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">30 Gün İçinde Bitecek</p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-300">{expiringLicenses.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="data-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <TrendingUp size={18} className="text-emerald-500" />
            <h2 className="font-display text-base font-black text-slate-950 dark:text-slate-50">
              En Çok Satış Yapan İşletmeler
            </h2>
          </div>
          {topBySales.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Henüz satış verisi yok.</p>
          ) : (
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topBySales.map((org, index) => (
                  <tr key={org.id}>
                    <td className="w-8 px-6 py-3 text-sm font-black text-slate-400">{index + 1}</td>
                    <td className="px-2 py-3 font-medium text-slate-800 dark:text-slate-200">{org.name}</td>
                    <td className="px-6 py-3 text-right font-black text-emerald-600 dark:text-emerald-300">
                      {formatMoney(salesByOrg[org.id] || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="data-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <ScanBarcode size={18} className="text-amber-500" />
            <h2 className="font-display text-base font-black text-slate-950 dark:text-slate-50">
              En Çok Sorgulama Yapan İşletmeler
            </h2>
          </div>
          {topByQueries.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Henüz sorgu verisi yok.</p>
          ) : (
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topByQueries.map((org, index) => (
                  <tr key={org.id}>
                    <td className="w-8 px-6 py-3 text-sm font-black text-slate-400">{index + 1}</td>
                    <td className="px-2 py-3 font-medium text-slate-800 dark:text-slate-200">{org.name}</td>
                    <td className="px-6 py-3 text-right font-black text-amber-600 dark:text-amber-300">
                      {queriesByOrg[org.id] || 0} sorgu
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="data-card overflow-hidden lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <KeyRound size={18} className="text-rose-500" />
            <h2 className="font-display text-base font-black text-slate-950 dark:text-slate-50">
              Yakında Bitecek Lisanslar (30 gün)
            </h2>
          </div>
          {expiringLicenses.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Yakında bitecek lisans yok.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-3 font-medium">İşletme</th>
                  <th className="px-6 py-3 font-medium">Paket</th>
                  <th className="px-6 py-3 text-right font-medium">Bitiş Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expiringLicenses.map((license) => (
                  <tr key={license.id}>
                    <td className="px-6 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {license.organizations?.name}
                    </td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{license.plans?.name}</td>
                    <td className="px-6 py-3 text-right font-bold text-rose-600 dark:text-rose-300">
                      {new Date(license.expires_at).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
