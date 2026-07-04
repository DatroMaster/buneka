"use client";

import type { Tables } from "@buneka/database";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  Boxes,
  Package,
  Plus,
  ScanBarcode,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "../_components/PageHeader";
import { EmptyState } from "../_components/EmptyState";
import { QuickLinks } from "../_components/QuickLinks";

type AppUser = Pick<Tables<"app_users">, "organization_id" | "store_id">;
type Product = Pick<Tables<"products">, "id" | "name" | "barcode" | "stock_quantity">;
type StockMovementWithProduct = Tables<"stock_movements"> & {
  products: Pick<Tables<"products">, "name" | "barcode"> | null;
};

export default function StokPage() {
  const [movements, setMovements] = useState<StockMovementWithProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showEntry, setShowEntry] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [note, setNote] = useState("");
  const [sortKey, setSortKey] = useState<"date" | "product" | "quantity">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const supabase = useMemo(() => createClient(), []);

  function toggleSort(key: "date" | "product" | "quantity") {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "product" ? "asc" : "desc");
    }
  }

  const sortedMovements = useMemo(() => {
    const factor = sortDir === "asc" ? 1 : -1;
    return [...movements].sort((a, b) => {
      if (sortKey === "product") {
        return factor * (a.products?.name || "").localeCompare(b.products?.name || "", "tr");
      }
      if (sortKey === "quantity") {
        return factor * (Number(a.quantity) - Number(b.quantity));
      }
      return factor * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });
  }, [movements, sortKey, sortDir]);

  const stockEntryTotal = movements
    .filter((movement) => Number(movement.quantity) > 0)
    .reduce((sum, movement) => sum + Number(movement.quantity), 0);
  const stockExitTotal = movements
    .filter((movement) => Number(movement.quantity) < 0)
    .reduce((sum, movement) => sum + Math.abs(Number(movement.quantity)), 0);

  const loadData = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: foundUser } = await supabase
      .from("app_users")
      .select("organization_id, store_id")
      .eq("auth_user_id", user.id)
      .single();

    if (foundUser) {
      const currentUser = foundUser as AppUser;
      setAppUser(currentUser);

      const [{ data: movementData }, { data: productData }] = await Promise.all([
        supabase
          .from("stock_movements")
          .select("*, products (name, barcode)")
          .eq("organization_id", currentUser.organization_id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("products")
          .select("id, name, barcode, stock_quantity")
          .eq("organization_id", currentUser.organization_id)
          .order("name"),
      ]);

      if (movementData) setMovements(movementData as StockMovementWithProduct[]);
      if (productData) setProducts(productData);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  async function createStockEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!appUser || !productId) return;

    const selectedProduct = products.find((product) => product.id === productId);
    const parsedQuantity = Number(quantity);

    if (!selectedProduct || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setMessage("Lütfen ürün ve geçerli miktar seçin.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error: movementError } = await supabase.from("stock_movements").insert({
      organization_id: appUser.organization_id,
      store_id: appUser.store_id,
      product_id: selectedProduct.id,
      movement_type: "purchase",
      quantity: parsedQuantity,
      unit_price: unitPrice ? Number(unitPrice) : null,
      note: note.trim() || "Stok girişi",
    });

    if (movementError) {
      setMessage(`Stok girişi kaydedilemedi: ${movementError.message}`);
      setSaving(false);
      return;
    }

    const { error: productError } = await supabase
      .from("products")
      .update({
        stock_quantity: Number(selectedProduct.stock_quantity) + parsedQuantity,
      })
      .eq("id", selectedProduct.id);

    if (productError) {
      setMessage(`Stok miktarı güncellenemedi: ${productError.message}`);
    } else {
      setMessage("Stok girişi kaydedildi.");
      setProductId("");
      setQuantity("");
      setUnitPrice("");
      setNote("");
      setShowEntry(false);
      await loadData();
    }

    setSaving(false);
  }

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getMovementLabel = (type: string) => {
    switch (type) {
      case "sale":
        return { label: "Satış çıkışı", color: "text-amber-600", icon: ArrowDownRight };
      case "purchase":
        return { label: "Stok girişi", color: "text-emerald-600", icon: ArrowUpRight };
      case "adjustment":
        return { label: "Düzeltme", color: "text-amber-500", icon: AlertTriangle };
      case "return":
        return { label: "İade girişi", color: "text-emerald-600", icon: ArrowUpRight };
      default:
        return { label: type, color: "text-slate-950 dark:text-slate-50", icon: Boxes };
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Stok Hareketleri"
        subtitle="Tüm depo giriş ve çıkışlarını takip edin."
        action={
          <button className="premium-button-primary" type="button" onClick={() => setShowEntry(true)}>
            <Plus size={18} /> Yeni Stok Girişi
          </button>
        }
      />
      <QuickLinks
        links={[
          { href: "/app", label: "Fiyat Sorgula", icon: ScanBarcode },
          { href: "/app/urunler", label: "Ürünler", icon: Package },
          { href: "/app/kasa", label: "Günlük Kasa", icon: WalletCards },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="data-card border-emerald-400/45 bg-[#050505] p-4 text-white shadow-[0_0_0_1px_rgba(62,207,142,0.12),0_18px_54px_rgba(0,0,0,0.28)]">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
            <Boxes size={15} /> Hareket Defteri
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Stok Takibi sayfası ürün kartı açmak için değil, depoya giren ve satışla çıkan miktarları izlemek içindir.
          </p>
        </div>
        <div className="stat-card border-emerald-400/30 bg-[#050505] text-white">
          <div className="stat-card-icon bg-emerald-400/12 text-emerald-300">
            <ArrowUpRight size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Toplam Giriş</p>
            <p className="text-2xl font-black text-emerald-300">+{stockEntryTotal}</p>
          </div>
        </div>
        <div className="stat-card border-amber-400/30 bg-[#050505] text-white">
          <div className="stat-card-icon bg-amber-400/12 text-amber-300">
            <ArrowDownRight size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Toplam Çıkış</p>
            <p className="text-2xl font-black text-amber-300">-{stockExitTotal}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
          {message}
        </div>
      )}

      <div className="data-card overflow-hidden border-white/10 bg-[#050505] text-white shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#020202] text-sm text-slate-300 shadow-[inset_0_-1px_0_rgba(62,207,142,0.22)]">
              <tr>
                <SortableHeader label="Tarih" active={sortKey === "date"} dir={sortDir} onClick={() => toggleSort("date")} />
                <SortableHeader label="Ürün" active={sortKey === "product"} dir={sortDir} onClick={() => toggleSort("product")} />
                <th className="px-6 py-4 font-medium">İşlem Tipi</th>
                <SortableHeader label="Miktar" align="left" active={sortKey === "quantity"} dir={sortDir} onClick={() => toggleSort("quantity")} />
                <th className="px-6 py-4 font-medium">Not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#050505]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-400" />
                  </td>
                </tr>
              ) : sortedMovements.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={Boxes} message="Hareket bulunamadı." />
                  </td>
                </tr>
              ) : (
                sortedMovements.map((movement) => {
                  const movementType = getMovementLabel(movement.movement_type);
                  const Icon = movementType.icon;
                  return (
                    <tr
                      key={movement.id}
                      className={`stock-movement-row ${
                        Number(movement.quantity) >= 0 ? "stock-movement-entry" : "stock-movement-exit"
                      }`}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                        {formatTime(movement.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{movement.products?.name}</div>
                        <div className="font-mono text-xs text-slate-400">{movement.products?.barcode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${movementType.color}`}>
                          <Icon size={16} />
                          {movementType.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-lg font-black text-white">
                        {Number(movement.quantity) > 0 ? `+${movement.quantity}` : movement.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{movement.note || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEntry && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-bg)] p-6 text-slate-950 shadow-2xl dark:text-slate-50">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-black">Yeni Stok Girişi</h2>
              <button
                className="rounded-full bg-white p-2 text-slate-950 transition-transform active:scale-90 dark:bg-slate-800 dark:text-slate-50"
                type="button"
                onClick={() => setShowEntry(false)}
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            <form className="grid gap-4" onSubmit={createStockEntry}>
              <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
                Ürün
                <select
                  className="premium-input"
                  value={productId}
                  onChange={(event) => setProductId(event.target.value)}
                  required
                >
                  <option value="">Ürün seçin</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.barcode}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Miktar" value={quantity} onChange={setQuantity} required />
                <FormInput label="Birim fiyat" value={unitPrice} onChange={setUnitPrice} />
              </div>
              <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
                Not
                <textarea
                  className="premium-input min-h-24 resize-none"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Tedarikçi, fatura veya kısa not"
                />
              </label>
              <button className="premium-button-primary mt-2" type="submit" disabled={saving}>
                Stok Girişini Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SortableHeader({
  label,
  active,
  dir,
  onClick,
  align = "left",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <th className="px-6 py-4 font-medium">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1 transition-colors hover:text-cyan-600 dark:hover:text-cyan-300 ${
          align === "right" ? "ml-auto flex-row-reverse" : ""
        } ${active ? "text-cyan-600 dark:text-cyan-300" : ""}`}
      >
        {label}
        {active ? (
          <ArrowUp size={13} className={`transition-transform ${dir === "desc" ? "rotate-180" : ""}`} />
        ) : (
          <ArrowUpDown size={13} className="text-slate-300 dark:text-slate-600" />
        )}
      </button>
    </th>
  );
}

function FormInput({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
      {label}
      <input
        className="premium-input"
        type="number"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}
