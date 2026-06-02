# The AI Academy — Claude Code Project Instructions

## Project
- **Name**: The AI Academy (ET AI, LLC)
- **Stack**: Next.js 14, TypeScript, Tailwind CSS, Supabase
- **Repo**: github.com/coache45/etai-academy
- **Source dir**: `src/` (all app code lives under `src/`, path alias `@/*` → `./src/*`)
- **Production**: etai-academy.vercel.app (main branch)
- **Brand**: Navy #1B2A4A, Gold #C9A84C — "Bringing AI Down to Earth"

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
