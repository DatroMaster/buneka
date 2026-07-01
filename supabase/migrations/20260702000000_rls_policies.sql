-- Helper function to get the current authenticated user's organization_id
create or replace function public.current_organization_id()
returns uuid
language sql security definer set search_path = public
as $$
  select organization_id from public.app_users where auth_user_id = auth.uid() limit 1;
$$;

-- organizations
create policy "Users can view their own organization"
on public.organizations for select
to authenticated
using (id = public.current_organization_id());

create policy "Users can update their own organization"
on public.organizations for update
to authenticated
using (id = public.current_organization_id());

-- stores
create policy "Users can view their organization stores"
on public.stores for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can modify their organization stores"
on public.stores for all
to authenticated
using (organization_id = public.current_organization_id());

-- app_users
create policy "Users can view users in their organization"
on public.app_users for select
to authenticated
using (organization_id = public.current_organization_id());

-- plans
create policy "Anyone can view plans"
on public.plans for select
to authenticated
using (true);

-- licenses
create policy "Users can view their organization licenses"
on public.licenses for select
to authenticated
using (organization_id = public.current_organization_id());

-- modules
create policy "Anyone can view modules"
on public.modules for select
to authenticated
using (true);

-- entitlements
create policy "Users can view their organization entitlements"
on public.entitlements for select
to authenticated
using (organization_id = public.current_organization_id());

-- products
create policy "Users can view their organization products"
on public.products for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can modify their organization products"
on public.products for all
to authenticated
using (organization_id = public.current_organization_id());

-- price_queries
create policy "Users can view their organization queries"
on public.price_queries for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can insert queries for their organization"
on public.price_queries for insert
to authenticated
with check (organization_id = public.current_organization_id());

-- sales
create policy "Users can view their organization sales"
on public.sales for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can insert sales for their organization"
on public.sales for insert
to authenticated
with check (organization_id = public.current_organization_id());

-- sale_items
create policy "Users can view their organization sale items"
on public.sale_items for select
to authenticated
using (sale_id in (select id from public.sales where organization_id = public.current_organization_id()));

create policy "Users can insert sale items for their organization sales"
on public.sale_items for insert
to authenticated
with check (sale_id in (select id from public.sales where organization_id = public.current_organization_id()));

-- stock_movements
create policy "Users can view their organization stock movements"
on public.stock_movements for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can insert stock movements for their organization"
on public.stock_movements for insert
to authenticated
with check (organization_id = public.current_organization_id());

-- campaigns
create policy "Users can view active campaigns"
on public.campaigns for select
to authenticated
using (is_active = true);

-- organization_campaigns
create policy "Users can view their organization campaigns"
on public.organization_campaigns for select
to authenticated
using (organization_id = public.current_organization_id());

-- devices
create policy "Anyone can view active devices"
on public.devices for select
to authenticated
using (is_active = true);

-- audit_logs
create policy "Users can view their organization audit logs"
on public.audit_logs for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can insert audit logs for their organization"
on public.audit_logs for insert
to authenticated
with check (organization_id = public.current_organization_id());
