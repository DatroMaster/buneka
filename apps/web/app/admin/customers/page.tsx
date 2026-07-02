"use client";

import type { Tables } from "@buneka/database";
import type { LucideIcon } from "lucide-react";
import { Building2, KeyRound, Loader2, Plus, Search, ShieldCheck, UserCheck, UserCog, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/app/app/_components/PageHeader";
import { EmptyState } from "@/app/app/_components/EmptyState";
import { createLoginAccountAction, createOrganizationAction, updateOrganizationStatusAction } from "./actions";

type Organization = Tables<"organizations">;
type AppUser = Tables<"app_users">;
type LicenseWithPlan = Tables<"licenses"> & { plans: Pick<Tables<"plans">, "name"> | null };

const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  inactive: "Pasif",
  limited: "Kısıtlı",
  suspended: "Askıda",
};

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [licenses, setLicenses] = useState<LicenseWithPlan[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [accountOrgId, setAccountOrgId] = useState<string | null>(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: orgs }, { data: appUsers }, { data: licenseRows }] = await Promise.all([
      supabase.from("organizations").select("*").order("created_at", { ascending: false }),
      supabase.from("app_users").select("*"),
      supabase.from("licenses").select("*, plans(name)").order("expires_at", { ascending: false }),
    ]);

    if (orgs) setOrganizations(orgs);
    if (appUsers) setUsers(appUsers);
    if (licenseRows) setLicenses(licenseRows as LicenseWithPlan[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  const filteredOrgs = organizations.filter((org) => org.name.toLowerCase().includes(search.toLowerCase()));

  function ownerFor(orgId: string) {
    return users.find((user) => user.organization_id === orgId && user.role === "owner");
  }

  function licenseFor(orgId: string) {
    return licenses.find((license) => license.organization_id === orgId && license.status === "active");
  }

  const activeCustomerCount = organizations.filter((org) => org.status === "active").length;
  const activeLicenseCount = organizations.filter((org) => licenseFor(org.id)).length;
  const loginAccountCount = users.filter((user) => user.auth_user_id).length;

  async function handleCreate(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await createOrganizationAction(formData);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("İşletme eklendi.");
      setShowNew(false);
      await loadData();
    }
    setSaving(false);
  }

  async function handleStatusChange(orgId: string, status: string) {
    setSaving(true);
    const result = await updateOrganizationStatusAction(orgId, status);
    if (result?.error) setMessage(result.error);
    await loadData();
    setSaving(false);
  }

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accountOrgId) return;
    const owner = ownerFor(accountOrgId);
    if (!owner) {
      setMessage("Önce bu işletme için bir sahip profili olmalı.");
      return;
    }

    setSaving(true);
    setMessage("");
    const result = await createLoginAccountAction(owner.id, accountEmail.trim(), accountPassword);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("Giriş hesabı oluşturuldu.");
      setAccountOrgId(null);
      setAccountEmail("");
      setAccountPassword("");
      await loadData();
    }
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Müşteriler"
        subtitle="Müşteri ekleyin, giriş hesabı açın, lisans ve özet durumunu buradan yönetin."
        action={
          <button className="premium-button-primary" type="button" onClick={() => setShowNew(true)}>
            <Plus size={18} /> Yeni Müşteri
          </button>
        }
      />

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <AdminStatCard icon={Building2} label="Toplam müşteri" value={organizations.length} hint="Kayıtlı işletme" />
        <AdminStatCard icon={ShieldCheck} label="Aktif / lisanslı" value={`${activeCustomerCount} / ${activeLicenseCount}`} hint="Durum ve lisans özeti" />
        <AdminStatCard icon={UserCheck} label="Giriş hesabı" value={loginAccountCount} hint="Sisteme girebilen müşteri" />
      </div>

      {message && (
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
              placeholder="İşletme adı ile ara..."
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
                <th className="px-6 py-3 font-medium">İşletme</th>
                <th className="px-6 py-3 font-medium">Sahip</th>
                <th className="px-6 py-3 font-medium">Lisans</th>
                <th className="px-6 py-3 font-medium">Durum</th>
                <th className="px-6 py-3 text-right font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-400" />
                  </td>
                </tr>
              ) : filteredOrgs.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={Building2} message="İşletme bulunamadı." />
                  </td>
                </tr>
              ) : (
                filteredOrgs.map((org) => {
                  const owner = ownerFor(org.id);
                  const license = licenseFor(org.id);
                  return (
                    <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-950 dark:text-slate-50">{org.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{org.city || "-"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {owner ? (
                          <div>
                            <div className="font-medium">{owner.name}</div>
                            <div className="text-xs text-slate-400">
                              {owner.auth_user_id ? "Giriş hesabı var" : "Giriş hesabı yok"}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {license ? license.plans?.name : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={org.status}
                          onChange={(event) => handleStatusChange(org.id, event.target.value)}
                          disabled={saving}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {Object.entries(STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {owner && !owner.auth_user_id && (
                          <button
                            type="button"
                            onClick={() => setAccountOrgId(org.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-300"
                          >
                            <UserCog size={14} /> Hesap Oluştur
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

      {showNew && (
        <Modal title="Yeni Müşteri / İşletme" onClose={() => setShowNew(false)}>
          <form className="grid gap-4" action={handleCreate}>
            <Field name="name" label="İşletme adı" required />
            <Field name="sector" label="Sektör" />
            <Field name="city" label="Şehir" />
            <Field name="owner_name" label="Sahip adı soyadı" />
            <div className="grid grid-cols-2 gap-3">
              <Field name="email" label="E-posta" />
              <Field name="phone" label="Telefon" />
            </div>
            <button className="premium-button-primary mt-2" type="submit" disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Building2 size={18} />}
              Müşteriyi Kaydet
            </button>
          </form>
        </Modal>
      )}

      {accountOrgId && (
        <Modal title="Giriş Hesabı Oluştur" onClose={() => setAccountOrgId(null)}>
          <form className="grid gap-4" onSubmit={handleCreateAccount}>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Bu işletmenin sahibi için e-posta/şifre ile giriş yapabileceği bir hesap oluşturur.
            </p>
            <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
              E-posta
              <input
                className="premium-input"
                type="email"
                value={accountEmail}
                onChange={(event) => setAccountEmail(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
              Geçici şifre
              <input
                className="premium-input"
                type="text"
                value={accountPassword}
                onChange={(event) => setAccountPassword(event.target.value)}
                required
                minLength={6}
              />
            </label>
            <button className="premium-button-primary" type="submit" disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
              Hesabı Oluştur
            </button>
          </form>
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

function AdminStatCard({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string | number; hint: string }) {
  return (
    <div className="data-card flex items-center gap-4 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300">
        <Icon size={21} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 font-display text-2xl font-black text-slate-950 dark:text-slate-50">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      </div>
    </div>
  );
}

function Field({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
      {label}
      <input className="premium-input" type="text" name={name} required={required} />
    </label>
  );
}
