"use client";

import type { Tables } from "@buneka/database";
import {
  FileSpreadsheet,
  Loader2,
  MonitorSmartphone,
  Save,
  ShieldCheck,
  Store,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "../_components/PageHeader";

type AppUser = Pick<Tables<"app_users">, "organization_id">;
type Organization = Tables<"organizations">;
type OrgSettings = Tables<"organization_settings">;
type LicenseWithPlan = Tables<"licenses"> & { plans: Pick<Tables<"plans">, "name" | "code"> | null };

const emptyOrgForm = { name: "", city: "", phone: "", email: "", tax_number: "", sector: "" };
const emptySettingsForm = {
  default_payment_type: "cash",
  stock_alert_level: "5",
  multi_device_enabled: false,
};

export default function AyarlarPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [orgForm, setOrgForm] = useState(emptyOrgForm);
  const [settingsForm, setSettingsForm] = useState(emptySettingsForm);
  const [license, setLicense] = useState<LicenseWithPlan | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: appUser } = await supabase
      .from("app_users")
      .select("organization_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!appUser) {
      setLoading(false);
      return;
    }

    const currentUser = appUser as AppUser;
    setOrganizationId(currentUser.organization_id);

    const [{ data: org }, { data: settings }, { data: licenseData }] = await Promise.all([
      supabase.from("organizations").select("*").eq("id", currentUser.organization_id).single(),
      supabase
        .from("organization_settings")
        .select("*")
        .eq("organization_id", currentUser.organization_id)
        .maybeSingle(),
      supabase
        .from("licenses")
        .select("*, plans(name, code)")
        .eq("organization_id", currentUser.organization_id)
        .eq("status", "active")
        .order("expires_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (org) {
      const organization = org as Organization;
      setOrgForm({
        name: organization.name || "",
        city: organization.city || "",
        phone: organization.phone || "",
        email: organization.email || "",
        tax_number: organization.tax_number || "",
        sector: organization.sector || "",
      });
    }

    if (settings) {
      const orgSettings = settings as OrgSettings;
      setSettingsForm({
        default_payment_type: orgSettings.default_payment_type,
        stock_alert_level: String(orgSettings.stock_alert_level),
        multi_device_enabled: orgSettings.multi_device_enabled,
      });
    }

    if (licenseData) {
      setLicense(licenseData as LicenseWithPlan);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  async function saveOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organizationId) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("organizations")
      .update({
        name: orgForm.name.trim(),
        city: orgForm.city.trim() || null,
        phone: orgForm.phone.trim() || null,
        email: orgForm.email.trim() || null,
        tax_number: orgForm.tax_number.trim() || null,
        sector: orgForm.sector.trim() || null,
      })
      .eq("id", organizationId);

    setMessage(error ? `İşletme bilgileri kaydedilemedi: ${error.message}` : "İşletme bilgileri güncellendi.");
    setSaving(false);
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organizationId) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("organization_settings").upsert({
      organization_id: organizationId,
      default_payment_type: settingsForm.default_payment_type,
      stock_alert_level: Number(settingsForm.stock_alert_level || 0),
      multi_device_enabled: settingsForm.multi_device_enabled,
    });

    setMessage(error ? `Ayarlar kaydedilemedi: ${error.message}` : "Ayarlar güncellendi.");
    setSaving(false);
  }

  async function importProducts(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organizationId || !bulkText.trim()) return;

    setBulkSaving(true);
    setBulkMessage("");

    const rows = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [barcode, name, category, salePrice, stock] = line.split(";").map((part) => part.trim());
        return { barcode, name, category, salePrice, stock };
      })
      .filter((row) => row.barcode && row.name && row.salePrice);

    if (rows.length === 0) {
      setBulkMessage("Geçerli satır bulunamadı. Format: barkod;ad;kategori;fiyat;stok");
      setBulkSaving(false);
      return;
    }

    const { error } = await supabase.from("products").insert(
      rows.map((row) => ({
        organization_id: organizationId,
        barcode: row.barcode,
        name: row.name,
        category: row.category || null,
        sale_price: Number(row.salePrice),
        stock_quantity: row.stock ? Number(row.stock) : 0,
      }))
    );

    if (error) {
      setBulkMessage(`Aktarım tamamlanamadı: ${error.message}`);
    } else {
      setBulkMessage(`${rows.length} ürün eklendi.`);
      setBulkText("");
    }

    setBulkSaving(false);
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col pb-10">
      <PageHeader title="Ayarlar" subtitle="İşletme ve sistem ayarlarınız." />

      {message && (
        <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
          {message}
        </div>
      )}

      <div className="mb-3 grid shrink-0 grid-cols-1 gap-3 rounded-2xl border border-amber-300/45 bg-amber-50 px-4 py-3 shadow-sm dark:border-amber-300/35 dark:bg-amber-400/14 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-amber-700 dark:text-amber-200">Lisans ve yetki</p>
          {license ? (
            <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
              {license.plans?.name || "Aktif paket"} · {new Date(license.expires_at).toLocaleDateString("tr-TR")} · {license.status}
            </p>
          ) : (
            <p className="text-sm font-bold text-slate-950 dark:text-slate-50">Aktif lisans kaydı bulunamadı.</p>
          )}
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          Görünür
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.25fr_0.85fr_1fr]">
        <form onSubmit={saveOrganization} className="data-card p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
            <Store size={20} />
          </div>
          <h2 className="font-display mb-1 text-lg font-bold text-slate-950 dark:text-slate-50">İşletme bilgileri</h2>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Üye işletmenizin bilgileri — burada güncelleyebilirsiniz.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="İşletme adı" value={orgForm.name} onChange={(v) => setOrgForm({ ...orgForm, name: v })} required />
            <Field label="Şehir" value={orgForm.city} onChange={(v) => setOrgForm({ ...orgForm, city: v })} />
            <Field label="Telefon" value={orgForm.phone} onChange={(v) => setOrgForm({ ...orgForm, phone: v })} />
            <Field label="E-posta" value={orgForm.email} onChange={(v) => setOrgForm({ ...orgForm, email: v })} />
            <Field label="Vergi no" value={orgForm.tax_number} onChange={(v) => setOrgForm({ ...orgForm, tax_number: v })} />
            <Field label="Sektör" value={orgForm.sector} onChange={(v) => setOrgForm({ ...orgForm, sector: v })} />
          </div>
          <button className="premium-button-primary mt-3" type="submit" disabled={saving}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Kaydet
          </button>
        </form>

        <div className="grid gap-3">
        <form onSubmit={saveSettings} className="data-card p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
            <MonitorSmartphone size={20} />
          </div>
          <h2 className="font-display mb-1 text-lg font-bold text-slate-950 dark:text-slate-50">Cihaz ve satış</h2>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Varsayılan ödeme tipi, stok uyarı seviyesi ve çoklu cihaz erişimi.
          </p>
          <div className="grid gap-2">
            <label className="grid gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-300">
              Varsayılan ödeme tipi
              <select
                className="premium-input"
                value={settingsForm.default_payment_type}
                onChange={(event) => setSettingsForm({ ...settingsForm, default_payment_type: event.target.value })}
              >
                <option value="cash">Nakit</option>
                <option value="card">Kart</option>
                <option value="transfer">Havale</option>
                <option value="other">Diğer</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-300">
              Stok uyarı seviyesi
              <input
                className="premium-input"
                type="number"
                min={0}
                value={settingsForm.stock_alert_level}
                onChange={(event) => setSettingsForm({ ...settingsForm, stock_alert_level: event.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
              <input
                type="checkbox"
                checked={settingsForm.multi_device_enabled}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, multi_device_enabled: event.target.checked })
                }
              />
              Çoklu cihaz erişimini aç
            </label>
          </div>
          <button className="premium-button-primary mt-3" type="submit" disabled={saving}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Kaydet
          </button>
        </form>

        <div className="hidden">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
            <ShieldCheck size={20} />
          </div>
          <h2 className="font-display mb-1 text-lg font-bold text-slate-950 dark:text-slate-50">Lisans ve yetki</h2>
          {license ? (
            <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <p>
                Paket: <span className="font-bold text-slate-950 dark:text-slate-50">{license.plans?.name}</span>
              </p>
              <p>
                Bitiş tarihi:{" "}
                <span className="font-bold text-slate-950 dark:text-slate-50">
                  {new Date(license.expires_at).toLocaleDateString("tr-TR")}
                </span>
              </p>
              <p>
                Durum: <span className="font-bold text-emerald-600 dark:text-emerald-400">{license.status}</span>
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Aktif bir lisans kaydı bulunamadı. Lisans işlemleri için admin panelini kullanın.
            </p>
          )}
        </div>
        </div>

        <form onSubmit={importProducts} className="data-card p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
            <FileSpreadsheet size={20} />
          </div>
          <h2 className="font-display mb-1 text-lg font-bold text-slate-950 dark:text-slate-50">Toplu ürün aktarımı</h2>
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
            Her satıra bir ürün: <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">barkod;ad;kategori;fiyat;stok</code>
          </p>
          <textarea
            className="premium-input h-32 resize-none font-mono text-sm"
            value={bulkText}
            onChange={(event) => setBulkText(event.target.value)}
            placeholder={"8690000000011;Su 500ml;İçecek;15;100\n8690000000028;Çikolata;Atıştırmalık;22;40"}
          />
          {bulkMessage && <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">{bulkMessage}</p>}
          <button className="premium-button-primary mt-3" type="submit" disabled={bulkSaving}>
            {bulkSaving ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />}
            Ürünleri Aktar
          </button>
        </form>
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
    <label className="grid gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-300">
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
