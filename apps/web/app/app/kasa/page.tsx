"use client";

import type { Tables } from "@buneka/database";
import { Activity, Package, TrendingUp, WalletCards } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AppUser = Pick<Tables<"app_users">, "organization_id">;
type SaleItemWithProduct = Pick<Tables<"sale_items">, "quantity" | "sale_price"> & {
  products: Pick<Tables<"products">, "name"> | null;
};
type SaleWithItems = Tables<"sales"> & {
  sale_items: SaleItemWithProduct[] | null;
};

export default function KasaPage() {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<SaleWithItems[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalProfit: 0,
    itemCount: 0,
    queryCount: 0,
  });
  const supabase = useMemo(() => createClient(), []);

  const loadKasaData = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: appUser } = await supabase
      .from("app_users")
      .select("organization_id")
      .eq("auth_user_id", user.id)
      .single();

    if (appUser) {
      const currentUser = appUser as AppUser;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      const [{ data: salesData }, { count: queryCount }] = await Promise.all([
        supabase
          .from("sales")
          .select("*, sale_items (quantity, sale_price, products (name))")
          .eq("organization_id", currentUser.organization_id)
          .gte("sale_time", todayStr)
          .order("sale_time", { ascending: false }),
        supabase
          .from("price_queries")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", currentUser.organization_id)
          .gte("queried_at", todayStr),
      ]);

      if (salesData) {
        const typedSales = salesData as SaleWithItems[];
        let amount = 0;
        let profit = 0;
        let items = 0;

        typedSales.forEach((sale) => {
          amount += Number(sale.total_amount);
          profit += Number(sale.total_profit);
          sale.sale_items?.forEach((item) => {
            items += Number(item.quantity);
          });
        });

        setSales(typedSales);
        setStats({
          totalAmount: amount,
          totalProfit: profit,
          itemCount: items,
          queryCount: queryCount || 0,
        });
      }
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadKasaData);
  }, [loadKasaData]);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Günlük Kasa</h1>
        <p className="text-slate-600">Bugünkü satışlarınız ve kasa durumunuz.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={WalletCards} label="Toplam Kasa" value={formatMoney(stats.totalAmount)} />
        <StatCard icon={TrendingUp} label="Tahmini Kâr" value={formatMoney(stats.totalProfit)} tone="text-emerald-600" />
        <StatCard icon={Package} label="Satılan Ürün" value={`${stats.itemCount} Adet`} tone="text-orange-500" />
        <StatCard icon={Activity} label="Toplam Sorgu" value={`${stats.queryCount} Kez`} tone="text-cyan-600" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-black text-slate-950">Son Satışlar</h2>
        </div>

        {sales.length === 0 ? (
          <div className="p-8 text-center text-slate-600">Henüz satış yapılmadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-sm text-slate-600">
                  <th className="px-6 py-3 font-medium">Saat</th>
                  <th className="px-6 py-3 font-medium">Ürünler</th>
                  <th className="px-6 py-3 font-medium">Ödeme</th>
                  <th className="px-6 py-3 text-right font-medium">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sales.map((sale) => (
                  <tr key={sale.id} className="transition-colors hover:bg-cyan-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{formatTime(sale.sale_time)}</td>
                    <td className="px-6 py-4">
                      {sale.sale_items?.map((item, index) => (
                        <div key={`${sale.id}-${index}`} className="text-sm font-medium text-slate-800">
                          {item.quantity}x {item.products?.name || "Bilinmeyen Ürün"}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {sale.payment_type === "cash" ? "Nakit" : sale.payment_type}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      {formatMoney(Number(sale.total_amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "text-cyan-600",
}: {
  icon: typeof WalletCards;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 ring-1 ring-cyan-100 ${tone}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className={`text-2xl font-black ${tone}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
