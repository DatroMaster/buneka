# AGENT HANDOFF

## Summary

Buneka has been initialized as an npm workspace with the requested monorepo folders, a Next.js App Router web app, shared package shells, Supabase migration, route planning docs, demo panel, and agent handoff files.

## What Codex did

- Copied the project manifest into the repository.
- Created the requested folder structure.
- Added root npm workspace configuration.
- Added a Next.js App Router web package configuration without creating frontend screens.
- Added package shells for UI, core, database, barcode, licensing, and reports.
- Added the initial Supabase migration for the 16 required tables.
- Seeded the four initial plans: PRICE, CASH, STOCK, PATRON.
- Added feature-code constraints for licensing entitlements.
- Enabled RLS on all application tables.
- Added route architecture and first sprint planning docs.
- Added the public Buneka landing page.
- Added the isolated browser-state demo panel.
- Added customer app and admin route placeholders.
- Added a project-bound generated hero image under apps/web/public/images.

## What Antigravity should do next

Connect Supabase and move from demo-only state to real application data:

1. Create/connect the Supabase project.
2. Execute the initial migration.
3. Generate database types.
4. Add Supabase Auth.
5. Implement organization and license lookup.
6. Add RLS policies.
7. Replace `/app/price` placeholder with real price query flow.

## Constraints

- Do not create payment integration in the first MVP.
- Do not create Google integrations in the first MVP.
- Do not create official receipt, fiscal printer, invoice, or accounting integrations in the first MVP.
- Demo data must stay separate from real customer data.
- License checks must be enforced server-side once backend logic exists.
- The product language should stay short, practical, and cashier-friendly.

## Do Not Do

- Do not turn Buneka into a complex ERP.
- Do not expose purchase price or profit details by default.
- Do not add native mobile apps in the first MVP.
- Do not implement multi-branch as a complete system in the first MVP.

## Required Verification

- Validate migration syntax against Supabase/PostgreSQL.
- Validate package installation after dependencies are installed.
- Run typecheck after the first app routes are added.
- Confirm RLS policies before using real customer data.

## Current Verification Result

- npm.cmd install passed.
- npm.cmd run typecheck passed.
- npm.cmd run lint passed.
- npm.cmd run build passed and generated 21 static app routes.
- http://localhost:3000 returned status 200.
- http://localhost:3000/demo returned status 200.
- UI/docs/handoff search found no forbidden sale-negative phrase in apps, docs, or .buneka.
- npm.cmd audit --audit-level=moderate reports 2 moderate vulnerabilities through Next's nested PostCSS dependency.
- psql is not installed locally, so the migration still needs to be executed in Supabase or another PostgreSQL environment.
