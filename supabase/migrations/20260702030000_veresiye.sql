-- Veresiye (customer credit / running-tab) tracking. Shared org-wide so every
-- staff member sees the same balances and history, matching the RLS pattern
-- used for products/sales elsewhere in the schema.
create table public.customers (
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

create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.app_users(id) on delete set null,
  type text not null check (type in ('debt', 'payment')),
  amount numeric(12, 2) not null check (amount > 0),
  note text,
  created_at timestamptz not null default now()
);

create index customers_organization_id_idx on public.customers(organization_id);
create index credit_transactions_customer_id_idx on public.credit_transactions(customer_id, created_at desc);
create index credit_transactions_organization_id_idx on public.credit_transactions(organization_id, created_at desc);

create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

alter table public.customers enable row level security;
alter table public.credit_transactions enable row level security;

create policy "Users can view their organization customers"
on public.customers for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can modify their organization customers"
on public.customers for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

create policy "Users can view their organization credit transactions"
on public.credit_transactions for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can insert credit transactions for their organization"
on public.credit_transactions for insert
to authenticated
with check (organization_id = public.current_organization_id());
