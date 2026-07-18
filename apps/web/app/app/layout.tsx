import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FEATURE_DEFINITIONS, getFeatureCodesForPlan, isFeatureCode, type FeatureCode } from "@/lib/licensing/access";
import { createClient } from "@/lib/supabase/server";
import { getCurrencyRates } from "@/lib/currency/tcmb";
import AppShell from "./AppShell";

type ActiveLicense = {
  id: string;
  expires_at: string;
  plans: { name: string | null; code: string | null } | null;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yönetim Platformu",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get app_user details
  const { data: appUser } = await supabase
    .from("app_users")
    .select("*, organizations(name), stores(name)")
    .eq("auth_user_id", user.id)
    .single();

  if (!appUser) {
    // If no app user found, redirect to login or error
    redirect("/login?error=Kullanıcı profili bulunamadı");
  }

  const today = new Date().toISOString().slice(0, 10);
  const isAdmin = ["super_admin", "admin_staff"].includes(appUser.role);

  const [{ data: activeLicenseData }, { data: entitlementRows }, rates] = await Promise.all([
    supabase
      .from("licenses")
      .select("id, expires_at, plans(name, code)")
      .eq("organization_id", appUser.organization_id)
      .eq("status", "active")
      .lte("starts_at", today)
      .gte("expires_at", today)
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("entitlements")
      .select("feature_code, is_enabled, expires_at")
      .eq("organization_id", appUser.organization_id)
      .eq("is_enabled", true)
      .or(`expires_at.is.null,expires_at.gte.${today}`),
    getCurrencyRates(),
  ]);

  const activeLicense = activeLicenseData as ActiveLicense | null;
  const featureSet = new Set<FeatureCode>(
    isAdmin ? FEATURE_DEFINITIONS.map((feature) => feature.code) : getFeatureCodesForPlan(activeLicense?.plans?.code),
  );

  if (!isAdmin) {
    entitlementRows?.forEach((row) => {
      if (isFeatureCode(row.feature_code)) featureSet.add(row.feature_code);
    });
  }

  return (
    <AppShell
      user={appUser}
      rates={rates}
      licenseAccess={{
        planName: activeLicense?.plans?.name || null,
        expiresAt: activeLicense?.expires_at || null,
        featureCodes: [...featureSet],
      }}
    >
      {children}
    </AppShell>
  );
}
