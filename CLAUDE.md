# The AI Academy — Claude Code Project Instructions

## Project
- **Name**: The AI Academy (ET AI, LLC)
- **Stack**: Next.js 14, TypeScript, Tailwind CSS, Supabase
- **Repo**: github.com/coache45/etai-academy
- **Source dir**: `src/` (all app code lives under `src/`, path alias `@/*` → `./src/*`)
- **Production**: etai-academy.vercel.app (main branch)
- **Brand**: Navy #1B2A4A, Gold #C9A84C — "Bringing AI Down to Earth"

## Canonical location (verified 2026-06-07)
- **Canonical working copy**: `C:\dev\etai-academy` — origin `github.com/coache45/etai-academy`, `main` @ `9c88078` (the commit the live Vercel deploy serves). `core.autocrlf=false` is set here to stop the Windows/OneDrive CRLF churn that plagues the other copies.
- **Canonical remote**: `github.com/coache45/etai-academy` (repo id 1177761765 — formerly `etai-one-health`; GitHub auto-redirects, so a clone's remote URL may read either name). Identity = repo id + commits, never the folder name.
- **Stale copies — do NOT edit, do NOT treat as canonical** (full sweep: `Project 2 — The AI Academy/ETAI-Academy-Sweep-Report.md`):
  - `…\OneDrive\…\Projects\etai-one-health` — same repo, stuck on branch `chore/academy-cleanup`, OneDrive CRLF-corrupted. The Cowork folder "Project 2 — The AI Academy" is an empty subfolder inside it.
  - `C:\dev\one-health` — 2026-03 scaffold (`5f7461e`), pre-canonical; its one trivial config stash is saved as `one-health-stash@0.patch`.
  - `…\OneDrive\…\Technical Department\SaaS\ONE Health` and `…\SaaS\etai-one-health` — OneDrive-dehydrated, old already-merged feature branches.
  - `…\OneDrive\…\Projects\et-ai-one-health-app` — broken checkout (branch `chore/b`, no commits).

## Content principle
- **ELI-5**: explain like I'm five — every guide and every user-visible label must pass it. (The "Grandmother Test" name is retired; ELI-5 is the principle.)

## What this app is
The AI Academy is the public learning + content hub:
- `/` — marketing / platform hub landing
- `/guides`, `/guides/[slug]` — ELI5 Guides (public, no auth)
- `/podcast` — the O-Spot podcast page
- `/login`, `/signup`, `/onboarding` — auth flow

**ONE Health is a SEPARATE application** living at etai-one-health.vercel.app (repo `etai-one-health`). The Academy links out to it; the dashboard/app surface is NOT part of this repo. Do not re-introduce `(dashboard)`, couples, or health/coach/studio routes here.

## Branch Protocol
- **main** = production. NEVER force push.
- Feature branches merge into main via PR only.
- Always create branches from `origin/main` (not from other feature branches).
- Git identity: commit with `git config user.email "coache45@gmail.com"`.

## Pre-Merge Verification Protocol (MANDATORY)

After EVERY push to a feature branch, execute this sequence BEFORE telling Ernest to create a PR or merge:

### 1. Verify commits exist on remote
```bash
git log origin/<branch> --oneline -3
git diff --stat HEAD~1
```
If `git diff --stat HEAD~1` shows 0 files, the code was never committed. Rebuild.

### 2. Check Vercel build status
Use the Vercel MCP tools to confirm the preview deployment state is `READY`, not `ERROR`.
If `ERROR`, pull the build logs and fix before proceeding.

### 3. Ghost Commit Rule
After any multi-step build session, always verify work exists:
```bash
git status && git log --oneline -5 && git diff --stat HEAD~1
```
Run this BEFORE reporting completion to Ernest.

### 4. If "nothing to compare" or build failure is reported
FIRST action: `git log --all --oneline -20` to find where the code actually is.
Do NOT blame external systems. Diagnose and fix.

### 5. Never say "ready to merge" until
- Vercel preview build is confirmed `READY`
- `git diff --stat` shows actual file changes
- Commits are confirmed on the remote branch

## Route Conventions
- `src/app/page.tsx` — marketing hub landing
- `src/app/guides/` — public ELI5 guides (added to middleware publicPaths)
- `src/app/podcast/` — O-Spot podcast page
- `src/app/(auth)/` — login / signup / onboarding (route group, no URL segment)
- `src/app/auth/callback` — Supabase auth callback
- `src/app/api/guides/` — guide CRUD + generation
- `src/app/api/_archived/` — archived enterprise routes (kept, not wired)

## Key Files
- `middleware.ts` — auth redirects and public path allowlist
- `next.config.js` — has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`
- `src/lib/supabase/` — Supabase clients (client / server / admin)
- `src/lib/guides/` — guide queries
- `src/lib/podcast/` — podcast config + RSS feed parsing
