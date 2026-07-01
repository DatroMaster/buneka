# AGENT STATE

Current phase: Premium site and app completion pass

Current active task: None

Last completed task: Reworked public site, added sector detail pages, completed product bulk update and stock entry flows

Next suggested task: Verify the new deployed pages in Vercel, then test Supabase write flows with a real customer account

Open blockers:
- Confirm Vercel has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set for production.
- Confirm Supabase migrations and seed data have been applied to the production project.
- Local psql is not installed, so the migration has not been executed against a live PostgreSQL database in this workspace.
- npm audit reports 2 moderate vulnerabilities through Next's nested PostCSS dependency; npm's suggested force fix would downgrade Next and should not be applied blindly.

Files changed:
- BUNEKA_PROJECT_MANIFEST.md
- package.json
- tsconfig.base.json
- README.md
- apps/web/*
- apps/web/public/images/buneka-hero-counter.png
- docs/ROUTE_ARCHITECTURE.md
- docs/FIRST_SPRINT.md
- packages/*
- supabase/migrations/20260701210000_initial_buneka_schema.sql
- .buneka/*
- package-lock.json

Tests run:
- npm.cmd install: passed.
- npm.cmd run typecheck: passed.
- npm.cmd run lint: passed.
- npm.cmd run build: passed. Next generated static public/admin/demo routes and dynamic app/login routes.
- Invoke-WebRequest http://localhost:3000: passed, status 200.
- Invoke-WebRequest http://localhost:3000/demo: passed, status 200.
- Invoke-WebRequest http://localhost:3000/sektorler/market-bakkal: passed, status 200.
- SERENIS text search in apps/web: no visible app/site matches.
- Forbidden sale-negative phrase search across apps, docs, and .buneka: no matches.
- npm.cmd audit --audit-level=moderate: failed due to 2 moderate PostCSS advisories under Next.
- Migration table/RLS/seed grep sanity check: passed.

Build status: Passing.

Human decisions needed:
- Confirm production Supabase project URL and anon key are set on Vercel.
- Confirm whether Buneka Pro Sube should be added as a first-class plan in the first MVP or handled later.
