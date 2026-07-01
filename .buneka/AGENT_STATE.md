# AGENT STATE

Current phase: First web MVP

Current active task: None

Last completed task: Route plan, public site, demo panel, app/admin route placeholders, and production build

Next suggested task: Connect Supabase project, execute migration, generate database types, and implement Supabase Auth/login

Open blockers:
- Supabase project is not connected yet.
- Authentication, policies, and live deployment are not configured yet.
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
- npm.cmd run build: passed. Next generated 21 static app routes.
- Invoke-WebRequest http://localhost:3000: passed, status 200.
- Invoke-WebRequest http://localhost:3000/demo: passed, status 200.
- Forbidden sale-negative phrase search across apps, docs, and .buneka: no matches.
- npm.cmd audit --audit-level=moderate: failed due to 2 moderate PostCSS advisories under Next.
- Migration table/RLS/seed grep sanity check: passed.

Build status: Passing.

Human decisions needed:
- Confirm Supabase project URL and deployment target when the integration phase starts.
- Confirm whether Buneka Pro Sube should be added as a first-class plan in the first MVP or handled later.
