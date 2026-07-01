"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Boxes, Plus, AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StokPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: appUser } = await supabase
      .from("app_users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (appUser) {
      const { data } = await supabase
        .from("stock_movements")
        .select(`
          *,
          products (name, barcode)
        `)
        .eq("organization_id", appUser.organization_id)
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (data) setMovements(data);
    }
    setLoading(false);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  const getMovementLabel = (type: string) => {
    switch(type) {
      case 'sale': return { label: 'Satış Çıkışı', color: 'text-[#B65A3C]', icon: ArrowDownRight };
      case 'purchase': return { label: 'Stok Girişi', color: 'text-[#3F7D53]', icon: ArrowUpRight };
      case 'adjustment': return { label: 'Düzeltme', color: 'text-[#C8913A]', icon: AlertTriangle };
      case 'return': return { label: 'İade Girişi', color: 'text-[#3F7D53]', icon: ArrowUpRight };
      default: return { label: type, color: 'text-white', icon: Boxes };
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Stok Hareketleri</h1>
          <p className="text-[#8A9B8E]">Tüm depo giriş ve çıkışları.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4F6F52] text-white rounded-xl hover:bg-[#3F5941] transition-colors shadow-lg shadow-[#4F6F52]/20">
          <Plus size={18} /> Yeni Stok Girişi
        </button>
      </div>

      <div className="bg-[#243328] rounded-2xl border border-[#2F4A35] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1A2B1E] text-[#8A9B8E] text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Tarih</th>
                <th className="px-6 py-4 font-medium">Ürün</th>
                <th className="px-6 py-4 font-medium">İşlem Tipi</th>
                <th className="px-6 py-4 font-medium">Miktar</th>
                <th className="px-6 py-4 font-medium">Not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F4A35]">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6F52]"></div></td></tr>
              ) : movements.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[#8A9B8E]">Hareket bulunamadı.</td></tr>
              ) : (
                movements.map((m) => {
                  const mType = getMovementLabel(m.movement_type);
                  const Icon = mType.icon;
                  return (
                    <tr key={m.id} className="hover:bg-[#1A2B1E] transition-colors">
                      <td className="px-6 py-4 text-[#8A9B8E] text-sm whitespace-nowrap">
                        {formatTime(m.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{m.products?.name}</div>
                        <div className="text-[#8A9B8E] text-xs font-mono">{m.products?.barcode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${mType.color}`}>
                          <Icon size={16} />
                          {mType.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-bold text-lg">
                        {Number(m.quantity) > 0 ? `+${m.quantity}` : m.quantity}
                      </td>
                      <td className="px-6 py-4 text-[#8A9B8E] text-sm">
                        {m.note || '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
