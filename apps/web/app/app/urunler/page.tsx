"use client";

import type { Tables } from "@buneka/database";
import { AlertTriangle, PackagePlus, Percent, Plus, Search, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AppUser = Pick<Tables<"app_users">, "organization_id" | "store_id">;
type Product = Tables<"products">;

type ProductForm = {
  barcode: string;
  name: string;
  category: string;
  purchase_price: string;
  sale_price: string;
  stock_quantity: string;
  min_stock: string;
};

const emptyProductForm: ProductForm = {
  barcode: "",
  name: "",
  category: "",
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
  const [message, setMessage] = useState("");
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [bulkMode, setBulkMode] = useState<"percent" | "amount">("percent");
  const [bulkValue, setBulkValue] = useState("");
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

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return product.name.toLowerCase().includes(query) || product.barcode.includes(search);
  });

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!appUser) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("products").insert({
      organization_id: appUser.organization_id,
      store_id: appUser.store_id,
      barcode: productForm.barcode.trim(),
      name: productForm.name.trim(),
      category: productForm.category.trim() || null,
      purchase_price: productForm.purchase_price ? Number(productForm.purchase_price) : null,
      sale_price: Number(productForm.sale_price),
      stock_quantity: Number(productForm.stock_quantity || 0),
      min_stock: Number(productForm.min_stock || 0),
    });

    if (error) {
      setMessage(`Ürün eklenemedi: ${error.message}`);
    } else {
      setMessage("Ürün eklendi.");
      setProductForm(emptyProductForm);
      setShowNewProduct(false);
      await loadProducts();
    }

    setSaving(false);
  }

  async function applyBulkUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(bulkValue);
    if (!Number.isFinite(value) || filteredProducts.length === 0) return;

    setSaving(true);
    setMessage("");

    const updates = filteredProducts.map((product) => {
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
      setMessage(`${filteredProducts.length} ürünün satış fiyatı güncellendi.`);
      setBulkValue("");
      setShowBulkUpdate(false);
      await loadProducts();
    }

    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">Ürünler</h1>
          <p className="text-[#8A9B8E]">Barkod, fiyat, kategori ve stok bilgilerini yönetin.</p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <button
            className="flex items-center justify-center gap-2 rounded-xl border border-[#2F4A35] bg-[#243328] px-4 py-2 text-white transition-colors hover:bg-[#2F4A35]"
            type="button"
            onClick={() => setShowBulkUpdate(true)}
          >
            <Percent size={18} /> Toplu Fiyat Güncelle
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-[#4F6F52] px-4 py-2 text-white shadow-lg shadow-[#4F6F52]/20 transition-colors hover:bg-[#3F5941]"
            type="button"
            onClick={() => setShowNewProduct(true)}
          >
            <Plus size={18} /> Yeni Ürün
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-[#2F4A35] bg-[#243328] px-5 py-4 text-sm font-bold text-[#E8EDE9]">
          {message}
        </div>
      )}

      <div className="flex h-[calc(100vh-220px)] flex-col overflow-hidden rounded-2xl border border-[#2F4A35] bg-[#243328]">
        <div className="border-b border-[#2F4A35] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9B8E]" size={20} />
            <input
              type="text"
              placeholder="Ürün adı veya barkod ile ara..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#2F4A35] bg-[#1A2B1E] py-2 pl-10 pr-4 text-white placeholder-[#8A9B8E] focus:border-[#4F6F52] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-[#1A2B1E]">
              <tr className="text-sm text-[#8A9B8E]">
                <th className="px-6 py-3 font-medium">Barkod / Ürün Adı</th>
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 text-right font-medium">Alış Fiyatı</th>
                <th className="px-6 py-3 text-right font-medium">Satış Fiyatı</th>
                <th className="px-6 py-3 text-right font-medium">Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F4A35]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-[#4F6F52]" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#8A9B8E]">
                    Ürün bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-[#1A2B1E]">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{product.name}</div>
                      <div className="font-mono text-xs text-[#8A9B8E]">{product.barcode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-lg bg-[#1A2B1E] px-2 py-1 text-xs text-[#8A9B8E]">
                        {product.category || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[#8A9B8E]">
                      {product.purchase_price ? formatMoney(Number(product.purchase_price)) : "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">
                      {formatMoney(Number(product.sale_price))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {Number(product.stock_quantity) <= Number(product.min_stock) && (
                          <AlertTriangle size={14} className="text-[#B65A3C]" />
                        )}
                        <span
                          className={`font-bold ${
                            Number(product.stock_quantity) <= Number(product.min_stock)
                              ? "text-[#B65A3C]"
                              : "text-white"
                          }`}
                        >
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

      {showNewProduct && (
        <Modal title="Yeni Ürün" onClose={() => setShowNewProduct(false)}>
          <form className="grid gap-4" onSubmit={createProduct}>
            <FormInput label="Barkod" value={productForm.barcode} onChange={(value) => setProductForm({ ...productForm, barcode: value })} required />
            <FormInput label="Ürün adı" value={productForm.name} onChange={(value) => setProductForm({ ...productForm, name: value })} required />
            <FormInput label="Kategori" value={productForm.category} onChange={(value) => setProductForm({ ...productForm, category: value })} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Alış fiyatı" type="number" value={productForm.purchase_price} onChange={(value) => setProductForm({ ...productForm, purchase_price: value })} />
              <FormInput label="Satış fiyatı" type="number" value={productForm.sale_price} onChange={(value) => setProductForm({ ...productForm, sale_price: value })} required />
              <FormInput label="Stok" type="number" value={productForm.stock_quantity} onChange={(value) => setProductForm({ ...productForm, stock_quantity: value })} />
              <FormInput label="Minimum stok" type="number" value={productForm.min_stock} onChange={(value) => setProductForm({ ...productForm, min_stock: value })} />
            </div>
            <button className="premium-button-primary mt-2" type="submit" disabled={saving}>
              <PackagePlus size={18} />
              Ürünü Kaydet
            </button>
          </form>
        </Modal>
      )}

      {showBulkUpdate && (
        <Modal title="Toplu Fiyat Güncelle" onClose={() => setShowBulkUpdate(false)}>
          <form className="grid gap-4" onSubmit={applyBulkUpdate}>
            <p className="text-sm leading-6 text-[#667064]">
              Bu işlem mevcut arama filtresindeki {filteredProducts.length} ürünün satış fiyatını günceller.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`rounded-xl border px-4 py-3 font-bold ${bulkMode === "percent" ? "border-[#4F6F52] bg-[#EDF4ED] text-[#2F4A35]" : "border-[#E4DED2] bg-white"}`}
                type="button"
                onClick={() => setBulkMode("percent")}
              >
                Yüzde
              </button>
              <button
                className={`rounded-xl border px-4 py-3 font-bold ${bulkMode === "amount" ? "border-[#4F6F52] bg-[#EDF4ED] text-[#2F4A35]" : "border-[#E4DED2] bg-white"}`}
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
            <button className="premium-button-primary" type="submit" disabled={saving || filteredProducts.length === 0}>
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
      <div className="w-full max-w-lg rounded-3xl bg-[#F7F4ED] p-6 text-[#20231F] shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black">{title}</h2>
          <button className="rounded-full bg-white p-2" type="button" onClick={onClose} aria-label="Kapat">
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
    <label className="grid gap-2 text-sm font-bold text-[#2F4A35]">
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
