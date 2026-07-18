"use client";

import type { Tables } from "@buneka/database";
import { Check, Loader2, Puzzle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FEATURE_DEFINITIONS } from "@/lib/licensing/access";
import { PageHeader } from "@/app/app/_components/PageHeader";

type Organization = Tables<"organizations">;
type Entitlement = Tables<"entitlements">;

export default function AdminModulesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [message, setMessage] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("organizations").select("*").order("name");
    if (data) {
      setOrganizations(data);
      if (data.length > 0 && !selectedOrgId) setSelectedOrgId(data[0].id);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const loadEntitlements = useCallback(
    async (orgId: string) => {
      const { data } = await supabase
        .from("entitlements")
        .select("*")
        .eq("organization_id", orgId)
        .is("license_id", null);
      if (data) setEntitlements(data);
    },
    [supabase]
  );

  useEffect(() => {
    void Promise.resolve().then(loadOrganizations);
  }, [loadOrganizations]);

  useEffect(() => {
    if (selectedOrgId) void Promise.resolve().then(() => loadEntitlements(selectedOrgId));
  }, [selectedOrgId, loadEntitlements]);

  function isEnabled(code: string) {
    return entitlements.some((e) => e.feature_code === code && e.is_enabled);
  }

  async function toggleFeature(code: string) {
    if (!selectedOrgId) return;
    setSaving(code);
    setMessage("");

    const existing = entitlements.find((e) => e.feature_code === code);
    const nextValue = !(existing?.is_enabled ?? false);

    if (existing) {
      const { error } = await supabase
        .from("entitlements")
        .update({ is_enabled: nextValue })
        .eq("id", existing.id);
      if (error) setMessage(error.message);
    } else {
      const { error } = await supabase.from("entitlements").insert({
        organization_id: selectedOrgId,
        feature_code: code,
        is_enabled: nextValue,
      });
      if (error) setMessage(error.message);
    }

    await loadEntitlements(selectedOrgId);
    setSaving(null);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Modüller" subtitle="Müşteri bazlı ek modül erişimini yönetin." />

      {message && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
          {message}
        </div>
      )}

      <div className="data-card mb-4 p-5">
        <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-300">
          İşletme
          <select
            className="premium-input"
            value={selectedOrgId}
            onChange={(event) => setSelectedOrgId(event.target.value)}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-cyan-500" size={28} />
        </div>
      ) : (
        <div className="data-card divide-y divide-slate-100 dark:divide-slate-800">
          {FEATURE_DEFINITIONS.map((feature) => {
            const enabled = isEnabled(feature.code);
            return (
              <button
                key={feature.code}
                type="button"
                onClick={() => toggleFeature(feature.code)}
                disabled={saving === feature.code}
                className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <span className="flex items-center gap-3">
                  <Puzzle size={18} className="text-cyan-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{feature.label}</span>
                </span>
                {saving === feature.code ? (
                  <Loader2 size={18} className="animate-spin text-slate-400" />
                ) : (
                  <span
                    className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : ""}`}
                    >
                      {enabled && <Check size={12} className="text-emerald-600" />}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
