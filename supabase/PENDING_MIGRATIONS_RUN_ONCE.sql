-- ============================================================
-- BUNEKA — Bekleyen 4 migration'ın birleştirilmiş hâli.
--
-- NASIL ÇALIŞTIRILIR:
--   1) Supabase Dashboard'a girin (supabase.com/dashboard).
--   2) Projenizi açın (dvvuadjqekpqgewyuzir).
--   3) Sol menüden "SQL Editor" > "New query".
--   4) Bu dosyanın TAMAMINI kopyalayıp yapıştırın.
--   5) Sağ alttaki "Run" butonuna basın.
--
-- Bu script tekrar çalıştırılsa bile güvenlidir (idempotent) —
-- zaten var olan tablo/kolon/policy'leri atlar, hata vermez.
--
-- Uygulandıktan sonra aktif olacak özellikler:
--   - Ürünlerde USD alış fiyatı girişi (TCMB kuruyla)
--   - Ayarlar sayfasında gerçek kayıt (İşletme bilgileri, cihaz/ödeme ayarları)
--   - Veresiye (müşteri borç/ödeme takibi)
--   - Admin panelinde tüm işletmeleri görüp yönetebilme
-- ============================================================

-- 1) Ürünlerde USD alış fiyatı desteği
alter table public.products
  add column if not exists purchase_currency text not null default 'TRY',
  add column if not exists purchase_price_original numeric(12, 2);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_purchase_currency_check') then
    alter table public.products
      add constraint products_purchase_currency_check check (purchase_currency in ('TRY', 'USD'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_purchase_price_original_check') then
    alter table public.products
      add constraint products_purchase_price_original_check check (purchase_price_original is null or purchase_price_original >= 0);
  end if;
end $$;

-- 2) İşletme ayarları (Ayarlar sayfası kalıcı kayıt)
create table if not exists public.organization_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  default_payment_type text not null default 'cash' check (default_payment_type in ('cash', 'card', 'transfer', 'other')),
  stock_alert_level numeric(12, 3) not null default 5 check (stock_alert_level >= 0),
  multi_device_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists organization_settings_set_updated_at on public.organization_settings;
create trigger organization_settings_set_updated_at
before update on public.organization_settings
for each row execute function public.set_updated_at();

alter table public.organization_settings enable row level security;

drop policy if exists "Users can view their organization settings" on public.organization_settings;
create policy "Users can view their organization settings"
on public.organization_settings for select
to authenticated
using (organization_id = public.current_organization_id());

drop policy if exists "Users can modify their organization settings" on public.organization_settings;
create policy "Users can modify their organization settings"
on public.organization_settings for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

-- 3) Veresiye (müşteri cari / borç-ödeme takibi)
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  store_id uuid references public.stores(id) on delete set null,
  name text not null,
  phone text,
  credit_balance numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.app_users(id) on delete set null,
  type text not null check (type in ('debt', 'payment')),
  amount numeric(12, 2) not null check (amount > 0),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists customers_organization_id_idx on public.customers(organization_id);
create index if not exists credit_transactions_customer_id_idx on public.credit_transactions(customer_id, created_at desc);
create index if not exists credit_transactions_organization_id_idx on public.credit_transactions(organization_id, created_at desc);

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

alter table public.customers enable row level security;
alter table public.credit_transactions enable row level security;

drop policy if exists "Users can view their organization customers" on public.customers;
create policy "Users can view their organization customers"
on public.customers for select
to authenticated
using (organization_id = public.current_organization_id());

drop policy if exists "Users can modify their organization customers" on public.customers;
create policy "Users can modify their organization customers"
on public.customers for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists "Users can view their organization credit transactions" on public.credit_transactions;
create policy "Users can view their organization credit transactions"
on public.credit_transactions for select
to authenticated
using (organization_id = public.current_organization_id());

drop policy if exists "Users can insert credit transactions for their organization" on public.credit_transactions;
create policy "Users can insert credit transactions for their organization"
on public.credit_transactions for insert
to authenticated
with check (organization_id = public.current_organization_id());

-- 4) Admin paneli için cross-organization erişim
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

drop policy if exists "Admins can view all organizations" on public.organizations;
create policy "Admins can view all organizations"
on public.organizations for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert organizations" on public.organizations;
create policy "Admins can insert organizations"
on public.organizations for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update all organizations" on public.organizations;
create policy "Admins can update all organizations"
on public.organizations for update
to authenticated
using (public.is_admin());

drop policy if exists "Admins can view all app_users" on public.app_users;
create policy "Admins can view all app_users"
on public.app_users for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert app_users" on public.app_users;
create policy "Admins can insert app_users"
on public.app_users for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update all app_users" on public.app_users;
create policy "Admins can update all app_users"
on public.app_users for update
to authenticated
using (public.is_admin());

drop policy if exists "Admins can view all licenses" on public.licenses;
create policy "Admins can view all licenses"
on public.licenses for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert licenses" on public.licenses;
create policy "Admins can insert licenses"
on public.licenses for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update all licenses" on public.licenses;
create policy "Admins can update all licenses"
on public.licenses for update
to authenticated
using (public.is_admin());

drop policy if exists "Admins can manage entitlements" on public.entitlements;
create policy "Admins can manage entitlements"
on public.entitlements for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage modules" on public.modules;
create policy "Admins can manage modules"
on public.modules for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ============================================================
-- Bitti. Hata almadıysanız yukarıdaki 4 özellik artık aktif.
-- ============================================================
