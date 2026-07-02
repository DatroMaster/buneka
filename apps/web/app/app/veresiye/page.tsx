"use client";

import type { Tables } from "@buneka/database";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  HandCoins,
  Loader2,
  Minus,
  Package,
  Plus,
  ScanBarcode,
  ScanLine,
  Search,
  UserPlus,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "../_components/PageHeader";
import { EmptyState } from "../_components/EmptyState";
import { QuickLinks } from "../_components/QuickLinks";

type AppUser = Pick<Tables<"app_users">, "id" | "organization_id" | "store_id">;
type Customer = Tables<"customers">;
type Transaction = Tables<"credit_transactions"> & { app_users: Pick<Tables<"app_users">, "name"> | null };

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

function friendlyDbError(message?: string) {
  if (message && /schema cache/i.test(message)) {
    return "Veresiye özelliği için veritabanı kurulumu henüz tamamlanmadı. Lütfen yöneticinizle iletişime geçin.";
  }
  return message || "Bilinmeyen bir hata oluştu.";
}

const emptyNewRecord = {
  customerId: "",
  newCustomerName: "",
  phone: "",
  item: "",
  barcode: "",
  amount: "",
  type: "debt" as "debt" | "payment",
};

export default function VeresiyePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [oldestDebtDates, setOldestDebtDates] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [useNewCustomer, setUseNewCustomer] = useState(true);
  const [newRecord, setNewRecord] = useState(emptyNewRecord);
  const [lookingUpBarcode, setLookingUpBarcode] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txType, setTxType] = useState<"debt" | "payment">("debt");
  const [txAmount, setTxAmount] = useState("");
  const [txNote, setTxNote] = useState("");
  const [detailMessage, setDetailMessage] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const loadCustomers = useCallback(async () => {
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
      .select("id, organization_id, store_id")
      .eq("auth_user_id", user.id)
      .single();

    if (foundUser) {
      const currentUser = foundUser as AppUser;
      setAppUser(currentUser);

      const [{ data }, { data: debtRows }] = await Promise.all([
        supabase
          .from("customers")
          .select("*")
          .eq("organization_id", currentUser.organization_id)
          .order("credit_balance", { ascending: false }),
        supabase
          .from("credit_transactions")
          .select("customer_id, created_at")
          .eq("organization_id", currentUser.organization_id)
          .eq("type", "debt")
          .order("created_at", { ascending: true }),
      ]);

      if (data) setCustomers(data);

      if (debtRows) {
        const map: Record<string, string> = {};
        for (const row of debtRows) {
          if (!map[row.customer_id]) map[row.customer_id] = row.created_at;
        }
        setOldestDebtDates(map);
      }
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadCustomers);
  }, [loadCustomers]);

  const loadTransactions = useCallback(
    async (customerId: string) => {
      const { data } = await supabase
        .from("credit_transactions")
        .select("*, app_users(name)")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setTransactions(data as Transaction[]);
    },
    [supabase]
  );

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();
    return customer.name.toLowerCase().includes(query) || (customer.phone || "").includes(search);
  });

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || null;
  const totalDebt = customers.reduce((sum, customer) => sum + Math.max(0, Number(customer.credit_balance)), 0);

  function daysSince(dateStr?: string) {
    if (!dateStr) return null;
    const diffMs = new Date().getTime() - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  const oldestDebts = customers
    .filter((customer) => Number(customer.credit_balance) > 0 && oldestDebtDates[customer.id])
    .sort(
      (a, b) =>
        new Date(oldestDebtDates[a.id]).getTime() - new Date(oldestDebtDates[b.id]).getTime()
    )
    .slice(0, 5);

  function openNewRecord() {
    setNewRecord(emptyNewRecord);
    setUseNewCustomer(customers.length === 0);
    setMessage("");
    setShowNewRecord(true);
  }

  function openCustomer(customer: Customer) {
    setSelectedCustomerId(customer.id);
    setTxAmount("");
    setTxNote("");
    setTxType("debt");
    setDetailMessage("");
    void loadTransactions(customer.id);
  }

  function openPaymentQuick(customer: Customer, event: React.MouseEvent) {
    event.stopPropagation();
    setSelectedCustomerId(customer.id);
    setTxType("payment");
    setTxAmount(String(Number(customer.credit_balance)));
    setTxNote("");
    setDetailMessage("");
    void loadTransactions(customer.id);
  }

  async function lookupBarcode(barcode: string, onFound: (name: string, price: number) => void) {
    if (!appUser || !barcode.trim()) return;
    setLookingUpBarcode(true);
    const { data } = await supabase
      .from("products")
      .select("name, sale_price")
      .eq("organization_id", appUser.organization_id)
      .eq("barcode", barcode.trim())
      .maybeSingle();
    setLookingUpBarcode(false);

    if (data) {
      onFound(data.name, Number(data.sale_price));
    }
  }

  const newRecordCustomerBalance = useNewCustomer
    ? 0
    : Number(customers.find((c) => c.id === newRecord.customerId)?.credit_balance || 0);
  const newRecordAmount = Number(newRecord.amount) || 0;
  const newRecordProjectedBalance =
    newRecord.type === "debt" ? newRecordCustomerBalance + newRecordAmount : newRecordCustomerBalance - newRecordAmount;

  async function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!appUser) return;

    const amount = Number(newRecord.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Geçerli bir tutar girin.");
      return;
    }
    if (useNewCustomer && !newRecord.newCustomerName.trim()) {
      setMessage("Müşteri adı gerekli.");
      return;
    }
    if (!useNewCustomer && !newRecord.customerId) {
      setMessage("Bir müşteri seçin.");
      return;
    }

    setSaving(true);
    setMessage("");

    let customerId = newRecord.customerId;
    let currentBalance = newRecordCustomerBalance;

    if (useNewCustomer) {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
          organization_id: appUser.organization_id,
          store_id: appUser.store_id,
          name: newRecord.newCustomerName.trim(),
          phone: newRecord.phone.trim() || null,
        })
        .select()
        .single();

      if (customerError || !customer) {
        setMessage(`Müşteri oluşturulamadı: ${friendlyDbError(customerError?.message)}`);
        setSaving(false);
        return;
      }
      customerId = customer.id;
      currentBalance = 0;
    }

    const { error: txError } = await supabase.from("credit_transactions").insert({
      customer_id: customerId,
      organization_id: appUser.organization_id,
      user_id: appUser.id,
      type: newRecord.type,
      amount,
      note: newRecord.item.trim() || null,
    });

    if (txError) {
      setMessage(`Kayıt eklenemedi: ${friendlyDbError(txError.message)}`);
      setSaving(false);
      return;
    }

    const nextBalance = newRecord.type === "debt" ? currentBalance + amount : currentBalance - amount;

    const { error: balanceError } = await supabase
      .from("customers")
      .update({ credit_balance: nextBalance })
      .eq("id", customerId);

    if (balanceError) {
      setMessage(`Bakiye güncellenemedi: ${friendlyDbError(balanceError.message)}`);
      setSaving(false);
      return;
    }

    setMessage("Kayıt eklendi.");
    setNewRecord(emptyNewRecord);
    setShowNewRecord(false);
    await loadCustomers();
    setSaving(false);
  }

  async function recordTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!appUser || !selectedCustomer) return;

    const amount = Number(txAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setDetailMessage("Geçerli bir tutar girin.");
      return;
    }

    setSaving(true);
    setDetailMessage("");

    const { error: txError } = await supabase.from("credit_transactions").insert({
      customer_id: selectedCustomer.id,
      organization_id: appUser.organization_id,
      user_id: appUser.id,
      type: txType,
      amount,
      note: txNote.trim() || null,
    });

    if (txError) {
      setDetailMessage(`İşlem kaydedilemedi: ${friendlyDbError(txError.message)}`);
      setSaving(false);
      return;
    }

    const nextBalance =
      txType === "debt"
        ? Number(selectedCustomer.credit_balance) + amount
        : Number(selectedCustomer.credit_balance) - amount;

    const { error: balanceError } = await supabase
      .from("customers")
      .update({ credit_balance: nextBalance })
      .eq("id", selectedCustomer.id);

    if (balanceError) {
      setDetailMessage(`Bakiye güncellenemedi: ${friendlyDbError(balanceError.message)}`);
    } else {
      setDetailMessage(txType === "debt" ? "Borç eklendi." : "Ödeme kaydedildi.");
      setTxAmount("");
      setTxNote("");
      await loadCustomers();
      await loadTransactions(selectedCustomer.id);
    }

    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Veresiye"
        subtitle="Müşteri borç/ödeme takibi — tüm çalışanlar aynı kaydı görür."
        action={
          <button className="premium-button-primary" type="button" onClick={openNewRecord}>
            <UserPlus size={18} /> Yeni Kayıt Ekle
          </button>
        }
      />
      <QuickLinks
        links={[
          { href: "/app", label: "Fiyat Sorgula", icon: ScanBarcode },
          { href: "/app/kasa", label: "Günlük Kasa", icon: WalletCards },
          { href: "/app/urunler", label: "Ürünler", icon: Package },
          { href: "/app/stok", label: "Stok Takibi", icon: Boxes },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="stat-card">
          <div className="stat-card-icon bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
            <HandCoins size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Toplam Alacak</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{formatMoney(totalDebt)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300">
            <UserPlus size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Kayıtlı Müşteri</p>
            <p className="text-2xl font-black text-cyan-600 dark:text-cyan-300">{customers.length}</p>
          </div>
        </div>

        <div className="data-card p-4 lg:row-span-1">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase text-amber-600 dark:text-amber-400">
            <AlertTriangle size={14} /> En Eski Borçlar
          </div>
          {oldestDebts.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">Açık borç yok.</p>
          ) : (
            <div className="space-y-1.5">
              {oldestDebts.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => openCustomer(customer)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-1.5 py-1 text-left text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <span className="truncate font-bold text-slate-700 dark:text-slate-300">{customer.name}</span>
                  <span className="shrink-0 text-amber-600 dark:text-amber-400">
                    {daysSince(oldestDebtDates[customer.id])} gündür
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {message && !showNewRecord && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
          {message}
        </div>
      )}

      <div className="data-card overflow-hidden">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Müşteri adı veya telefon ile ara..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-slate-950 placeholder-slate-400 focus:border-cyan-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Müşteri</th>
                <th className="px-6 py-3 font-medium">Telefon</th>
                <th className="px-6 py-3 font-medium">Süre</th>
                <th className="px-6 py-3 text-right font-medium">Bakiye</th>
                <th className="px-6 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-400" />
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={HandCoins} message="Müşteri bulunamadı." />
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const balance = Number(customer.credit_balance);
                  const days = balance > 0 ? daysSince(oldestDebtDates[customer.id]) : null;
                  return (
                    <tr
                      key={customer.id}
                      className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      onClick={() => openCustomer(customer)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-950 dark:text-slate-50">{customer.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{customer.phone || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {days !== null ? `${days} gündür` : "-"}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-bold ${
                          balance > 0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {formatMoney(balance)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {balance > 0 && (
                          <button
                            type="button"
                            onClick={(event) => openPaymentQuick(customer, event)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                          >
                            <CheckCircle2 size={13} /> Ödeme Alındı
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNewRecord && (
        <Modal title="Yeni Kayıt Ekle" onClose={() => setShowNewRecord(false)}>
          <form className="grid gap-4" onSubmit={createRecord}>
            {message && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                {message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-300">Müşteri</span>
              {customers.length > 0 && (
                <button
                  type="button"
                  className="text-xs font-bold text-cyan-600 dark:text-cyan-300"
                  onClick={() => setUseNewCustomer((current) => !current)}
                >
                  {useNewCustomer ? "Listeden seç" : "+ Yeni müşteri"}
                </button>
              )}
            </div>

            {useNewCustomer || customers.length === 0 ? (
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Ad Soyad"
                  value={newRecord.newCustomerName}
                  onChange={(v) => setNewRecord({ ...newRecord, newCustomerName: v })}
                  required
                />
                <Field label="Telefon" value={newRecord.phone} onChange={(v) => setNewRecord({ ...newRecord, phone: v })} />
              </div>
            ) : (
              <select
                className="premium-input"
                value={newRecord.customerId}
                onChange={(event) => setNewRecord({ ...newRecord, customerId: event.target.value })}
                required
              >
                <option value="">Müşteri seçin</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} — {formatMoney(Number(customer.credit_balance))}
                  </option>
                ))}
              </select>
            )}

            <div className="grid gap-2">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-300">Ürün / Mal (opsiyonel barkod ile bul)</span>
              <div className="flex gap-2">
                <input
                  className="premium-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Barkod okutun..."
                  value={newRecord.barcode}
                  onChange={(event) => setNewRecord({ ...newRecord, barcode: event.target.value })}
                />
                <button
                  type="button"
                  className="premium-button-secondary shrink-0 px-4"
                  disabled={lookingUpBarcode}
                  onClick={() =>
                    lookupBarcode(newRecord.barcode, (name, price) =>
                      setNewRecord((current) => ({ ...current, item: name, amount: String(price) }))
                    )
                  }
                >
                  {lookingUpBarcode ? <Loader2 size={16} className="animate-spin" /> : <ScanLine size={16} />}
                </button>
              </div>
              <Field
                label="Ürün / Mal adı"
                value={newRecord.item}
                onChange={(v) => setNewRecord({ ...newRecord, item: v })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewRecord({ ...newRecord, type: "debt" })}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 font-bold transition-all active:scale-[0.98] ${newRecord.type === "debt" ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
              >
                <Plus size={16} /> Borç
              </button>
              <button
                type="button"
                onClick={() => setNewRecord({ ...newRecord, type: "payment" })}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 font-bold transition-all active:scale-[0.98] ${newRecord.type === "payment" ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
              >
                <Minus size={16} /> Ödeme
              </button>
            </div>

            <Field label="Tutar (TL)" value={newRecord.amount} onChange={(v) => setNewRecord({ ...newRecord, amount: v })} required />

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-800/60">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Bu kayıttan sonra kalan alacak</p>
              <p
                className={`text-xl font-black ${newRecordProjectedBalance > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
              >
                {formatMoney(newRecordProjectedBalance)}
              </p>
            </div>

            <button className="premium-button-primary mt-2" type="submit" disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <HandCoins size={18} />}
              Kaydet
            </button>
          </form>
        </Modal>
      )}

      {selectedCustomer && (
        <Modal title={selectedCustomer.name} onClose={() => setSelectedCustomerId(null)}>
          <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-800/60">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Güncel Bakiye</p>
            <p
              className={`text-2xl font-black ${
                Number(selectedCustomer.credit_balance) > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatMoney(Number(selectedCustomer.credit_balance))}
            </p>
          </div>

          {detailMessage && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              {detailMessage}
            </div>
          )}

          <form className="grid gap-3" onSubmit={recordTransaction}>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTxType("debt")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 font-bold transition-all active:scale-[0.98] ${txType === "debt" ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
              >
                <Plus size={16} /> Borç Ekle
              </button>
              <button
                type="button"
                onClick={() => setTxType("payment")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 font-bold transition-all active:scale-[0.98] ${txType === "payment" ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
              >
                <Minus size={16} /> Ödeme Al
              </button>
            </div>
            <Field label="Ürün / Mal (opsiyonel)" value={txNote} onChange={setTxNote} />
            <Field label="Tutar (TL)" value={txAmount} onChange={setTxAmount} required />
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-800/60">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Bu kayıttan sonra kalan alacak</p>
              <p className="text-lg font-black text-slate-800 dark:text-slate-200">
                {formatMoney(
                  txType === "debt"
                    ? Number(selectedCustomer.credit_balance) + (Number(txAmount) || 0)
                    : Number(selectedCustomer.credit_balance) - (Number(txAmount) || 0)
                )}
              </p>
            </div>
            <button className="premium-button-primary" type="submit" disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <HandCoins size={18} />}
              Kaydet
            </button>
          </form>

          {transactions.length > 0 && (
            <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="mb-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Son İşlemler</p>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className={tx.type === "debt" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}>
                        {tx.type === "debt" ? "Borç" : "Ödeme"}
                      </span>
                      {tx.note && <span className="ml-2 text-slate-400">· {tx.note}</span>}
                      {tx.app_users?.name && <span className="ml-2 text-slate-400">· {tx.app_users.name}</span>}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatMoney(Number(tx.amount))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
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

function Field({
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
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}
