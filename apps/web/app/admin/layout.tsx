import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["super_admin", "admin_staff"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: appUser } = await supabase
    .from("app_users")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!appUser || !ADMIN_ROLES.includes(appUser.role)) {
    redirect("/app");
  }

  return <AdminShell user={appUser}>{children}</AdminShell>;
}
