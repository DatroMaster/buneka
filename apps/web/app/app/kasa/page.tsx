"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WalletCards, TrendingUp, Package, Activity } from "lucide-react";
import type { Tables } from "@buneka/database";

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
    queryCount: 0
  });
  
  const supabase = useMemo(() => createClient(), []);

  const loadKasaData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: appUser } = await supabase
      .from("app_users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (appUser) {
      const currentUser = appUser as AppUser;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      // Get Sales
      const { data: salesData } = await supabase
        .from("sales")
        .select(`
          *,
          sale_items (
            quantity,
            sale_price,
            products (name)
          )
        `)
        .eq("organization_id", currentUser.organization_id)
        .gte("sale_time", todayStr)
        .order("sale_time", { ascending: false });

      // Get Queries
      const { count: queryCount } = await supabase
        .from("price_queries")
        .select("*", { count: 'exact', head: true })
        .eq("organization_id", currentUser.organization_id)
        .gte("queried_at", todayStr);

      if (salesData) {
        const typedSales = salesData as SaleWithItems[];
        setSales(typedSales);
        
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

        setStats({
          totalAmount: amount,
          totalProfit: profit,
          itemCount: items,
          queryCount: queryCount || 0
        });
      }
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadKasaData);
  }, [loadKasaData]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6F52]"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Günlük Kasa</h1>
        <p className="text-[#8A9B8E]">Bugünkü satışlarınız ve kasa durumunuz.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#243328] rounded-2xl p-6 border border-[#2F4A35]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#4F6F52]/20 flex items-center justify-center text-[#4F6F52]">
              <WalletCards size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#8A9B8E]">Toplam Kasa</p>
              <p className="text-2xl font-bold text-white">{formatMoney(stats.totalAmount)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#243328] rounded-2xl p-6 border border-[#2F4A35]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#3F7D53]/20 flex items-center justify-center text-[#3F7D53]">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#8A9B8E]">Tahmini Kâr</p>
              <p className="text-2xl font-bold text-[#3F7D53]">{formatMoney(stats.totalProfit)}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#243328] rounded-2xl p-6 border border-[#2F4A35]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#C8913A]/20 flex items-center justify-center text-[#C8913A]">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#8A9B8E]">Satılan Ürün</p>
              <p className="text-2xl font-bold text-white">{stats.itemCount} Adet</p>
            </div>
          </div>
        </div>

        <div className="bg-[#243328] rounded-2xl p-6 border border-[#2F4A35]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#B65A3C]/20 flex items-center justify-center text-[#B65A3C]">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#8A9B8E]">Toplam Sorgu</p>
              <p className="text-2xl font-bold text-white">{stats.queryCount} Kez</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-[#243328] rounded-2xl border border-[#2F4A35] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2F4A35]">
          <h2 className="text-lg font-bold text-white">Son Satışlar</h2>
        </div>
        
        {sales.length === 0 ? (
          <div className="p-8 text-center text-[#8A9B8E]">
            Henüz satış yapılmadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1A2B1E] text-[#8A9B8E] text-sm">
                  <th className="px-6 py-3 font-medium">Saat</th>
                  <th className="px-6 py-3 font-medium">Ürün(ler)</th>
                  <th className="px-6 py-3 font-medium">Ödeme</th>
                  <th className="px-6 py-3 font-medium text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2F4A35]">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#1A2B1E] transition-colors">
                    <td className="px-6 py-4 text-white text-sm">
                      {formatTime(sale.sale_time)}
                    </td>
                    <td className="px-6 py-4">
                      {sale.sale_items?.map((item, i) => (
                        <div key={i} className="text-sm text-white">
                          {item.quantity}x {item.products?.name || 'Bilinmeyen Ürün'}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-[#8A9B8E] text-sm">
                      {sale.payment_type === 'cash' ? 'Nakit' : sale.payment_type}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#4F6F52]">
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
