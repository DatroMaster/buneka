"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ScanBarcode, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import type { Tables } from "@buneka/database";

type AppUser = Pick<Tables<"app_users">, "id" | "organization_id" | "store_id">;
type Product = Tables<"products">;

export default function FiyatSorgulaPage() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const [stats, setStats] = useState({ queries: 0, sales: 0, revenue: 0 });
  const [appUser, setAppUser] = useState<AppUser | null>(null);

  const loadUserAndStats = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await supabase
      .from("app_users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();
    
    setAppUser(userData);

    if (userData) {
      // Load today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: queryCount } = await supabase
        .from("price_queries")
        .select("*", { count: 'exact', head: true })
        .eq("organization_id", userData.organization_id)
        .gte("queried_at", today.toISOString());

      const { data: salesData } = await supabase
        .from("sales")
        .select("total_amount")
        .eq("organization_id", userData.organization_id)
        .gte("sale_time", today.toISOString());

      setStats({
        queries: queryCount || 0,
        sales: salesData?.length || 0,
        revenue: salesData?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0
      });
    }
  }, [supabase]);

  useEffect(() => {
    inputRef.current?.focus();
    void Promise.resolve().then(loadUserAndStats);
  }, [loadUserAndStats]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim() || !appUser) return;
    
    setLoading(true);
    setError("");
    setProduct(null);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("organization_id", appUser.organization_id)
      .eq("barcode", barcode.trim())
      .single();

    if (error || !data) {
      setError("Ürün bulunamadı");
    } else {
      setProduct(data);
      // Log query
      await supabase.from("price_queries").insert({
        organization_id: appUser.organization_id,
        store_id: appUser.store_id,
        product_id: data.id,
        barcode: data.barcode,
        user_id: appUser.id,
        source: 'manual'
      });
      loadUserAndStats();
    }
    
    setLoading(false);
  };

  const handleSale = async () => {
    if (!product || !appUser) return;

    const profit = (product.sale_price - (product.purchase_price || 0));

    // 1. Create Sale
    const { data: saleData } = await supabase.from("sales").insert({
      organization_id: appUser.organization_id,
      store_id: appUser.store_id,
      user_id: appUser.id,
      total_amount: product.sale_price,
      total_profit: profit,
      payment_type: 'cash'
    }).select().single();

    if (saleData) {
      // 2. Create Sale Item
      await supabase.from("sale_items").insert({
        sale_id: saleData.id,
        product_id: product.id,
        quantity: 1,
        sale_price: product.sale_price,
        purchase_price: product.purchase_price,
        profit: profit
      });

      // 3. Update Stock
      await supabase.from("products").update({
        stock_quantity: product.stock_quantity - 1
      }).eq("id", product.id);

      // 4. Record Stock Movement
      await supabase.from("stock_movements").insert({
        organization_id: appUser.organization_id,
        store_id: appUser.store_id,
        product_id: product.id,
        movement_type: 'sale',
        quantity: -1,
        unit_price: product.sale_price,
        note: 'Satış'
      });

      setProduct(null);
      setBarcode("");
      inputRef.current?.focus();
      loadUserAndStats();
    }
  };

  const handleCancel = () => {
    setProduct(null);
    setBarcode("");
    inputRef.current?.focus();
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Fiyat Sorgula</h1>
        <p className="text-[#8A9B8E]">Barkodu okutun veya manuel girin.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ScanBarcode size={24} className="text-[#8A9B8E]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full bg-[#243328] border-2 border-[#2F4A35] rounded-2xl py-6 pl-12 pr-4 text-2xl text-white font-bold placeholder-[#8A9B8E]/50 focus:outline-none focus:border-[#4F6F52] focus:ring-4 focus:ring-[#4F6F52]/20 transition-all"
            placeholder="Barkod okutun..."
            autoComplete="off"
            disabled={loading}
          />
          <button type="submit" className="hidden">Ara</button>
        </div>
      </form>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
        {loading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F6F52]"></div>
        ) : error ? (
          <div className="text-center p-8 bg-[#243328] rounded-3xl border border-[#B65A3C]/30 w-full max-w-md">
            <AlertCircle size={48} className="text-[#B65A3C] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
            <button className="mt-4 flex items-center justify-center gap-2 w-full bg-[#4F6F52] hover:bg-[#3F5941] text-white py-3 rounded-xl font-semibold transition-colors">
              <Plus size={20} /> Yeni Ürün Ekle
            </button>
          </div>
        ) : product ? (
          <div className="bg-[#243328] rounded-3xl p-8 w-full max-w-md border border-[#2F4A35] shadow-2xl">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-[#4F6F52]/20 text-[#4F6F52] rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                {product.category || 'Kategorisiz'}
              </span>
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{product.name}</h2>
              <p className="text-sm text-[#8A9B8E] font-mono">{product.barcode}</p>
            </div>
            
            <div className="flex justify-center mb-8">
              <span className="text-6xl font-extrabold text-[#C8913A] tracking-tighter">
                {formatMoney(product.sale_price)}
              </span>
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-[#1A2B1E] rounded-xl mb-8">
              <span className="text-[#8A9B8E] font-medium">Stok Durumu</span>
              <span className={`font-bold text-lg ${product.stock_quantity <= product.min_stock ? 'text-[#B65A3C]' : 'text-white'}`}>
                {product.stock_quantity} Adet
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSale}
                className="w-full flex items-center justify-center gap-2 bg-[#3F7D53] hover:bg-[#2F5E3E] text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-[#3F7D53]/20"
              >
                <CheckCircle2 size={24} /> Satış Yapıldı
              </button>
              <button
                onClick={handleCancel}
                className="w-full py-4 rounded-xl font-bold text-lg text-[#E8EDE9] bg-[#2F4A35] hover:bg-[#3A5A42] transition-colors"
              >
                Ana Ekrana Dön
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-[#8A9B8E] flex flex-col items-center">
            <ScanBarcode size={64} className="mb-4 opacity-20" />
            <p className="text-lg">Sorgulama yapmak için barkod okutun.</p>
          </div>
        )}
      </div>

      {/* Daily Summary Strip */}
      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[#2F4A35] pt-6">
        <div className="bg-[#243328] rounded-xl p-4 border border-[#2F4A35]">
          <p className="text-sm text-[#8A9B8E] mb-1">Bugün Satış</p>
          <p className="text-xl font-bold text-white">{stats.sales}</p>
        </div>
        <div className="bg-[#243328] rounded-xl p-4 border border-[#2F4A35]">
          <p className="text-sm text-[#8A9B8E] mb-1">Bugün Kasa</p>
          <p className="text-xl font-bold text-[#4F6F52]">{formatMoney(stats.revenue)}</p>
        </div>
        <div className="bg-[#243328] rounded-xl p-4 border border-[#2F4A35]">
          <p className="text-sm text-[#8A9B8E] mb-1">Bugün Sorgu</p>
          <p className="text-xl font-bold text-[#C8913A]">{stats.queries}</p>
        </div>
      </div>
    </div>
  );
}
