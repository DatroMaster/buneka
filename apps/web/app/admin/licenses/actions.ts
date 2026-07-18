"use server";

import { revalidatePath } from "next/cache";
import { getFeatureCodesForPlan } from "@/lib/licensing/access";
import { createClient } from "@/lib/supabase/server";

function randomLicenseKey() {
  return `BNK-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function createLicenseAction(form: {
  organization_id: string;
  plan_id: string;
  starts_at: string;
  expires_at: string;
}) {
  const supabase = await createClient();

  if (!form.organization_id || !form.plan_id || !form.starts_at || !form.expires_at) {
    return { error: "İşletme, paket, başlangıç ve bitiş tarihi gerekli." };
  }

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("code, name")
    .eq("id", form.plan_id)
    .single();

  if (planError || !plan) {
    return { error: planError?.message || "Paket bulunamadı." };
  }

  const { data: license, error: licenseError } = await supabase
    .from("licenses")
    .insert({
      organization_id: form.organization_id,
      plan_id: form.plan_id,
      license_key: randomLicenseKey(),
      starts_at: form.starts_at,
      expires_at: form.expires_at,
      status: "active",
    })
    .select("id")
    .single();

  if (licenseError || !license) {
    return { error: licenseError?.message || "Lisans oluşturulamadı." };
  }

  const featureCodes = getFeatureCodesForPlan(plan.code || plan.name);

  if (featureCodes.length > 0) {
    const { error: entitlementError } = await supabase.from("entitlements").insert(
      featureCodes.map((featureCode) => ({
        organization_id: form.organization_id,
        license_id: license.id,
        feature_code: featureCode,
        is_enabled: true,
        expires_at: form.expires_at,
      })),
    );

    if (entitlementError) {
      return { error: `Lisans oluşturuldu ama paket yetkileri eklenemedi: ${entitlementError.message}` };
    }
  }

  revalidatePath("/admin/licenses");
  revalidatePath("/admin/customers");
  return { success: true };
}

export async function updateLicenseStatusAction(licenseId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("licenses").update({ status }).eq("id", licenseId);

  if (error) {
    return { error: error.message };
  }

  const { error: entitlementError } = await supabase
    .from("entitlements")
    .update({ is_enabled: status === "active" })
    .eq("license_id", licenseId);

  revalidatePath("/admin/licenses");
  revalidatePath("/admin/customers");

  return entitlementError ? { error: entitlementError.message } : { success: true };
}
