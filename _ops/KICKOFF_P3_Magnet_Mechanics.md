# KICKOFF — Ada flip-on + P3 Magnet Mechanics · Banner D1 THE AI ACADEMY · 2026-07-21
FROM: D1 session that shipped P1 entitlements (PR #30) + Ada tutor MVP dark (PR #31) — main @ 0b19933, prod field-tested, advisors clean.
GOAL: (a) Flip Ada ON safely (Ernest's keys + preview smoke-test), then (b) ship P3 magnet mechanics in preview-gated Fibonacci batches: reading-level toggle (ELI-5/15/expert), curiosity chips, quiz-me + streak, share-as-OG-card, landing live demo.
FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\CLAUDE.md · _ops\D1_Immersive_Academy_Scope.md (v0.2) · Cowork project memory (project_state — has the flip-on steps + hardening list).
STATE YOU INHERIT (verified 2026-07-21):
- main @ 0b19933 = prod (etai-academy.vercel.app, READY). Repo id 1177761765.
- Supabase lippaasbtqsizqzjxtyq: eli5_guides 132 · content_items 16 · profiles (entitlements cols) · usage_daily · founder_slots · tutor_conversations/tutor_messages (owner-read RLS, server-role writes) · search_academy_content() FTS RPC (server-only EXECUTE). Advisors clean.
- /api/tutor gate order: TUTOR_ENABLED (default OFF) → auth → cap (getEntitlements: free 15/day) → moderation (rules + haiku classifier, fails closed) → FTS grounding with citations → streamed claude-haiku-4-5 (TUTOR_MODEL env). Deps pinned: ai@4.3.19, @ai-sdk/anthropic@1.2.12, @ai-sdk/react@1.2.12 (AI SDK 4.x line — do NOT bump to 5.x casually).
- Ada UI: /tutor + TutorChat (useChat) + AdaMascot (CSS/SVG idle/thinking/talking — Rive slot-in point kept).
- FLIP-ON (Ernest only): Vercel env ANTHROPIC_API_KEY (server-only) + TUTOR_ENABLED=true on PREVIEW → smoke-test (ask/cite/blocked-prompt/cap) → then Production. Kill-switch = flag false.
- Hardening to fold into P3: make checkAndIncrementUsage atomic (SQL RPC upsert+increment); consider ET-timezone day reset; run `npm install` locally once (lockfile committed, node_modules stale).
DO NOT: handle/enter API or Stripe keys · ship tutor ON without preview smoke-test · remove the moderation gate or kill-switch · re-introduce dashboard/health routes · touch eli5_guides behavior · edit OneDrive copies · skip preview gate · commit .gitignore/CLAUDE.md/README/_ops in code PRs.
DEFINITION OF DONE: migrations verified (RLS + advisors) + cloud tsc --noEmit clean on new files + preview READY + merged PR + prod field-test + passdown (README stamps + C:\dev\README facts + Cowork memory) updated.
RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · git identity coache45@gmail.com.
