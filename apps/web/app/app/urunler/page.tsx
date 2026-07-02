"use client";

import type { Tables } from "@buneka/database";
import {
  AlertTriangle,
  Boxes,
  HandCoins,
  Layers,
  Loader2,
  Pencil,
  PackagePlus,
  Percent,
  Plus,
  ScanBarcode,
  Search,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { convertUsdToTry } from "@/lib/currency/tcmb";
import { PageHeader } from "../_components/PageHeader";
import { EmptyState } from "../_components/EmptyState";
import { QuickLinks } from "../_components/QuickLinks";
import { fetchUsdRateAction } from "./currency-actions";
import { BulkAddModal } from "./BulkAddModal";

type AppUser = Pick<Tables<"app_users">, "organization_id" | "store_id">;
type Product = Tables<"products">;

type ProductForm = {
  barcode: string;
  name: string;
  category: string;
  purchase_currency: "TRY" | "USD";
  purchase_price: string;
  sale_price: string;
  stock_quantity: string;
  min_stock: string;
};

const emptyProductForm: ProductForm = {
  barcode: "",
  name: "",
  category: "",
  purchase_currency: "TRY",
  purchase_price: "",
  sale_price: "",
  stock_quantity: "0",
  min_stock: "0",
};

export default function UrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [message, setMessage] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [newCategory, setNewCategory] = useState(false);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [bulkMode, setBulkMode] = useState<"percent" | "amount">("percent");
  const [bulkValue, setBulkValue] = useState("");
  const [bulkCategory, setBulkCategory] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const loadProducts = useCallback(async () => {
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

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("organization_id", currentUser.organization_id)
        .order("name");

      if (data) {
        setProducts(data);
      }
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadProducts);
  }, [loadProducts]);

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category).filter((value): value is string => !!value))).sort(
        (a, b) => a.localeCompare(b, "tr")
      ),
    [products]
  );

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(query) || product.barcode.includes(search);
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const bulkTargets = products.filter((product) => {
    const query = search.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(query) || product.barcode.includes(search);
    const matchesCategory = !bulkCategory || product.category === bulkCategory;
    return matchesSearch && matchesCategory;
  });

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

  function openNewProduct() {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setNewCategory(categories.length === 0);
    setUsdRate(null);
    setShowProductModal(true);
  }

  function openEditProduct(product: Product) {
    setEditingProductId(product.id);
    setProductForm({
      barcode: product.barcode,
      name: product.name,
      category: product.category || "",
      purchase_currency: (product.purchase_currency as "TRY" | "USD") || "TRY",
      purchase_price:
        product.purchase_currency === "USD" && product.purchase_price_original != null
          ? String(product.purchase_price_original)
          : product.purchase_price != null
            ? String(product.purchase_price)
            : "",
      sale_price: String(product.sale_price),
      stock_quantity: String(product.stock_quantity),
      min_stock: String(product.min_stock),
    });
    setNewCategory(!!product.category && !categories.includes(product.category));
    setUsdRate(null);
    setShowProductModal(true);
  }

  async function handleCurrencyChange(currency: "TRY" | "USD") {
    setProductForm((current) => ({ ...current, purchase_currency: currency }));
    if (currency === "USD" && usdRate === null) {
      const rates = await fetchUsdRateAction();
      setUsdRate(rates?.usdToTry ?? null);
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!appUser) return;

    setSaving(true);
    setMessage("");

    const enteredPurchasePrice = productForm.purchase_price ? Number(productForm.purchase_price) : null;
    let purchasePriceTry = enteredPurchasePrice;
    let purchasePriceOriginal: number | null = null;

    if (productForm.purchase_currency === "USD" && enteredPurchasePrice) {
      const rate = usdRate ?? (await fetchUsdRateAction())?.usdToTry ?? null;
      if (!rate) {
        setMessage("Güncel dolar kuru alınamadı, lütfen tekrar deneyin.");
        setSaving(false);
        return;
      }
      purchasePriceOriginal = enteredPurchasePrice;
      purchasePriceTry = convertUsdToTry(enteredPurchasePrice, rate);
    }

    const payload = {
      barcode: productForm.barcode.trim(),
      name: productForm.name.trim(),
      category: productForm.category.trim() || null,
      purchase_currency: productForm.purchase_currency,
      purchase_price: purchasePriceTry,
      purchase_price_original: purchasePriceOriginal,
      sale_price: Number(productForm.sale_price),
      stock_quantity: Number(productForm.stock_quantity || 0),
      min_stock: Number(productForm.min_stock || 0),
    };

    const legacyPayload = {
      barcode: payload.barcode,
      name: payload.name,
      category: payload.category,
      purchase_price: payload.purchase_price,
      sale_price: payload.sale_price,
      stock_quantity: payload.stock_quantity,
      min_stock: payload.min_stock,
    };

    const save = (body: typeof payload | typeof legacyPayload) =>
      editingProductId
        ? supabase.from("products").update(body).eq("id", editingProductId)
        : supabase.from("products").insert({
            ...body,
            organization_id: appUser.organization_id,
            store_id: appUser.store_id,
          });

    let { error } = await save(payload);
    let usedLegacyFallback = false;

    if (error && /purchase_currency|purchase_price_original/.test(error.message) && /schema cache/i.test(error.message)) {
      usedLegacyFallback = true;
      ({ error } = await save(legacyPayload));
    }

    if (error) {
      setMessage(`Ürün kaydedilemedi: ${error.message}`);
    } else {
      setMessage(
        usedLegacyFallback
          ? "Ürün kaydedildi. Not: döviz bilgisi henüz kaydedilemedi, veritabanı güncellemesi bekleniyor — fiyat TL olarak kaydedildi."
          : editingProductId
            ? "Ürün güncellendi."
            : "Ürün eklendi."
      );
      setProductForm(emptyProductForm);
      setEditingProductId(null);
      setShowProductModal(false);
      await loadProducts();
    }

    setSaving(false);
  }

  async function applyBulkUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(bulkValue);
    if (!Number.isFinite(value) || bulkTargets.length === 0) return;

    setSaving(true);
    setMessage("");

    const updates = bulkTargets.map((product) => {
      const nextPrice =
        bulkMode === "percent"
          ? product.sale_price * (1 + value / 100)
          : product.sale_price + value;

      return supabase
        .from("products")
        .update({ sale_price: Math.max(0, Number(nextPrice.toFixed(2))) })
        .eq("id", product.id);
    });

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);

    if (failed?.error) {
      setMessage(`Toplu güncelleme tamamlanamadı: ${failed.error.message}`);
    } else {
      setMessage(`${bulkTargets.length} ürünün satış fiyatı güncellendi.`);
      setBulkValue("");
      setBulkCategory("");
      setShowBulkUpdate(false);
      await loadProducts();
    }

    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Ürünler"
        subtitle="Barkod, fiyat, kategori ve stok bilgilerini yönetin."
        action={
          <>
            <button className="premium-button-secondary" type="button" onClick={() => setShowBulkUpdate(true)}>
              <Percent size={18} /> Toplu Fiyat Güncelle
            </button>
            <button className="premium-button-secondary" type="button" onClick={() => setShowBulkAdd(true)}>
              <Layers size={18} /> Toplu Ekle
            </button>
            <button className="premium-button-primary" type="button" onClick={openNewProduct}>
              <Plus size={18} /> Yeni Ürün
            </button>
          </>
        }
      />
      <QuickLinks
        links={[
          { href: "/app", label: "Fiyat Sorgula", icon: ScanBarcode },
          { href: "/app/stok", label: "Stok Takibi", icon: Boxes },
          { href: "/app/kasa", label: "Günlük Kasa", icon: WalletCards },
          { href: "/app/veresiye", label: "Veresiye", icon: HandCoins },
        ]}
      />

      {message && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
          {message}
        </div>
      )}

      <div className="data-card flex h-[calc(100vh-220px)] flex-col overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Ürün adı veya barkod ile ara..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-slate-950 placeholder-slate-400 focus:border-cyan-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50"
            />
          </div>
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-950 focus:border-cyan-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50"
            >
              <option value="">Tüm kategoriler</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">
              <tr className="text-sm text-slate-500 dark:text-slate-400">
                <th className="px-6 py-3 font-medium">Barkod / Ürün Adı</th>
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 text-right font-medium">Alış Fiyatı</th>
                <th className="px-6 py-3 text-right font-medium">Satış Fiyatı</th>
                <th className="px-6 py-3 text-right font-medium">Stok</th>
                <th className="px-6 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-400" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon={Search} message="Ürün bulunamadı." />
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    onClick={() => openEditProduct(product)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-950 dark:text-slate-50">{product.name}</div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{product.barcode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {product.category || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-500 dark:text-slate-400">
                      {product.purchase_price ? formatMoney(Number(product.purchase_price)) : "-"}
                      {product.purchase_currency === "USD" && product.purchase_price_original != null && (
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          (${Number(product.purchase_price_original).toFixed(2)})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-950 dark:text-slate-50">
                      {formatMoney(Number(product.sale_price))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {Number(product.stock_quantity) <= Number(product.min_stock) && (
                          <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
                        )}
                        <span
                          className={`font-bold ${
                            Number(product.stock_quantity) <= Number(product.min_stock)
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-950 dark:text-slate-50"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Pencil size={16} className="inline text-slate-300 group-hover:text-cyan-500 dark:text-slate-600" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showProductModal && (
        <Modal
          title={editingProductId ? "Ürünü Düzenle" : "Yeni Ürün"}
          onClose={() => setShowProductModal(false)}
        >
          <form className="grid gap-4" onSubmit={saveProduct}>
            <FormInput label="Barkod" value={productForm.barcode} onChange={(value) => setProductForm({ ...productForm, barcode: value })} required />
            <FormInput label="Ürün adı" value={productForm.name} onChange={(value) => setProductForm({ ...productForm, name: value })} required />

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-300">Kategori</span>
                {categories.length > 0 && (
                  <button
                    type="button"
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-300"
                    onClick={() => setNewCategory((current) => !current)}
                  >
                    {newCategory ? "Listeden seç" : "+ Yeni kategori"}
                  </button>
                )}
              </div>
              {newCategory || categories.length === 0 ? (
                <input
                  className="premium-input"
                  type="text"
                  value={productForm.category}
                  onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                  placeholder="Kategori adı yazın"
                />
              ) : (
                <select
                  className="premium-input"
                  value={productForm.category}
                  onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                >
                  <option value="">Kategorisiz</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-300">Alış fiyatı para birimi</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`rounded-xl border px-4 py-2.5 font-bold transition-all active:scale-[0.98] ${productForm.purchase_currency === "TRY" ? "border-cyan-400 bg-cyan-50 text-slate-800 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-200" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                  onClick={() => handleCurrencyChange("TRY")}
                >
                  TL
                </button>
                <button
                  type="button"
                  className={`rounded-xl border px-4 py-2.5 font-bold transition-all active:scale-[0.98] ${productForm.purchase_currency === "USD" ? "border-cyan-400 bg-cyan-50 text-slate-800 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-200" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                  onClick={() => handleCurrencyChange("USD")}
                >
                  USD ($)
                </button>
              </div>
              {productForm.purchase_currency === "USD" && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {usdRate
                    ? `Güncel kur: 1$ = ${usdRate.toFixed(2)} TL (TCMB). Girilen tutar TL'ye çevrilip yukarı yuvarlanır.`
                    : "Güncel dolar kuru TCMB'den alınıyor..."}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label={productForm.purchase_currency === "USD" ? "Alış fiyatı ($)" : "Alış fiyatı (TL)"}
                type="number"
                value={productForm.purchase_price}
                onChange={(value) => setProductForm({ ...productForm, purchase_price: value })}
              />
              <FormInput label="Satış fiyatı (TL)" type="number" value={productForm.sale_price} onChange={(value) => setProductForm({ ...productForm, sale_price: value })} required />
              <FormInput label="Stok" type="number" value={productForm.stock_quantity} onChange={(value) => setProductForm({ ...productForm, stock_quantity: value })} />
              <FormInput label="Minimum stok" type="number" value={productForm.min_stock} onChange={(value) => setProductForm({ ...productForm, min_stock: value })} />
            </div>
            <button className="premium-button-primary mt-2" type="submit" disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <PackagePlus size={18} />}
              {editingProductId ? "Değişiklikleri Kaydet" : "Ürünü Kaydet"}
            </button>
          </form>
        </Modal>
      )}

      {showBulkAdd && appUser && (
        <BulkAddModal
          open={showBulkAdd}
          onClose={() => setShowBulkAdd(false)}
          organizationId={appUser.organization_id}
          storeId={appUser.store_id}
          onImported={(msg) => {
            setMessage(msg);
            void loadProducts();
          }}
        />
      )}

      {showBulkUpdate && (
        <Modal title="Toplu Fiyat Güncelle" onClose={() => setShowBulkUpdate(false)}>
          <form className="grid gap-4" onSubmit={applyBulkUpdate}>
            {categories.length > 0 && (
              <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
                Kategori (opsiyonel)
                <select
                  className="premium-input"
                  value={bulkCategory}
                  onChange={(event) => setBulkCategory(event.target.value)}
                >
                  <option value="">Tüm kategoriler</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Bu işlem mevcut arama/kategori filtresindeki {bulkTargets.length} ürünün satış fiyatını günceller.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`rounded-xl border px-4 py-3 font-bold transition-all active:scale-[0.98] ${bulkMode === "percent" ? "border-cyan-400 bg-cyan-50 text-slate-800 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-200" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                type="button"
                onClick={() => setBulkMode("percent")}
              >
                Yüzde
              </button>
              <button
                className={`rounded-xl border px-4 py-3 font-bold transition-all active:scale-[0.98] ${bulkMode === "amount" ? "border-cyan-400 bg-cyan-50 text-slate-800 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-200" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
                type="button"
                onClick={() => setBulkMode("amount")}
              >
                TL
              </button>
            </div>
            <FormInput
              label={bulkMode === "percent" ? "Artış yüzdesi" : "Eklenecek TL"}
              type="number"
              value={bulkValue}
              onChange={setBulkValue}
              required
            />
            <button className="premium-button-primary" type="submit" disabled={saving || bulkTargets.length === 0}>
              Güncellemeyi Uygula
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--color-bg)] p-6 text-slate-950 shadow-2xl dark:text-slate-50">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-black">{title}</h2>
          <button
            className="rounded-full bg-white p-2 text-slate-950 transition-transform active:scale-90 dark:bg-slate-800 dark:text-slate-50"
            type="button"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
      {label}
      <input
        className="premium-input"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        step={type === "number" ? "0.01" : undefined}
      />
    </label>
  );
}
