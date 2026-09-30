# KICKOFF — P6 Expansion (the features the fee funds) · Banner D1 THE AI ACADEMY · 2026-07-21
FROM: D1 session that completed P1–P5 (PRs #30–#38): entitlements, Ada (smoke-tested green), magnet mechanics, middleware fix, immersive layer, verified-dark payments plumbing.
GOAL: Ship the Pro-value features, each its own LFG + preview gate, in rough priority: (1) certificates export (entitlements.certificates; render badge/credential as shareable image/PDF), (2) personalized learning paths (entitlements.learningPaths; Ada-suggested next-lesson sequences from progress + pillars), (3) voice: Web Speech mic-to-text input + optional Kokoro-82M "read aloud" (entitlements.voiceTutor; defer realtime speech-to-speech — cost), (4) pgvector RAG upgrade when FTS quality plateaus, (5) assistant-ui polish pass + Rive .riv mascot when asset exists.
FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\CLAUDE.md · _ops\D1_Immersive_Academy_Scope.md · _ops\RUNBOOK_Stripe_Flip_On.md · Cowork project memory (project_state — bugs/lessons + verification workflow).
STATE YOU INHERIT (verified 2026-07-21):
- main @ db3851b = prod. Repo id 1177761765. Supabase lippaasbtqsizqzjxtyq, advisors clean.
- Ada FULLY smoke-tested on preview (all green); prod flip = Ernest's TUTOR_ENABLED=true + key on Production + redeploy (may already be done — VERIFY prod first: POST /api/demo expects 200 answer when live, 503 when dark).
- Payments: webhook deployed + verified (fails closed until Ernest's Stripe runbook); founder cohort machinery proven; /me upgrade UI env-gated dark.
- Gate EVERYTHING through getEntitlements() — voiceTutor/learningPaths/certificates flags already exist there and in the addons jsonb.
- Deps pinned React-18 line: ai@4.3.19, fiber@8, drei@9, motion@12, gsap@3.15. NO casual major bumps.
- Workflow: Supabase MCP migrations → verify+advisors+RPC smoke → types · cloud tsc (+ full next build for risky changes) → SendUserFile → device_commit_files → PowerShell git → preview READY → merge → prod probes. Service clients stay cookie-blind. Test role-sensitive paths with a SIGNED-IN user.
DO NOT: handle keys · un-dark payments without Ernest's runbook completion · bypass getEntitlements · break free tier · re-introduce health routes · touch eli5_guides behavior · skip preview gate · commit .gitignore/CLAUDE.md/README/_ops in code PRs · edit OneDrive copies.
DEFINITION OF DONE (per feature): entitlement-gated + preview READY + merged + prod field-test + passdown (stamps + memory) updated.
RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · git identity coache45@gmail.com.
