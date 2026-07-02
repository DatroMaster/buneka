-- Grants super_admin / admin_staff app_users cross-organization read/write
-- access needed by the admin panel (customer, license and module management).
-- Without this, RLS silently blocks every admin write since the existing
-- policies only ever match the caller's OWN organization_id.
create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.app_users
    where auth_user_id = auth.uid()
      and role in ('super_admin', 'admin_staff')
  );
$$;

create policy "Admins can view all organizations"
on public.organizations for select
to authenticated
using (public.is_admin());

create policy "Admins can insert organizations"
on public.organizations for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update all organizations"
on public.organizations for update
to authenticated
using (public.is_admin());

create policy "Admins can view all app_users"
on public.app_users for select
to authenticated
using (public.is_admin());

create policy "Admins can insert app_users"
on public.app_users for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update all app_users"
on public.app_users for update
to authenticated
using (public.is_admin());

create policy "Admins can view all licenses"
on public.licenses for select
to authenticated
using (public.is_admin());

create policy "Admins can insert licenses"
on public.licenses for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update all licenses"
on public.licenses for update
to authenticated
using (public.is_admin());

create policy "Admins can manage entitlements"
on public.entitlements for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage modules"
on public.modules for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
