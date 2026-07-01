# CHANGELOG

## 2026-07-01

- Initialized Buneka repository skeleton.
- Added manifest to repository root.
- Added npm workspace configuration.
- Added Next.js web shell configuration.
- Added shared package shells.
- Added initial Supabase schema migration.
- Added agent handoff and planning files.
- Installed npm dependencies and generated package-lock.json.
- Fixed TypeScript 6 deprecation handling and ESLint 9 compatibility.
- Verified typecheck and lint.

## 2026-07-01 Web MVP Pass

- Added docs/ROUTE_ARCHITECTURE.md and docs/FIRST_SPRINT.md.
- Generated and added apps/web/public/images/buneka-hero-counter.png.
- Added public landing page at `/`.
- Added interactive isolated demo panel at `/demo`.
- Added `/login`, `/app`, `/app/*`, `/admin`, and `/admin/*` route placeholders.
- Added lucide-react icons.
- Verified typecheck, lint, production build, and local HTTP smoke checks.

## 2026-07-02 Vercel Build Fix

- Codex took over after Antigravity quota was exhausted.
- Fixed Vercel `module-not-found` errors for `@/lib/supabase/client` and `@/lib/supabase/server`.
- Added web app `@/*` path alias in `apps/web/tsconfig.json`.
- Typed Supabase-backed app shell and client pages to remove `any` lint failures.
- Moved app sidebar subcomponent out of render.
- Updated client data loaders to satisfy React 19 hook lint rules.
- Replaced manual Google font links with `next/font/google`.
- Verified `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`.

## 2026-07-02 Premium Completion Pass

- Rebuilt the public site around the premium Buneka design language.
- Removed visible SERENIS wording from app/site surfaces.
- Added sector content data and static sector detail pages under `/sektorler/[slug]`.
- Connected sector cards to real detail pages instead of empty anchors.
- Added working product creation and bulk price update modals to `/app/urunler`.
- Added working stock entry modal to `/app/stok`.
- Cleaned app copy on price, cash, reports, and settings pages.
- Verified typecheck, lint, production build, and local HTTP smoke checks.
