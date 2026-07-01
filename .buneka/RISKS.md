# RISKS

## Open

### Production environment needs confirmation

The local production build now passes. Production still depends on Vercel having `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and on the target Supabase project having migrations and seed data applied.

### Supabase policies are not implemented yet

RLS is enabled in the initial migration, but policies are intentionally not written until Supabase Auth, organization membership, and admin access rules are implemented.

### npm audit reports Next/PostCSS moderate advisories

Dependencies are installed and typecheck/lint pass. npm audit reports 2 moderate advisories from Next's nested PostCSS dependency. The suggested `npm audit fix --force` would downgrade Next and should not be used without a framework compatibility decision.

### Migration has not been executed against PostgreSQL yet

The migration file was inspected for required tables, RLS statements, and seed data. Local psql is not installed, so a real Supabase/PostgreSQL migration run is still required.

### Pro Sube plan needs a product decision

The database check constraint allows PRO_BRANCH, but the first seed only includes the four plans requested for the initial bootstrap. Decide later whether Pro Sube belongs in the MVP seed data.

### Demo data scope needs implementation design

The manifest requires demo data to stay separate from customer data. The current migration supports real application data only; demo isolation should be designed before /demo is implemented.
