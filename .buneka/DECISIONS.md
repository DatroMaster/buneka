# DECISIONS

## 2026-07-01

- Use npm workspaces for the initial monorepo skeleton.
- Keep apps/web free of actual UI routes during the bootstrap task.
- Represent the initial product packages as seeded rows in public.plans.
- Represent feature-code vocabulary as an entitlements table check constraint.
- Enable RLS on all application tables from the first migration, with policies to be added when auth integration is implemented.
- Use shared packages for core constants, UI tokens, database types, barcode types, licensing rules, and reports.
