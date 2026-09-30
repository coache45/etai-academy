# KICKOFF — Immersive AI Academy build (P1→P4) · Banner D1 THE AI ACADEMY · 2026-07-20
FROM: D1 session that shipped the full Academy Upgrade (PRs #22–#29: content_items + /explore + detail pages, /me Ladder + badges + Learner Orientation, mark-complete, /trust + BETA). Now building the immersive layer + AI tutor + monetization plumbing, research-scoped and approved.

GOAL: Ship, in preview-gated Fibonacci batches, P1 (entitlements + caps) → P2 (AI tutor "Ada" MVP) → P3 (magnet mechanics) → P4 (immersive 3D/4D layer). Payments (P5) and voice/paths/certs (P6+) stay later + owner-gated.

FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\CLAUDE.md · etai-academy\_ops\D1_Immersive_Academy_Scope.md (v0.2, the plan) · _ops\D1_AI_Tutor_Scope.md · Cowork project memory (project_state, immersive_academy_scope, academy_vision).

STATE YOU INHERIT (verified 2026-07-20):
- Repo coache45/etai-academy (id 1177761765), main @ 5f2904d, prod = etai-academy.vercel.app, own Supabase lippaasbtqsizqzjxtyq. Tables: eli5_guides(132), content_items(16, waves 1-3), profiles, progress (owner-RLS), credentials (owner-RLS, award trigger EXECUTE-revoked). Advisors clean.
- Next.js 14 App Router + TS + Tailwind + Supabase (@supabase/ssr) + lib/supabase/{client,server,admin}. MarkComplete + /api/progress already exist.
- Build workflow that works: Supabase MCP for migrations (apply_migration → verify table/RLS/advisors → generate_typescript_types); code written in cloud → SendUserFile → device_commit_files to C:\dev\etai-academy; git via Windows-MCP PowerShell (gh authed as coache45); branch from origin/main, stage ONLY intended files (leave .gitignore/CLAUDE.md/README/_ops uncommitted), preview-gate (Vercel get_deployment READY) BEFORE `gh pr merge --merge`.

APPROVED DECISIONS (bake in, do not re-ask):
- Tutor name = "Ada". Free tutor cap ~15 msgs/user/day. Pro = $9/mo or $79/yr; FIRST 1,000 buyers get a locked "Founder" price (add a founder counter + founder flag; enforce the 1,000 cap). Launch perks (premium 3D theme + early access) ship together.
- Recommended stacks from the scope: Vercel AI SDK + @ai-sdk/anthropic + assistant-ui for Ada; Postgres full-text-search RAG over guides+content_items (cite source, no pgvector yet); Rive mascot (defer 3D avatar/voice); immersive = CSS 3D pop-out + Motion + GSAP + ONE react-three-fiber/drei WebGL hero + postprocessing (WebGPU w/ WebGL2 fallback).

BUILD ORDER:
- P1 (do first, free-safe, NO keys/payments): add profiles cols stripe_customer_id, subscription_status, current_period_end, entitlements jsonb; a usage table (owner-RLS) + server-side daily tutor-cap counter; a getEntitlements(profile) helper → {dailyMessageCap, voiceTutor, learningPaths, premiumTheme, certificates}; founder-slot counter. This is the rate limiter even while free.
- P2 Ada MVP: tutor tables (owner-RLS) + /api/tutor (AI SDK + Claude + input moderation gate) behind TUTOR_ENABLED flag (default off) + assistant-ui /tutor page + full-text RAG + Rive mascot. Ernest adds ANTHROPIC_API_KEY (server-only Vercel env) then smoke-test on preview → flip on.
- P3 magnet mechanics: reading-level toggle (ELI-5/15/expert), curiosity chips, quiz-me + streak, share-as-OG-card, landing live demo.
- P4 immersive layer: CSS 3D + Motion/GSAP transitions; one holographic WebGL hero; gate premium 3D theme entitlement.

DO NOT: handle/enter Anthropic or Stripe keys; wire live payments (beta free by design; P5 owner-gated); ship Ada "on" without moderation gate + TUTOR_ENABLED kill-switch + preview smoke-test; break prefers-reduced-motion / SEO (3D is decorative, content stays semantic HTML); re-introduce /dashboard or health-*app* routes; touch guides (eli5_guides) behavior; promise literal holograms (holographic *look* only); skip the preview gate; edit OneDrive copies.

DEFINITION OF DONE (per phase): migration verified (RLS + advisors clean) + preview READY + merged PR + field-tested on prod + passdown/memory updated.

RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · preview-gate before every prod flip · git identity coache45@gmail.com.
