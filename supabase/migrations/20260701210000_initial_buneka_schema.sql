create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_number text,
  owner_name text,
  phone text,
  email text,
  city text,
  sector text,
  status text not null default 'active' check (status in ('active', 'inactive', 'limited', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text,
  city text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  store_id uuid references public.stores(id) on delete set null,
  name text,
  email text,
  phone text,
  role text not null check (role in ('super_admin', 'admin_staff', 'reseller', 'owner', 'cashier', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null check (code in ('PRICE', 'CASH', 'STOCK', 'PATRON', 'PRO_BRANCH')),
  annual_price numeric(12, 2) not null check (annual_price >= 0),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.licenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  license_key text unique not null,
  starts_at date not null,
  expires_at date not null,
  status text not null default 'active' check (status in ('active', 'expired', 'limited', 'cancelled')),
  renewal_price numeric(12, 2) check (renewal_price is null or renewal_price >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at >= starts_at)
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  annual_price numeric(12, 2) check (annual_price is null or annual_price >= 0),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  license_id uuid references public.licenses(id) on delete cascade,
  feature_code text not null check (
    feature_code in (
      'price_query',
      'product_create',
      'sale_create',
      'daily_cash',
      'stock_tracking',
      'profit_details',
      'reports',
      'serenis_note',
      'multi_device',
      'campaign_access'
    )
  ),
  is_enabled boolean not null default false,
  expires_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, license_id, feature_code)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  store_id uuid references public.stores(id) on delete set null,
  barcode text not null,
  name text not null,
  category text,
  purchase_price numeric(12, 2) check (purchase_price is null or purchase_price >= 0),
  sale_price numeric(12, 2) not null check (sale_price >= 0),
  stock_quantity numeric(12, 3) not null default 0,
  min_stock numeric(12, 3) not null default 0,
  supplier text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, store_id, barcode)
);

create table public.price_queries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  store_id uuid references public.stores(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  barcode text not null,
  queried_at timestamptz not null default now(),
  user_id uuid references public.app_users(id) on delete set null,
  source text check (source is null or source in ('camera', 'manual', 'usb_reader', 'demo')),
  created_at timestamptz not null default now()
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  store_id uuid references public.stores(id) on delete set null,
  user_id uuid references public.app_users(id) on delete set null,
  total_amount numeric(12, 2) not null default 0 check (total_amount >= 0),
  total_profit numeric(12, 2) not null default 0,
  payment_type text check (payment_type is null or payment_type in ('cash', 'card', 'transfer', 'other')),
  sale_time timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity numeric(12, 3) not null default 1 check (quantity > 0),
  sale_price numeric(12, 2) not null check (sale_price >= 0),
  purchase_price numeric(12, 2) check (purchase_price is null or purchase_price >= 0),
  profit numeric(12, 2),
  created_at timestamptz not null default now()
);

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  store_id uuid references public.stores(id) on delete set null,
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type text not null check (movement_type in ('sale', 'purchase', 'adjustment', 'return')),
  quantity numeric(12, 3) not null,
  unit_price numeric(12, 2) check (unit_price is null or unit_price >= 0),
  note text,
  created_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  target_plan text check (target_plan is null or target_plan in ('PRICE', 'CASH', 'STOCK', 'PATRON', 'PRO_BRANCH')),
  discount_amount numeric(12, 2) check (discount_amount is null or discount_amount >= 0),
  discount_percent numeric(5, 2) check (discount_percent is null or (discount_percent >= 0 and discount_percent <= 100)),
  starts_at date,
  ends_at date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create table public.organization_campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  status text not null default 'offered' check (status in ('offered', 'accepted', 'declined', 'expired', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, campaign_id)
);

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  device_type text,
  connection_type text,
  price_range text,
  recommended_for text,
  affiliate_url text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.app_users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index stores_organization_id_idx on public.stores(organization_id);
create index app_users_auth_user_id_idx on public.app_users(auth_user_id);
create index app_users_organization_id_idx on public.app_users(organization_id);
create index licenses_organization_id_idx on public.licenses(organization_id);
create index entitlements_organization_id_idx on public.entitlements(organization_id);
create index products_lookup_idx on public.products(organization_id, store_id, barcode);
create index price_queries_organization_queried_at_idx on public.price_queries(organization_id, queried_at desc);
create index sales_organization_sale_time_idx on public.sales(organization_id, sale_time desc);
create index stock_movements_product_created_at_idx on public.stock_movements(product_id, created_at desc);
create index audit_logs_organization_created_at_idx on public.audit_logs(organization_id, created_at desc);

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create trigger stores_set_updated_at
before update on public.stores
for each row execute function public.set_updated_at();

create trigger app_users_set_updated_at
before update on public.app_users
for each row execute function public.set_updated_at();

create trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

create trigger licenses_set_updated_at
before update on public.licenses
for each row execute function public.set_updated_at();

create trigger modules_set_updated_at
before update on public.modules
for each row execute function public.set_updated_at();

create trigger entitlements_set_updated_at
before update on public.entitlements
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger sales_set_updated_at
before update on public.sales
for each row execute function public.set_updated_at();

create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

create trigger organization_campaigns_set_updated_at
before update on public.organization_campaigns
for each row execute function public.set_updated_at();

create trigger devices_set_updated_at
before update on public.devices
for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.stores enable row level security;
alter table public.app_users enable row level security;
alter table public.plans enable row level security;
alter table public.licenses enable row level security;
alter table public.modules enable row level security;
alter table public.entitlements enable row level security;
alter table public.products enable row level security;
alter table public.price_queries enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.stock_movements enable row level security;
alter table public.campaigns enable row level security;
alter table public.organization_campaigns enable row level security;
alter table public.devices enable row level security;
alter table public.audit_logs enable row level security;

insert into public.plans (name, code, annual_price, description)
values
  ('Buneka Fiyat', 'PRICE', 6000, 'Barkodla fiyat sorgulama'),
  ('Buneka Kasa', 'CASH', 9000, 'Fiyat sorgulama, satis kaydi ve gunluk kasa'),
  ('Buneka Stok', 'STOCK', 15000, 'Fiyat, kasa, stok takibi ve stok uyarisi'),
  ('Buneka Patron', 'PATRON', 24000, 'Gelismis rapor, mobil patron ekrani ve SERENIS notu')
on conflict (code) do update
set
  name = excluded.name,
  annual_price = excluded.annual_price,
  description = excluded.description,
  is_active = true,
  updated_at = now();

comment on table public.entitlements is 'Allowed feature_code values: price_query, product_create, sale_create, daily_cash, stock_tracking, profit_details, reports, serenis_note, multi_device, campaign_access.';
