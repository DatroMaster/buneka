# Buneka

Buneka is a yearly licensed SaaS product for small businesses that need fast barcode-based price lookup, sales recording, daily cash visibility, and simple stock memory.

Core product sentence:

```text
Barkodu okut, fiyati gor, satisini bil.
```

This repository currently contains the first project skeleton, Supabase schema migration, package workspace structure, and agent handoff files.

## Workspace

```text
apps/web
packages/ui
packages/core
packages/database
packages/barcode
packages/licensing
packages/reports
docs
supabase/migrations
.buneka
```

## Useful commands

```powershell
npm.cmd install
npm.cmd run typecheck
npm.cmd run lint
```

The first pass intentionally does not include public, demo, app, or admin screens.
