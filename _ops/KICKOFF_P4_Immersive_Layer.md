# KICKOFF — P4 Immersive Layer · Banner D1 THE AI ACADEMY · 2026-07-21
FROM: D1 session that shipped P1+P2+P3 (PRs #30–#33) — entitlements, Ada tutor MVP, magnet mechanics, share cards, landing demo. All dark behind TUTOR_ENABLED. main @ 9220b23.
GOAL: Ship P4, the immersive "visitor magnet" look, in preview-gated batches: (a) CSS 3D pop-out (preserve-3d/translateZ/perspective + pointer tilt) on cards/emojis sitewide; (b) Motion (Framer successor) page/component transitions + GSAP ScrollTrigger for ONE signature hero scroll sequence; (c) ONE react-three-fiber + drei WebGL holographic hero (lazy, ssr:false, @react-three/postprocessing bloom, WebGPU with WebGL2 fallback); (d) premium 3D theme gated by getEntitlements().premiumTheme.
FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\CLAUDE.md · _ops\D1_Immersive_Academy_Scope.md (Pillar A) · Cowork project memory (project_state — has middleware finding + workflow).
STATE YOU INHERIT (verified 2026-07-21):
- main @ 9220b23 = prod (etai-academy.vercel.app READY). Repo id 1177761765. Supabase lippaasbtqsizqzjxtyq, advisors clean.
- Ada + demo + share fully built, dark behind TUTOR_ENABLED (Ernest flips via Vercel env; steps in memory).
- Entitlements ready: getEntitlements(profile).premiumTheme is the gate for the premium 3D skin.
- Deps pinned: ai@4.3.19 / @ai-sdk/*@1.2.12 (AI SDK 4.x — do NOT bump). New deps P4 needs: motion, gsap, three, @react-three/fiber, @react-three/drei, @react-three/postprocessing — install in cloud clone first, verify versions + tsc, commit package.json + lockfile.
- Build workflow: Supabase MCP for any DB → cloud tsc --noEmit (2 pre-existing errors in guides crud/queries are OK) → SendUserFile → device_commit_files → PowerShell git → preview READY gate → merge → prod probes.
NON-NEGOTIABLE GUARDRAILS (from approved scope): honor prefers-reduced-motion globally (swap parallax/3D for fades); lazy-load ALL canvas (next/dynamic ssr:false) + hard asset budget (protect Core Web Vitals); ALL real content stays semantic HTML (3D decorative, aria-hidden); no literal-hologram promises; mobile-safe.
DO NOT: touch eli5_guides behavior · re-introduce dashboard/health routes · activate root middleware.ts (dead code — own LFG) · handle keys · skip preview gate · commit .gitignore/CLAUDE.md/README/_ops in code PRs · edit OneDrive copies.
DEFINITION OF DONE: preview READY + merged PRs + prod field-test (landing FPS sane on mobile-width, reduced-motion verified, Lighthouse not tanked) + passdown (README stamps + C:\dev\README + memory) updated + P5 kickoff generated.
RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · git identity coache45@gmail.com.
