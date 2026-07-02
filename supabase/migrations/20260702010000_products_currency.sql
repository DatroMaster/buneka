-- Adds optional USD entry support for purchase price. purchase_price stays the
-- canonical TRY value used everywhere else; purchase_currency/purchase_price_original
-- record what the shop owner actually typed when it wasn't TRY.
alter table public.products
  add column purchase_currency text not null default 'TRY' check (purchase_currency in ('TRY', 'USD')),
  add column purchase_price_original numeric(12, 2) check (purchase_price_original is null or purchase_price_original >= 0);
