import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@buneka/database";

export function hasServiceRoleKey() {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/** Server-only client that bypasses RLS. Never import this from client components. */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY tanımlı değil.");
  }

  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
