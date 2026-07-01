"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Plus, AlertTriangle } from "lucide-react";
import type { Tables } from "@buneka/database";

type AppUser = Pick<Tables<"app_users">, "organization_id">;
type Product = Tables<"products">;

export default function UrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const loadProducts = useCallback(async () => {
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
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("organization_id", currentUser.organization_id)
        .order("name");
      
      if (data) setProducts(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadProducts);
  }, [loadProducts]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.barcode.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ürünler</h1>
          <p className="text-[#8A9B8E]">Tüm ürünlerinizi yönetin.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#243328] text-white border border-[#2F4A35] rounded-xl hover:bg-[#2F4A35] transition-colors">
            Toplu Fiyat Güncelle
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4F6F52] text-white rounded-xl hover:bg-[#3F5941] transition-colors shadow-lg shadow-[#4F6F52]/20">
            <Plus size={18} /> Yeni Ürün
          </button>
        </div>
      </div>

      <div className="bg-[#243328] rounded-2xl border border-[#2F4A35] overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        <div className="p-4 border-b border-[#2F4A35]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9B8E]" size={20} />
            <input
              type="text"
              placeholder="Ürün adı veya barkod ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A2B1E] border border-[#2F4A35] rounded-xl py-2 pl-10 pr-4 text-white placeholder-[#8A9B8E] focus:outline-none focus:border-[#4F6F52]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1A2B1E] sticky top-0 z-10">
              <tr className="text-[#8A9B8E] text-sm">
                <th className="px-6 py-3 font-medium">Barkod / Ürün Adı</th>
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 font-medium text-right">Alış Fiyatı</th>
                <th className="px-6 py-3 font-medium text-right">Satış Fiyatı</th>
                <th className="px-6 py-3 font-medium text-right">Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F4A35]">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6F52]"></div></td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[#8A9B8E]">Ürün bulunamadı.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#1A2B1E] transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{product.name}</div>
                      <div className="text-[#8A9B8E] text-xs font-mono">{product.barcode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-[#1A2B1E] rounded-lg text-xs text-[#8A9B8E]">
                        {product.category || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#8A9B8E] text-sm">
                      {product.purchase_price ? formatMoney(Number(product.purchase_price)) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">
                      {formatMoney(Number(product.sale_price))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {Number(product.stock_quantity) <= Number(product.min_stock) && (
                          <AlertTriangle size={14} className="text-[#B65A3C]" />
                        )}
                        <span className={`font-bold ${Number(product.stock_quantity) <= Number(product.min_stock) ? 'text-[#B65A3C]' : 'text-white'}`}>
                          {product.stock_quantity}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
