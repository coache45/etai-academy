# Phase 0 Snapshot — eli5_guides (de-entanglement)
**Taken 2026-07-20 · source project `pvflufqfeaowzextilpl` (etai-one-health) · by Claude per Ernest's "LFG Phase 0-1"**

## What's here
| File | What | Verification |
|---|---|---|
| `eli5_guides_data_2026-07-20.json` | ALL 132 rows (100% published), fetched via public REST at source | count assert 132/132 · 1,045,660 bytes · SHA256 `8B0848C3E62DFAC4BDA90B39748524303C44779EA4472174903B7ABA3F1B0411` |
| `001_create_eli5_guides.sql` | Migration-ready DDL: table + checks + 2 indexes + updated_at trigger fn + RLS + both policies (parity with source, live-introspected) | apply on the NEW project in Phase 1 |

## Corrections vs the delivered plan
- Live count is **132 rows** (all published), NOT 30 — the plan's "30 rows" came from a stale `list_tables` estimate. Row-count assert for Phase 1 = **132** (re-check live count at load time).
- Table has an `updated_at` trigger + function the plan didn't list — included in the DDL above.

## Verified safety gates
- **R6 CLEAR:** `git grep eli5_guides` across ONE Health branches (`origin/master`, `guardian`, `aethelgard`) = zero hits. Nothing but the Academy touches this table.
- Table has **zero foreign keys** — fully standalone; no dependency migration needed.

## Rollback anchor
- Source table untouched; source project `pvflufqfeaowzextilpl` remains live-serving. Current Academy Supabase env values live in the Vercel project (etai-academy → Settings → Environment Variables) and locally in `.env.local` — restore those + redeploy = instant rollback at any phase.

## ⛔ Phase 1 BLOCKER (2026-07-20)
`create_project` failed: **PaymentRequiredException — overdue invoices on org ET AI, LLC.** Ernest settles at supabase.com → org **ET AI, LLC** → Billing → Invoices. New project cost confirmed **$10/month**. After settling: resume = create project `etai-academy` (us-east-1) → apply `001_create_eli5_guides.sql` → load JSON (server-side pull, no manual re-entry) → assert 132 → advisors scan.
