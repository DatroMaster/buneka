"use server";

import { getFeatureCodesForPlan } from "@/lib/licensing/access";
import { createClient } from "../../../lib/supabase/server";

export async function lookupProduct(barcode: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get user org
  const { data: appUser } = await supabase
    .from("app_users")
    .select("id, organization_id, store_id")
    .eq("auth_user_id", user.id)
    .single();

  if (!appUser?.organization_id) {
    return { error: "No organization found" };
  }

  // Find product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("organization_id", appUser.organization_id)
    .eq("barcode", barcode)
    .single();

  if (product) {
    // Record price query asynchronously (fire and forget is fine, but we'll await for simplicity)
    await supabase.from("price_queries").insert({
      organization_id: appUser.organization_id,
      store_id: appUser.store_id,
      product_id: product.id,
      barcode: barcode,
      user_id: appUser.id,
      source: "manual",
    });
    return { product };
  }

  return { product: null };
}

export async function recordSale(productId: string, price: number, paymentType: "cash" | "card" = "cash") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: appUser } = await supabase
    .from("app_users")
    .select("id, organization_id, store_id")
    .eq("auth_user_id", user.id)
    .single();

  if (!appUser) return { error: "No user found" };

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: activeLicense }, { data: saleEntitlement }] = await Promise.all([
    supabase
      .from("licenses")
      .select("plans(code)")
      .eq("organization_id", appUser.organization_id)
      .eq("status", "active")
      .lte("starts_at", today)
      .gte("expires_at", today)
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("entitlements")
      .select("id")
      .eq("organization_id", appUser.organization_id)
      .eq("feature_code", "sale_create")
      .eq("is_enabled", true)
      .or(`expires_at.is.null,expires_at.gte.${today}`)
      .limit(1)
      .maybeSingle(),
  ]);

  const planRelation = activeLicense?.plans as { code: string | null } | null | undefined;
  if (!saleEntitlement && !getFeatureCodesForPlan(planRelation?.code).includes("sale_create")) {
    return { error: "Satış kaydı için Buneka Kasa veya üst paket gerekir." };
  }

  // Create sale
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      organization_id: appUser.organization_id,
      store_id: appUser.store_id,
      user_id: appUser.id,
      total_amount: price,
      payment_type: paymentType,
    })
    .select("id")
    .single();

  if (saleError || !sale) return { error: "Failed to create sale" };

  // Create sale item
  await supabase.from("sale_items").insert({
    sale_id: sale.id,
    product_id: productId,
    quantity: 1,
    sale_price: price,
  });

  return { success: true };
}
