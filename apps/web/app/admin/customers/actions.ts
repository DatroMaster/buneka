"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRoleKey } from "@/lib/supabase/admin";

export async function createOrganizationAction(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const ownerName = String(formData.get("owner_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const sector = String(formData.get("sector") || "").trim();

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

  revalidatePath("/admin/customers");
  return { success: true };
}

export async function updateOrganizationStatusAction(organizationId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").update({ status }).eq("id", organizationId);
  revalidatePath("/admin/customers");
  return error ? { error: error.message } : { success: true };
}

export async function createLoginAccountAction(appUserId: string, email: string, password: string) {
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

  revalidatePath("/admin/customers");
  return { success: true };
}
