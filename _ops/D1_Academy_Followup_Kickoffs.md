# D1 — THE AI ACADEMY · Follow-Up Kickoff Prompts
**Made 2026-07-20 · paste-ready per passdown §4 · run each as its own focused session · LFG per step**

Tonight's LFG menu closed: **1 ✅ (onboarding) · 2 ⏸ hold→Jul 23 (key retirement) · 3 ✅ (leaked-password protection) · 4 ⏸ parked (email not needed — Google login covers beta)**.

Below are paste-ready kickoffs for the real remaining work. Timing = your sequence; "where" = this Banner D1 Cowork project, with Chrome Claude only for dashboard/DNS clicks.

---

## 0 · Passdown stamp fix (tonight, ~2 min — just needs LFG)
```
# KICKOFF — Passdown stamp fix · Banner D1 THE AI ACADEMY · 2026-07-20
FROM: D1 first session — repo is sovereign, main @ 49e429d, but folder docs still show old stamps.
GOAL: Correct the stale commit stamps so the passdown tells the truth.
FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\CLAUDE.md
STATE YOU INHERIT: newest truth = main @ 49e429d (PR #21). README.md top line still says 6d89b87 (PR #15); CLAUDE.md "Canonical location" still says 9c88078.
DO NOT: touch code or routes · edit OneDrive copies.
DEFINITION OF DONE: both stamps read 49e429d + a Lessons Learned entry added (scope-discipline rule) + root README facts table confirmed current.
RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · git identity coache45@gmail.com
```

## 1 · Email / password signups — LFG 4 (only if beta needs non-Google signups)
```
# KICKOFF — Academy transactional email · Banner D1 THE AI ACADEMY · <date>
FROM: D1 — Google login works; email/password path has no working sender yet.
GOAL: Decide + wire a working SMTP sender for Supabase auth emails (signup confirm, password reset), OR formally adopt Google-only for beta.
FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\CLAUDE.md
STATE YOU INHERIT: Supabase lippaasbtqsizqzjxtyq. Domain etaiworld.ai ALREADY sends via MailerLite/MailerSend (SPF include _spf.mlsend.com + litesrv DKIM live in NameCheap DNS). DNS is managed at NameCheap (ns: dns1/dns2.registrar-servers.com), NOT Wix. Sender address owned: academy@etaiworld.ai.
FIRST CHECK (before proposing anything new): can MailerSend's existing verified domain provide SMTP creds for Supabase? If yes, reuse it — do NOT add Resend.
DO NOT: add a new email provider before confirming the existing one can't do it · point any DNS at Wix · enter API keys yourself (Ernest pastes).
DEFINITION OF DONE: a real email/password signup delivers its confirmation email + passdown updated. If decision = Google-only, record that and close LFG 4.
RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · git identity coache45@gmail.com
```

## 2 · Old shared-DB key retirement — LFG 2 (on/after 2026-07-23)
```
# KICKOFF — Retire old shared-DB keys · Banner D1 THE AI ACADEMY · 2026-07-23+
FROM: D1 — cutover to own Supabase live + verified; old project kept as rollback net for a 72h window.
GOAL: Retire the old shared-DB (pvflufqfeaowzextilpl) keys now that prod has run clean, and confirm no stale old-project env vars remain in Vercel.
FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\_ops\migration\PHASE3_ROLLBACK_ANCHOR.md
STATE YOU INHERIT: prod = etai-academy.vercel.app on own Supabase lippaasbtqsizqzjxtyq. Rollback anchor documents the old keys as the instant-rollback path — retiring them ENDS that path, so confirm prod health first.
DO NOT: retire keys before verifying prod has been healthy since cutover · rotate keys yourself (security-settings action = Ernest in dashboard).
DEFINITION OF DONE: old keys retired/rotated, Vercel env audited clean, rollback anchor doc updated to note the net is gone + passdown updated.
RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · git identity coache45@gmail.com
```

## 3 · /trust page + BETA badge (backlog item 4)
```
# KICKOFF — /trust page + BETA badge · Banner D1 THE AI ACADEMY · <date>
FROM: D1 — beta presentation layer not yet built.
GOAL: Add a /trust page and a BETA badge to the Academy for the ~20-person cohort.
FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\CLAUDE.md
STATE YOU INHERIT: Next.js app, main @ 49e429d. Routes: src/app/. Brand navy #1B2A4A / gold #C9A84C. Preview-gate before every prod flip.
DO NOT: re-introduce health/dashboard routes · skip the preview gate · add ™/® (filings not clear).
DEFINITION OF DONE: /trust live + BETA badge visible, preview READY before merge, prod verified + passdown updated.
RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · git identity coache45@gmail.com
```

---
### Optional / later (not scoped tonight)
- **Custom Academy URL** — ONLY if you decide you want one; points to Vercel, not Wix. This was a nice-to-have, not a requirement.
- Stripe (item 5) · AI tutor (item 6) · Mini-Brain spec (item 7) — per root README sequencing.
