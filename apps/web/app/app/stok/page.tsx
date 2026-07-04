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
type Product = Pick<
  Tables<"products">,
  "id" | "name" | "barcode" | "created_at" | "purchase_price" | "stock_quantity" | "supplier"
>;
type StockMovementWithProduct = Tables<"stock_movements"> & {
  products: Pick<Tables<"products">, "id" | "name" | "barcode" | "created_at" | "purchase_price" | "stock_quantity" | "supplier"> | null;
};

type RemainingStockLot = {
  id: string;
  date: string;
  invoiceDate: string | null;
  note: string | null;
  originalQuantity: number;
  quantity: number;
  supplier: string | null;
  unitPrice: number | null;
};

type StockAgeRow = {
  latestEntryDate: string | null;
  oldestDate: string;
  product: Product;
  remainingLots: RemainingStockLot[];
  stockDays: number;
};

const DAY_MS = 1000 * 60 * 60 * 24;

function daysBetween(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / DAY_MS));
}

function parseInvoiceMeta(note: string | null) {
  if (!note) return { supplier: null, invoiceDate: null };
  const parts = note.split("·").map((part) => part.trim()).filter(Boolean);
  if (parts[0]?.toLocaleLowerCase("tr-TR").includes("fatura")) {
    return {
      supplier: parts[1] || null,
      invoiceDate: parts[2] || null,
    };
  }
  return { supplier: null, invoiceDate: null };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value);
}

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
  const [selectedHistoryProductId, setSelectedHistoryProductId] = useState<string | null>(null);
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

  const stockAgeRows = useMemo(() => {
    const byProduct = new Map<string, StockMovementWithProduct[]>();
    movements.forEach((movement) => {
      if (!movement.product_id) return;
      const list = byProduct.get(movement.product_id) || [];
      list.push(movement);
      byProduct.set(movement.product_id, list);
    });

    return products
      .filter((product) => Number(product.stock_quantity) > 0)
      .map((product): StockAgeRow => {
        const productMovements = byProduct.get(product.id) || [];
        const entries = productMovements
          .filter((movement) => Number(movement.quantity) > 0)
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        let outgoing = productMovements
          .filter((movement) => Number(movement.quantity) < 0)
          .reduce((sum, movement) => sum + Math.abs(Number(movement.quantity)), 0);

        const remainingLots: RemainingStockLot[] = [];
        entries.forEach((entry) => {
          const originalQuantity = Number(entry.quantity) || 0;
          if (originalQuantity <= 0) return;
          const consumed = Math.min(outgoing, originalQuantity);
          outgoing -= consumed;
          const quantity = originalQuantity - consumed;
          if (quantity <= 0) return;
          const meta = parseInvoiceMeta(entry.note);
          remainingLots.push({
            id: entry.id,
            date: entry.created_at,
            invoiceDate: meta.invoiceDate,
            note: entry.note,
            originalQuantity,
            quantity,
            supplier: meta.supplier || product.supplier,
            unitPrice: entry.unit_price,
          });
        });

        if (remainingLots.length === 0) {
          remainingLots.push({
            id: `${product.id}-initial`,
            date: product.created_at,
            invoiceDate: null,
            note: product.supplier ? `Tedarikçi: ${product.supplier}` : "Ürün kaydı",
            originalQuantity: Number(product.stock_quantity) || 0,
            quantity: Number(product.stock_quantity) || 0,
            supplier: product.supplier,
            unitPrice: product.purchase_price,
          });
        }

        const oldestDate = remainingLots[0]?.date || product.created_at;
        const latestEntryDate = entries.at(-1)?.created_at || null;
        return {
          latestEntryDate,
          oldestDate,
          product,
          remainingLots,
          stockDays: daysBetween(oldestDate),
        };
      })
      .sort((a, b) => new Date(a.oldestDate).getTime() - new Date(b.oldestDate).getTime());
  }, [movements, products]);

  const stockAgeByProduct = useMemo(
    () => new Map(stockAgeRows.map((row) => [row.product.id, row])),
    [stockAgeRows]
  );
  const selectedHistoryRow = selectedHistoryProductId ? stockAgeByProduct.get(selectedHistoryProductId) || null : null;
  const selectedHistoryMovements = useMemo(
    () =>
      selectedHistoryProductId
        ? movements
            .filter((movement) => movement.product_id === selectedHistoryProductId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        : [],
    [movements, selectedHistoryProductId]
  );

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
          .select("*, products (id, name, barcode, created_at, purchase_price, stock_quantity, supplier)")
          .eq("organization_id", currentUser.organization_id)
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("products")
          .select("id, name, barcode, created_at, purchase_price, stock_quantity, supplier")
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
        return { label: "Satış çıkışı", color: "text-[#F59E0B]", icon: ArrowDownRight };
      case "purchase":
        return { label: "Stok girişi", color: "text-[#10B981]", icon: ArrowUpRight };
      case "adjustment":
        return { label: "Düzeltme", color: "text-[#F59E0B]", icon: AlertTriangle };
      case "return":
        return { label: "İade girişi", color: "text-[#10B981]", icon: ArrowUpRight };
      default:
        return { label: type, color: "text-[color:var(--color-text)]", icon: Boxes };
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
        <div className="data-card p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#00FF7B]">
            <Boxes size={15} /> Hareket Defteri
          </div>
          <p className="text-sm leading-6 text-[color:var(--color-muted)]">
            Stok Takibi sayfası ürün kartı açmak için değil, depoya giren ve satışla çıkan miktarları izlemek içindir.
          </p>
        </div>
        <div className="stat-card border-[#1E293B]">
          <div className="stat-card-icon bg-emerald-400/12 text-emerald-300">
            <ArrowUpRight size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-[color:var(--color-muted)]">Toplam Giriş</p>
            <p className="text-2xl font-black text-[#10B981]">+{stockEntryTotal}</p>
          </div>
        </div>
        <div className="stat-card border-[#1E293B]">
          <div className="stat-card-icon bg-[#F59E0B]/12 text-[#F59E0B]">
            <ArrowDownRight size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-[color:var(--color-muted)]">Toplam Çıkış</p>
            <p className="text-2xl font-black text-[#F59E0B]">-{stockExitTotal}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
          {message}
        </div>
      )}

      <div className="data-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0B0F19] text-sm text-[#CBD5E1] shadow-[inset_0_-1px_0_#1E293B]">
              <tr>
                <SortableHeader label="Tarih" active={sortKey === "date"} dir={sortDir} onClick={() => toggleSort("date")} />
                <SortableHeader label="Ürün" active={sortKey === "product"} dir={sortDir} onClick={() => toggleSort("product")} />
                <th className="px-6 py-4 font-medium">İşlem Tipi</th>
                <SortableHeader label="Miktar" align="left" active={sortKey === "quantity"} dir={sortDir} onClick={() => toggleSort("quantity")} />
                <th className="px-6 py-4 font-medium">Not</th>
              </tr>
            </thead>
            <tbody className="bg-[color:var(--color-card)]">
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
                  const ageRow = movement.product_id ? stockAgeByProduct.get(movement.product_id) : null;
                  return (
                    <tr
                      key={movement.id}
                      className={`stock-movement-row ${
                        Number(movement.quantity) >= 0 ? "stock-movement-entry" : "stock-movement-exit"
                      }`}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#CBD5E1]">
                        {formatTime(movement.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="text-left transition hover:opacity-85"
                          onClick={() => movement.product_id && setSelectedHistoryProductId(movement.product_id)}
                          disabled={!movement.product_id}
                        >
                          <div className="font-medium text-[#F8FAFC]">{movement.products?.name}</div>
                          <div className="font-mono text-xs text-[#64748B]">{movement.products?.barcode}</div>
                          {ageRow && (
                            <div className="mt-1 inline-flex rounded-full border border-[#F59E0B]/35 px-2 py-0.5 text-[11px] font-black text-[#F59E0B]">
                              En eski stok: {ageRow.stockDays} gün
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${movementType.color}`}>
                          <Icon size={16} />
                          {movementType.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-lg font-black text-[#F8FAFC]">
                        {Number(movement.quantity) > 0 ? `+${movement.quantity}` : movement.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#CBD5E1]">{movement.note || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedHistoryRow && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#334155] bg-[#1E293B] px-5 py-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#10B981]">Ürün tarihçesi</p>
                <h2 className="mt-1 font-display text-2xl font-black">{selectedHistoryRow.product.name}</h2>
                <p className="mt-1 font-mono text-xs font-semibold text-[#94A3B8]">{selectedHistoryRow.product.barcode}</p>
              </div>
              <button
                className="rounded-full border border-[#334155] bg-[#0F172A] p-2 text-[#CBD5E1] transition hover:border-[#FF6B00] hover:text-white active:scale-90"
                type="button"
                onClick={() => setSelectedHistoryProductId(null)}
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(88vh-96px)] overflow-y-auto p-5">
              <div className="grid gap-3 sm:grid-cols-4">
                <StockAgeMetric label="Stoktaki gün" value={`${selectedHistoryRow.stockDays}`} tone="amber" />
                <StockAgeMetric label="Mevcut stok" value={`${selectedHistoryRow.product.stock_quantity}`} />
                <StockAgeMetric label="En eski giriş" value={formatDate(selectedHistoryRow.oldestDate)} />
                <StockAgeMetric
                  label="Son giriş"
                  value={selectedHistoryRow.latestEntryDate ? formatDate(selectedHistoryRow.latestEntryDate) : "-"}
                />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <section>
                  <h3 className="text-sm font-black uppercase tracking-wide text-[#CBD5E1]">Kalan parti / fatura detayı</h3>
                  <div className="mt-3 space-y-2">
                    {selectedHistoryRow.remainingLots.map((lot) => (
                      <div key={lot.id} className="rounded-xl border border-[#334155] bg-[#1E293B] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-[#F8FAFC]">{formatDate(lot.date)}</p>
                            <p className="mt-1 text-xs font-semibold text-[#CBD5E1]">
                              {lot.supplier ? `Alınan firma: ${lot.supplier}` : "Firma bilgisi yok"}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-black text-[#10B981]">
                            {lot.quantity} adet
                          </span>
                        </div>
                        <div className="mt-3 grid gap-1 text-xs font-semibold text-[#94A3B8]">
                          <span>İlk giriş miktarı: {lot.originalQuantity}</span>
                          <span>Alış fiyatı: {lot.unitPrice != null ? formatMoney(Number(lot.unitPrice)) : "-"}</span>
                          <span>Fatura tarihi: {lot.invoiceDate || "-"}</span>
                          <span>Not: {lot.note || "-"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-black uppercase tracking-wide text-[#CBD5E1]">Stok hareket tarihçesi</h3>
                  <div className="mt-3 space-y-2">
                    {selectedHistoryMovements.length === 0 ? (
                      <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 text-sm font-semibold text-[#94A3B8]">
                        Bu ürün için hareket kaydı yok.
                      </div>
                    ) : (
                      selectedHistoryMovements.map((movement) => {
                        const movementType = getMovementLabel(movement.movement_type);
                        const Icon = movementType.icon;
                        return (
                          <div key={movement.id} className="rounded-xl border border-[#334155] bg-[#1E293B] p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-black text-[#F8FAFC]">{formatTime(movement.created_at)}</p>
                                <p className={`mt-1 flex items-center gap-1.5 text-xs font-black ${movementType.color}`}>
                                  <Icon size={14} />
                                  {movementType.label}
                                </p>
                              </div>
                              <span className="text-lg font-black text-[#F8FAFC]">
                                {Number(movement.quantity) > 0 ? `+${movement.quantity}` : movement.quantity}
                              </span>
                            </div>
                            <p className="mt-2 text-xs font-semibold text-[#94A3B8]">{movement.note || "-"}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

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

function StockAgeMetric({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: string;
  tone?: "green" | "amber";
}) {
  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-3">
      <p className="text-[10px] font-black uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className={`mt-1 text-lg font-black ${tone === "amber" ? "text-[#F59E0B]" : "text-[#00FF7B]"}`}>
        {value}
      </p>
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
        className={`flex items-center gap-1 transition-colors hover:text-[#00FF7B] ${
          align === "right" ? "ml-auto flex-row-reverse" : ""
        } ${active ? "text-[#00FF7B]" : ""}`}
      >
        {label}
        {active ? (
          <ArrowUp size={13} className={`transition-transform ${dir === "desc" ? "rotate-180" : ""}`} />
        ) : (
          <ArrowUpDown size={13} className="text-[#64748B]" />
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
