create table public.organization_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  default_payment_type text not null default 'cash' check (default_payment_type in ('cash', 'card', 'transfer', 'other')),
  stock_alert_level numeric(12, 3) not null default 5 check (stock_alert_level >= 0),
  multi_device_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organization_settings_set_updated_at
before update on public.organization_settings
for each row execute function public.set_updated_at();

alter table public.organization_settings enable row level security;

create policy "Users can view their organization settings"
on public.organization_settings for select
to authenticated
using (organization_id = public.current_organization_id());

create policy "Users can modify their organization settings"
on public.organization_settings for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());
