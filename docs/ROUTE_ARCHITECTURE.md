# Buneka Route Architecture

## Screen List

### Public Site

- `/`: Hero, product promise, target businesses, plans, demo entry, devices, modules, reseller note, FAQ, contact.

### Demo Panel

- `/demo`: Isolated demo price lookup, sample products, sale confirmation, daily demo report, upgrade prompts.

### Login

- `/login`: Customer login entry point. Supabase Auth wiring is not implemented yet.

### Customer App

- `/app`: Customer workspace overview.
- `/app/price`: Price lookup home.
- `/app/cash`: Daily cash view.
- `/app/stock`: Stock tracking view.
- `/app/products`: Product management.
- `/app/reports`: Reports.
- `/app/settings`: Business settings.

### Admin Panel

- `/admin`: Admin workspace overview.
- `/admin/customers`: Customer management.
- `/admin/licenses`: License management.
- `/admin/modules`: Module management.
- `/admin/campaigns`: Campaign management.
- `/admin/analytics`: Usage analytics.
- `/admin/devices`: Device catalog.
- `/admin/resellers`: Reseller management.
- `/admin/audit`: Audit logs.

## Component List

- `SiteHeader`: Public navigation and primary actions.
- `Hero`: Image-led first viewport for buneka.com.
- `PlanGrid`: Yearly plan cards.
- `ModuleGrid`: Optional yearly modules.
- `DemoScanner`: Local demo barcode input and product result.
- `DemoReport`: Demo-only query and sale summary.
- `AppShell`: Shared authenticated app shell.
- `EntitlementGate`: Server-side feature gate, to be implemented with Supabase.
- `AdminMetricGrid`: Admin overview metrics.
- `StatusBadge`: Shared compact status label.

## Data Flow

1. Public user lands on `/`.
2. User opens `/demo`.
3. Demo loads local sample products in browser state only.
4. Barcode input creates a demo price query event.
5. Product found shows price and actions.
6. `Satış Yapıldı` creates a demo sale event.
7. `Ana Ekrana Dön` clears the selected product and creates no sale.
8. Real `/app` flow later reads Supabase Auth user, organization, active license, and entitlements.
9. Real sale flow later writes `price_queries`, then optionally `sales`, `sale_items`, and `stock_movements`.

## Entitlement Checkpoints

- `price_query`: `/app/price`, demo-equivalent lookup behavior.
- `product_create`: `/app/products`, product not found flow.
- `sale_create`: `Satış Yapıldı` server action.
- `daily_cash`: `/app/cash`.
- `stock_tracking`: `/app/stock` and stock decrement after sale.
- `profit_details`: hidden by default; visible only for owner/admin roles with entitlement.
- `reports`: `/app/reports`.
- `serenis_note`: Patron report card.
- `multi_device`: device/session management.
- `campaign_access`: campaign prompts and admin assignment.

## Test Scenarios

- Public site renders the Buneka value proposition and plan list.
- Demo barcode `8690000000011` finds a product.
- Demo unknown barcode opens a product-not-found state.
- `Satış Yapıldı` increments demo sales and amount.
- `Ana Ekrana Dön` creates no sale.
- Customer app routes do not expose gated features as active actions before auth.
- Admin routes remain static placeholders until auth and roles are implemented.
- The forbidden sale-negative phrase does not appear in UI copy.
