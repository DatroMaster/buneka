"use client";

import type { Tables } from "@buneka/database";
import { KeyRound, Loader2, Plus, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getFeatureCodesForPlan, getFeatureLabels } from "@/lib/licensing/access";
import { PageHeader } from "@/app/app/_components/PageHeader";
import { EmptyState } from "@/app/app/_components/EmptyState";
import { createLicenseAction, updateLicenseStatusAction } from "./actions";

type Organization = Tables<"organizations">;
type Plan = Tables<"plans">;
type LicenseWithPlan = Tables<"licenses"> & { plans: Pick<Tables<"plans">, "name" | "code"> | null; organizations: Pick<Tables<"organizations">, "name"> | null };

export default function AdminLicensesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [licenses, setLicenses] = useState<LicenseWithPlan[]>([]);
  const [message, setMessage] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(() => {
    const starts = new Date();
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    return {
      organization_id: "",
      plan_id: "",
      starts_at: starts.toISOString().slice(0, 10),
      expires_at: expires.toISOString().slice(0, 10),
    };
  });
  const supabase = useMemo(() => createClient(), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: orgs }, { data: planRows }, { data: licenseRows }] = await Promise.all([
      supabase.from("organizations").select("*").order("name"),
      supabase.from("plans").select("*").order("annual_price"),
      supabase
        .from("licenses")
        .select("*, plans(name, code), organizations(name)")
        .order("created_at", { ascending: false }),
    ]);

    if (orgs) setOrganizations(orgs);
    if (planRows) setPlans(planRows);
    if (licenseRows) setLicenses(licenseRows as LicenseWithPlan[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  async function createLicense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.organization_id || !form.plan_id) return;

    setSaving(true);
    setMessage("");

    const result = await createLicenseAction(form);

    if (result?.error) {
      setMessage(`Lisans oluşturulamadı: ${result.error}`);
    } else {
      setMessage("Lisans oluşturuldu ve paket yetkileri açıldı.");
      setShowNew(false);
      await loadData();
    }

    setSaving(false);
  }

  async function updateStatus(licenseId: string, status: string) {
    setSaving(true);
    const result = await updateLicenseStatusAction(licenseId, status);
    if (result?.error) setMessage(result.error);
    await loadData();
    setSaving(false);
  }

  const selectedPlan = plans.find((plan) => plan.id === form.plan_id);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Lisanslar"
        subtitle="Paket ata, yenile, süresini yönet."
        action={
          <button className="premium-button-primary" type="button" onClick={() => setShowNew(true)}>
            <Plus size={18} /> Yeni Lisans
          </button>
        }
      />

      {message && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
          {message}
        </div>
      )}

      <div className="data-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">İşletme</th>
                <th className="px-6 py-3 font-medium">Paket</th>
                <th className="px-6 py-3 font-medium">Bitiş</th>
                <th className="px-6 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-400" />
                  </td>
                </tr>
              ) : licenses.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState icon={KeyRound} message="Lisans bulunamadı." />
                  </td>
                </tr>
              ) : (
                licenses.map((license) => (
                  <tr key={license.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="px-6 py-4 font-medium text-slate-950 dark:text-slate-50">
                      {license.organizations?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="font-bold text-slate-950 dark:text-slate-50">{license.plans?.name}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {getFeatureLabelsByPlanCode(license.plans?.code).slice(0, 3).join(" · ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(license.expires_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={license.status}
                        onChange={(event) => updateStatus(license.id, event.target.value)}
                        disabled={saving}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <option value="active">Aktif</option>
                        <option value="expired">Süresi Doldu</option>
                        <option value="limited">Kısıtlı</option>
                        <option value="cancelled">İptal</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-bg)] p-6 text-slate-950 shadow-2xl dark:text-slate-50">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-black">Yeni Lisans</h2>
              <button
                className="rounded-full bg-white p-2 text-slate-950 transition-transform active:scale-90 dark:bg-slate-800 dark:text-slate-50"
                type="button"
                onClick={() => setShowNew(false)}
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>
            <form className="grid gap-4" onSubmit={createLicense}>
              <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
                İşletme
                <select
                  className="premium-input"
                  value={form.organization_id}
                  onChange={(event) => setForm({ ...form, organization_id: event.target.value })}
                  required
                >
                  <option value="">Seçin</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
                Paket
                <select
                  className="premium-input"
                  value={form.plan_id}
                  onChange={(event) => setForm({ ...form, plan_id: event.target.value })}
                  required
                >
                  <option value="">Seçin</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — {plan.annual_price} TL
                    </option>
                  ))}
                </select>
              </label>
              {selectedPlan && (
                <PlanPreview plan={selectedPlan} />
              )}
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
                  Başlangıç
                  <input
                    className="premium-input"
                    type="date"
                    value={form.starts_at}
                    onChange={(event) => setForm({ ...form, starts_at: event.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
                  Bitiş
                  <input
                    className="premium-input"
                    type="date"
                    value={form.expires_at}
                    onChange={(event) => setForm({ ...form, expires_at: event.target.value })}
                    required
                  />
                </label>
              </div>
              <button className="premium-button-primary mt-2" type="submit" disabled={saving}>
                {saving ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
                Lisansı Oluştur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getFeatureLabelsByPlanCode(planCode: string | null | undefined) {
  return getFeatureLabels(getFeatureCodesForPlan(planCode));
}

function PlanPreview({ plan }: { plan: Plan }) {
  const labels = getFeatureLabelsByPlanCode(plan.code);

  return (
    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.08] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">Bu lisansla açılacak özellikler</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {labels.map((label) => (
          <span key={label} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-200">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
