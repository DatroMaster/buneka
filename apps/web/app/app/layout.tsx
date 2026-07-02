import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrencyRates } from "@/lib/currency/tcmb";
import AppShell from "./AppShell";

export const dynamic = "force-dynamic";

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

  const rates = await getCurrencyRates();

  return (
    <AppShell user={appUser} rates={rates}>
      {children}
    </AppShell>
  );
}
