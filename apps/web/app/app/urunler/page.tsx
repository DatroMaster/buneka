"use client";

import type { Tables } from "@buneka/database";
import {
  AlertTriangle,
  ArrowUp,
  ArrowUpDown,
  Boxes,
  HandCoins,
  Layers,
  Loader2,
  Pencil,
  PackagePlus,
  Percent,
  Plus,
  RefreshCw,
  ScanBarcode,
  Search,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { createClient } from "@/lib/supabase/client";
import { convertUsdToTry } from "@/lib/currency/tcmb";
import { PageHeader } from "../_components/PageHeader";
import { EmptyState } from "../_components/EmptyState";
import { QuickLinks } from "../_components/QuickLinks";
import { fetchUsdRateAction } from "./currency-actions";
import { BulkAddModal } from "./BulkAddModal";

type AppUser = Pick<Tables<"app_users">, "organization_id" | "store_id">;
type Product = Tables<"products">;
type ProductSortKey = "name" | "category" | "purchase_price" | "sale_price" | "stock_quantity";

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

const categoryPalette: Record<string, { background: string; border: string; color: string }> = {
  "içecek": { background: "rgba(14, 165, 233, 0.16)", border: "rgba(56, 189, 248, 0.36)", color: "#7DD3FC" },
  "icecek": { background: "rgba(14, 165, 233, 0.16)", border: "rgba(56, 189, 248, 0.36)", color: "#7DD3FC" },
  "atıştırmalık": { background: "rgba(245, 158, 11, 0.16)", border: "rgba(251, 191, 36, 0.40)", color: "#FCD34D" },
  "atistirmalik": { background: "rgba(245, 158, 11, 0.16)", border: "rgba(251, 191, 36, 0.40)", color: "#FCD34D" },
  "çikolata": { background: "rgba(244, 63, 94, 0.15)", border: "rgba(251, 113, 133, 0.38)", color: "#FDA4AF" },
  "cikolata": { background: "rgba(244, 63, 94, 0.15)", border: "rgba(251, 113, 133, 0.38)", color: "#FDA4AF" },
  "yemek": { background: "rgba(34, 197, 94, 0.14)", border: "rgba(74, 222, 128, 0.34)", color: "#86EFAC" },
};

const fallbackCategoryPalette = [
  { background: "rgba(62, 207, 142, 0.13)", border: "rgba(62, 207, 142, 0.34)", color: "#7BF0B7" },
  { background: "rgba(242, 184, 75, 0.14)", border: "rgba(242, 184, 75, 0.36)", color: "#F2B84B" },
  { background: "rgba(168, 85, 247, 0.13)", border: "rgba(192, 132, 252, 0.34)", color: "#D8B4FE" },
  { background: "rgba(249, 115, 80, 0.13)", border: "rgba(251, 146, 60, 0.34)", color: "#FDBA74" },
];

function normalizeCategory(category: string) {
  return category.trim().toLocaleLowerCase("tr-TR").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function getCategoryStyle(category: string | null): CSSProperties {
  if (!category) return {};
  const exact = category.trim().toLocaleLowerCase("tr-TR");
  const normalized = normalizeCategory(category);
  const known = categoryPalette[exact] || categoryPalette[normalized];
  if (known) return known;

  const index = Array.from(normalized).reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackCategoryPalette.length;
  return fallbackCategoryPalette[index];
}

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
  const [profitPercent, setProfitPercent] = useState("20");
  const [autoProfitEnabled, setAutoProfitEnabled] = useState(true);
  const [autoUsdRateUpdate, setAutoUsdRateUpdate] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem("buneka-auto-usd-rate-update") === "1"
  );
  const [updatingUsdPrices, setUpdatingUsdPrices] = useState(false);
  const [bulkMode, setBulkMode] = useState<"percent" | "amount">("percent");
  const [bulkValue, setBulkValue] = useState("");
  const [bulkCategory, setBulkCategory] = useState("");
  const [sortKey, setSortKey] = useState<ProductSortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const supabase = useMemo(() => createClient(), []);

  function toggleSort(key: ProductSortKey) {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "category" ? "asc" : "desc");
    }
  }

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

  const sortedProducts = useMemo(() => {
    const factor = sortDir === "asc" ? 1 : -1;
    return [...filteredProducts].sort((a, b) => {
      if (sortKey === "name") return factor * a.name.localeCompare(b.name, "tr");
      if (sortKey === "category") return factor * (a.category || "").localeCompare(b.category || "", "tr");
      return factor * (Number(a[sortKey]) - Number(b[sortKey]));
    });
  }, [filteredProducts, sortDir, sortKey]);

  const bulkTargets = products.filter((product) => {
    const query = search.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(query) || product.barcode.includes(search);
    const matchesCategory = !bulkCategory || product.category === bulkCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((product) => Number(product.stock_quantity) <= Number(product.min_stock)).length;
  const pricedCount = products.filter((product) => Number(product.sale_price) > 0).length;

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

  const purchasePriceTryPreview = useMemo(() => {
    const enteredPurchasePrice = productForm.purchase_price ? Number(productForm.purchase_price) : null;
    if (!enteredPurchasePrice || !Number.isFinite(enteredPurchasePrice)) return null;
    if (productForm.purchase_currency === "USD") {
      return usdRate ? convertUsdToTry(enteredPurchasePrice, usdRate) : null;
    }
    return Math.ceil(enteredPurchasePrice);
  }, [productForm.purchase_currency, productForm.purchase_price, usdRate]);

  const suggestedSalePrice = useMemo(() => {
    if (!purchasePriceTryPreview) return null;
    const margin = Number(profitPercent || 0);
    if (!Number.isFinite(margin)) return null;
    return Math.ceil(purchasePriceTryPreview * (1 + margin / 100));
  }, [profitPercent, purchasePriceTryPreview]);

  function withSuggestedSalePrice(
    nextForm: ProductForm,
    options?: { auto?: boolean; profit?: string; rate?: number | null }
  ) {
    const shouldApply = options?.auto ?? autoProfitEnabled;
    if (!shouldApply) return nextForm;

    const enteredPurchasePrice = nextForm.purchase_price ? Number(nextForm.purchase_price) : null;
    if (!enteredPurchasePrice || !Number.isFinite(enteredPurchasePrice)) return nextForm;

    const rate = options?.rate ?? usdRate;
    const purchaseTry =
      nextForm.purchase_currency === "USD"
        ? rate
          ? convertUsdToTry(enteredPurchasePrice, rate)
          : null
        : Math.ceil(enteredPurchasePrice);

    if (!purchaseTry) return nextForm;
    const margin = Number(options?.profit ?? profitPercent ?? 0);
    const normalizedMargin = Number.isFinite(margin) ? margin : 0;
    return {
      ...nextForm,
      sale_price: String(Math.ceil(purchaseTry * (1 + normalizedMargin / 100))),
    };
  }

  function updateProductForm(nextForm: ProductForm, options?: { auto?: boolean; profit?: string; rate?: number | null }) {
    setProductForm(withSuggestedSalePrice(nextForm, options));
  }

  function openNewProduct() {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setNewCategory(categories.length === 0);
    setUsdRate(null);
    setAutoProfitEnabled(true);
    setShowProductModal(true);
  }

  function openEditProduct(product: Product) {
    const purchaseCurrency = (product.purchase_currency as "TRY" | "USD") || "TRY";
    setEditingProductId(product.id);
    setProductForm({
      barcode: product.barcode,
      name: product.name,
      category: product.category || "",
      purchase_currency: purchaseCurrency,
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
    setAutoProfitEnabled(false);
    if (purchaseCurrency === "USD") {
      void fetchUsdRateAction().then((rates) => setUsdRate(rates?.usdToTry ?? null));
    }
    setShowProductModal(true);
  }

  async function handleCurrencyChange(currency: "TRY" | "USD") {
    let nextRate = usdRate;
    if (currency === "USD" && usdRate === null) {
      const rates = await fetchUsdRateAction();
      nextRate = rates?.usdToTry ?? null;
      setUsdRate(nextRate);
    }
    setAutoProfitEnabled(true);
    setProductForm((current) =>
      withSuggestedSalePrice({ ...current, purchase_currency: currency }, { auto: true, rate: nextRate })
    );
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

    const margin = Number(profitPercent || 0);
    const normalizedMargin = Number.isFinite(margin) ? margin : 0;
    const salePrice =
      autoProfitEnabled && purchasePriceTry
        ? Math.ceil(purchasePriceTry * (1 + normalizedMargin / 100))
        : Number(productForm.sale_price);

    const payload = {
      barcode: productForm.barcode.trim(),
      name: productForm.name.trim(),
      category: productForm.category.trim() || null,
      purchase_currency: productForm.purchase_currency,
      purchase_price: purchasePriceTry,
      purchase_price_original: purchasePriceOriginal,
      sale_price: salePrice,
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

  const updateUsdProductsByCurrentRate = useCallback(async (options?: { silent?: boolean }) => {
    const usdProducts = products.filter(
      (product) => product.purchase_currency === "USD" && product.purchase_price_original != null
    );

    if (usdProducts.length === 0) {
      if (!options?.silent) setMessage("Kurla güncellenecek USD bazlı ürün bulunamadı.");
      return false;
    }

    setUpdatingUsdPrices(true);
    if (!options?.silent) setMessage("");

    const rate = usdRate ?? (await fetchUsdRateAction())?.usdToTry ?? null;
    if (!rate) {
      if (!options?.silent) setMessage("Güncel dolar kuru alınamadı, lütfen tekrar deneyin.");
      setUpdatingUsdPrices(false);
      return false;
    }

    setUsdRate(rate);
    const margin = Number(profitPercent || 0);
    const normalizedMargin = Number.isFinite(margin) ? margin : 0;
    const updates = usdProducts.map((product) => {
      const nextPurchaseTry = convertUsdToTry(Number(product.purchase_price_original), rate);
      const nextSalePrice = Math.ceil(nextPurchaseTry * (1 + normalizedMargin / 100));
      return supabase
        .from("products")
        .update({
          purchase_price: nextPurchaseTry,
          sale_price: nextSalePrice,
        })
        .eq("id", product.id);
    });

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);

    if (failed?.error) {
      if (!options?.silent) setMessage(`USD bazlı fiyatlar güncellenemedi: ${failed.error.message}`);
      setUpdatingUsdPrices(false);
      return false;
    } else {
      setMessage(
        options?.silent
          ? `${usdProducts.length} USD bazlı ürün otomatik olarak güncel kurla yenilendi.`
          : `${usdProducts.length} USD bazlı ürün güncel kurla hesaplandı; satış fiyatları %${normalizedMargin} kârla yukarı yuvarlandı.`
      );
      await loadProducts();
    }

    setUpdatingUsdPrices(false);
    return true;
  }, [loadProducts, products, profitPercent, supabase, usdRate]);

  useEffect(() => {
    if (!autoUsdRateUpdate || loading || updatingUsdPrices) return;
    if (!products.some((product) => product.purchase_currency === "USD" && product.purchase_price_original != null)) return;

    const today = new Date().toISOString().slice(0, 10);
    const key = "buneka-auto-usd-rate-updated-at";
    if (window.localStorage.getItem(key) === today) return;

    const timer = window.setTimeout(() => {
      void updateUsdProductsByCurrentRate({ silent: true }).then((updated) => {
        if (updated) window.localStorage.setItem(key, today);
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [autoUsdRateUpdate, loading, products, updateUsdProductsByCurrentRate, updatingUsdPrices]);

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
            <button
              className="premium-button-secondary"
              type="button"
              onClick={() => void updateUsdProductsByCurrentRate()}
              disabled={updatingUsdPrices}
              title="USD bazlı ürünleri güncel TCMB kuru ve kâr oranı ile yeniler."
            >
              {updatingUsdPrices ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              USD Kur Güncelle
            </button>
            <label
              className="premium-button-secondary cursor-pointer select-none"
              title="Açık olduğunda ürünler sayfası günde bir kez USD bazlı ürünleri güncel kurla yeniler."
            >
              <input
                type="checkbox"
                checked={autoUsdRateUpdate}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setAutoUsdRateUpdate(enabled);
                  window.localStorage.setItem("buneka-auto-usd-rate-update", enabled ? "1" : "0");
                  if (enabled) {
                    window.localStorage.removeItem("buneka-auto-usd-rate-updated-at");
                  }
                }}
                className="accent-[#FF6B00]"
              />
              Otomatik USD
            </label>
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

      <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="data-card border-[#FF6B00]/25 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#FFB020]">
            <PackagePlus size={15} /> Katalog Merkezi
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Ürünler sayfası barkod, isim, kategori, alış ve satış fiyatı gibi raf bilgisini yönetmek içindir.
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon bg-[#10B981]/10 text-[#10B981]">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Kayıtlı Ürün</p>
            <p className="text-2xl font-black text-[#10B981]">{products.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Fiyatlı / Kritik</p>
            <p className="text-2xl font-black text-slate-950 dark:text-slate-50">{pricedCount} / {lowStockCount}</p>
          </div>
        </div>
      </div>

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
              className="w-full rounded-xl border border-slate-700 bg-[#0F172A] py-2 pl-10 pr-4 text-slate-50 placeholder-slate-400 focus:border-[#FF6B00] focus:outline-none"
            />
          </div>
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-slate-50 focus:border-[#FF6B00] focus:outline-none"
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
            <thead className="product-table-head sticky top-0 z-10">
              <tr className="text-sm">
                <ProductSortableHeader label="Barkod / Ürün Adı" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
                <ProductSortableHeader label="Kategori" active={sortKey === "category"} dir={sortDir} onClick={() => toggleSort("category")} />
                <ProductSortableHeader label="Alış Fiyatı" align="right" active={sortKey === "purchase_price"} dir={sortDir} onClick={() => toggleSort("purchase_price")} />
                <ProductSortableHeader label="Satış Fiyatı" align="right" active={sortKey === "sale_price"} dir={sortDir} onClick={() => toggleSort("sale_price")} />
                <ProductSortableHeader label="Stok" align="right" active={sortKey === "stock_quantity"} dir={sortDir} onClick={() => toggleSort("stock_quantity")} />
                <th className="px-6 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-[#FF6B00]" />
                  </td>
                </tr>
              ) : sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon={Search} message="Ürün bulunamadı." />
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product) => (
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
                      <span className="category-badge" style={getCategoryStyle(product.category)}>
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
                      <Pencil size={16} className="inline text-slate-500 group-hover:text-[#FF6B00]" />
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
                    className="text-xs font-bold text-[#FFB020]"
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
                  className={`rounded-xl border px-4 py-2.5 font-bold transition-all active:scale-[0.98] ${productForm.purchase_currency === "TRY" ? "border-[#10B981]/70 bg-[#10B981]/12 text-slate-50 shadow-sm" : "border-slate-700 bg-[#0F172A] text-slate-200"}`}
                  onClick={() => handleCurrencyChange("TRY")}
                >
                  TL
                </button>
                <button
                  type="button"
                  className={`rounded-xl border px-4 py-2.5 font-bold transition-all active:scale-[0.98] ${productForm.purchase_currency === "USD" ? "border-[#10B981]/70 bg-[#10B981]/12 text-slate-50 shadow-sm" : "border-slate-700 bg-[#0F172A] text-slate-200"}`}
                  onClick={() => handleCurrencyChange("USD")}
                >
                  USD ($)
                </button>
              </div>
              {productForm.purchase_currency === "USD" && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {usdRate
                    ? `Güncel kur: 1$ = ${usdRate.toFixed(2)} TL (TCMB). Girilen tutar TL’ye çevrilip yukarı yuvarlanır.`
                    : "Güncel dolar kuru TCMB'den alınıyor..."}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label={productForm.purchase_currency === "USD" ? "Alış fiyatı ($)" : "Alış fiyatı (TL)"}
                type="number"
                value={productForm.purchase_price}
                onChange={(value) => updateProductForm({ ...productForm, purchase_price: value })}
              />
              <FormInput
                label="Kâr oranı (%)"
                type="number"
                value={profitPercent}
                onChange={(value) => {
                  setProfitPercent(value);
                  setAutoProfitEnabled(true);
                  updateProductForm(productForm, { auto: true, profit: value });
                }}
              />
              <FormInput
                label="Satış fiyatı (TL)"
                type="number"
                value={productForm.sale_price}
                onChange={(value) => {
                  setAutoProfitEnabled(false);
                  setProductForm({ ...productForm, sale_price: value });
                }}
                required
              />
              <FormInput label="Stok" type="number" value={productForm.stock_quantity} onChange={(value) => setProductForm({ ...productForm, stock_quantity: value })} />
              <FormInput label="Minimum stok" type="number" value={productForm.min_stock} onChange={(value) => setProductForm({ ...productForm, min_stock: value })} />
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-[#0F172A] p-4 text-sm text-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6B00]">Otomatik kârlı fiyat</p>
                  <p className="mt-1 text-slate-300">
                    USD bazlı ürünlerde maliyet güncel TCMB kuru ile TL’ye çevrilir; satış fiyatı kâr oranıyla en yakın üst TL’ye yuvarlanır.
                  </p>
                </div>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-[#010b1f] px-3 py-2 text-xs font-black text-slate-100">
                  <input
                    type="checkbox"
                    checked={autoProfitEnabled}
                    onChange={(event) => {
                      setAutoProfitEnabled(event.target.checked);
                      if (event.target.checked) {
                        updateProductForm(productForm, { auto: true });
                      }
                    }}
                    className="accent-[#FF6B00]"
                  />
                  Otomatik uygula
                </label>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-[#111827] p-3">
                  <p className="text-xs font-bold text-slate-400">TL maliyet</p>
                  <p className="mt-1 text-xl font-black text-[#F8FAFC]">
                    {purchasePriceTryPreview !== null ? formatMoney(purchasePriceTryPreview) : "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#FF6B00]/45 bg-[#FF6B00]/10 p-3">
                  <p className="text-xs font-bold text-slate-300">Önerilen satış</p>
                  <p className="mt-1 text-xl font-black text-[#FFB020]">
                    {suggestedSalePrice !== null ? formatMoney(suggestedSalePrice) : "-"}
                  </p>
                </div>
              </div>
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
                className={`rounded-xl border px-4 py-3 font-bold transition-all active:scale-[0.98] ${bulkMode === "percent" ? "border-[#10B981]/70 bg-[#10B981]/12 text-slate-50 shadow-sm" : "border-slate-700 bg-[#0F172A] text-slate-200"}`}
                type="button"
                onClick={() => setBulkMode("percent")}
              >
                Yüzde
              </button>
              <button
                className={`rounded-xl border px-4 py-3 font-bold transition-all active:scale-[0.98] ${bulkMode === "amount" ? "border-[#10B981]/70 bg-[#10B981]/12 text-slate-50 shadow-sm" : "border-slate-700 bg-[#0F172A] text-slate-200"}`}
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

function ProductSortableHeader({
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
    <th className={`px-6 py-3 font-medium ${align === "right" ? "text-right" : ""}`}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 transition-colors hover:text-emerald-300 ${
          align === "right" ? "justify-end" : ""
        } ${active ? "text-emerald-300" : ""}`}
      >
        {label}
        {active ? (
          <ArrowUp size={13} className={`transition-transform ${dir === "desc" ? "rotate-180" : ""}`} />
        ) : (
          <ArrowUpDown size={13} className="text-slate-500" />
        )}
      </button>
    </th>
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
