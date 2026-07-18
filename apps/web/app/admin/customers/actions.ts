"use server";

import { revalidatePath } from "next/cache";
import { getFeatureCodesForPlan } from "@/lib/licensing/access";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRoleKey } from "@/lib/supabase/admin";

function randomLicenseKey() {
  return `BNK-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

type SupabaseMutationClient = Pick<Awaited<ReturnType<typeof createClient>>, "from">;

async function createLicenseWithPlanEntitlements(
  client: SupabaseMutationClient,
  organizationId: string,
  planId: string,
  startsAt: string,
  expiresAt: string,
) {
  const { data: plan, error: planError } = await client.from("plans").select("code, name").eq("id", planId).single();

  if (planError || !plan) {
    return { error: planError?.message || "Paket bulunamadı." };
  }

  const { data: license, error: licenseError } = await client
    .from("licenses")
    .insert({
      organization_id: organizationId,
      plan_id: planId,
      license_key: randomLicenseKey(),
      starts_at: startsAt,
      expires_at: expiresAt,
      status: "active",
    })
    .select("id")
    .single();

  if (licenseError || !license) {
    return { error: licenseError?.message || "Lisans oluşturulamadı." };
  }

  const featureCodes = getFeatureCodesForPlan(plan.code || plan.name);

  if (featureCodes.length > 0) {
    const { error: entitlementError } = await client.from("entitlements").insert(
      featureCodes.map((featureCode) => ({
        organization_id: organizationId,
        license_id: license.id,
        feature_code: featureCode,
        is_enabled: true,
        expires_at: expiresAt,
      })),
    );

    if (entitlementError) {
      return { error: `Lisans oluşturuldu ama paket yetkileri eklenemedi: ${entitlementError.message}` };
    }
  }

  return { success: true };
}

export async function createOrganizationAction(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const ownerName = String(formData.get("owner_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const sector = String(formData.get("sector") || "").trim();
  const planId = String(formData.get("plan_id") || "").trim();
  const startsAt = String(formData.get("starts_at") || "").trim();
  const expiresAt = String(formData.get("expires_at") || "").trim();

  if (!name) {
    return { error: "İşletme adı gerekli." };
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name,
      city: city || null,
      owner_name: ownerName || null,
      email: email || null,
      phone: phone || null,
      sector: sector || null,
    })
    .select()
    .single();

  if (orgError || !org) {
    return { error: orgError?.message || "İşletme oluşturulamadı." };
  }

  if (ownerName) {
    const { error: userError } = await supabase.from("app_users").insert({
      organization_id: org.id,
      name: ownerName,
      email: email || null,
      phone: phone || null,
      role: "owner",
    });

    if (userError) {
      return { error: `İşletme oluşturuldu ama sahip profili eklenemedi: ${userError.message}` };
    }
  }

  if (planId && startsAt && expiresAt) {
    const licenseResult = await createLicenseWithPlanEntitlements(supabase, org.id, planId, startsAt, expiresAt);

    if (licenseResult.error) {
      return { error: `Müşteri oluşturuldu ama lisans eklenemedi: ${licenseResult.error}` };
    }
  }

  revalidatePath("/admin/customers");
  return { success: true };
}

export async function updateOrganizationStatusAction(organizationId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").update({ status }).eq("id", organizationId);
  revalidatePath("/admin/customers");
  return error ? { error: error.message } : { success: true };
}

export async function createLoginAccountAction(
  appUserId: string,
  email: string,
  password: string,
  planId?: string,
  startsAt?: string,
  expiresAt?: string,
) {
  if (!hasServiceRoleKey()) {
    return {
      error:
        "Bu özellik için Supabase service_role anahtarı gerekli. .env.local dosyasına SUPABASE_SERVICE_ROLE_KEY eklendikten sonra kullanılabilir.",
    };
  }

  if (!email || !password || password.length < 6) {
    return { error: "Geçerli bir e-posta ve en az 6 karakterli şifre girin." };
  }

  const admin = createAdminClient();

  const { data: appUser, error: userLookupError } = await admin
    .from("app_users")
    .select("id, organization_id")
    .eq("id", appUserId)
    .single();

  if (userLookupError || !appUser) {
    return { error: userLookupError?.message || "Kullanıcı profili bulunamadı." };
  }

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    return { error: authError?.message || "Giriş hesabı oluşturulamadı." };
  }

  const { error: linkError } = await admin
    .from("app_users")
    .update({ auth_user_id: authUser.user.id, email })
    .eq("id", appUserId);

  if (linkError) {
    return { error: `Hesap oluşturuldu ama kullanıcıya bağlanamadı: ${linkError.message}` };
  }

  if (planId && startsAt && expiresAt) {
    const licenseResult = await createLicenseWithPlanEntitlements(admin, appUser.organization_id, planId, startsAt, expiresAt);

    if (licenseResult.error) {
      return { error: `Hesap oluşturuldu ama lisans eklenemedi: ${licenseResult.error}` };
    }
  }

  revalidatePath("/admin/customers");
  return { success: true };
}
