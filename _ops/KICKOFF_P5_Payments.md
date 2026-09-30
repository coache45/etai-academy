# KICKOFF — P5 Payments (OWNER-GATED) · Banner D1 THE AI ACADEMY · 2026-07-21
FROM: D1 session that completed P1–P4 (PRs #30–#36) — entitlements, Ada, magnet mechanics, middleware fix, immersive layer. main @ b639566.
GOAL: Wire the monetization plumbing so Ernest can flip payments on: Stripe Payment Link (Pro $9/mo | $79/yr, Founder price locked for first 1,000) + Customer Portal + ONE webhook that writes entitlements. Beta stays free until Ernest supplies keys and LFGs the flip.
FIRST READ (in order): C:\dev\README.md · etai-academy\README.md · etai-academy\CLAUDE.md · _ops\D1_Immersive_Academy_Scope.md (Pillar C) · Cowork project memory (project_state).
STATE YOU INHERIT (verified 2026-07-21):
- main @ b639566 = prod. Repo id 1177761765. Supabase lippaasbtqsizqzjxtyq, advisors clean.
- DB ready since P1: profiles.stripe_customer_id / subscription_status / current_period_end / entitlements jsonb / is_founder; founder_slots (claimed/cap 1000). getEntitlements() is the ONLY gate — never raw tier strings.
- Ada + demo + share built (dark, TUTOR_ENABLED); immersive layer LIVE; premium Aurora theme already gated by entitlements.premiumTheme (P5 makes it earnable).
- Stripe NOT wired anywhere (standing fact; `stripe` npm dep exists in package.json, unused).
BUILD SHAPE (from approved scope — the ONLY real integration is one webhook):
1. Supabase Edge Function `stripe-webhook` (service key): signature-verified + idempotent (event id table); handles checkout.session.completed, customer.subscription.created/updated/deleted, invoice.paid, invoice.payment_failed → writes tier/status/current_period_end/entitlements; claims a founder slot atomically (founder_slots RPC, cap-checked) on first Pro purchase and sets is_founder + locked price metadata.
2. No billing UI: Stripe Payment Link (buy) + Customer Portal (manage) — Ernest configures both in the Stripe dashboard; site just links out.
3. /me + /tutor surface tier + founder badge from entitlements (display only).
4. Access check stays `current_period_end > now()` + status active — already how getEntitlements reads.
WHAT ERNEST PROVIDES (never in chat): Stripe account keys + webhook signing secret (Vercel/Supabase secrets), Payment Link + Portal dashboard setup, the LFG to flip.
DO NOT: handle/enter keys · enable live payments without Ernest's explicit flip · bypass getEntitlements · break the free tier (free stays fully usable) · touch eli5_guides behavior · re-introduce health routes · skip preview gate · bump ai→5.x or fiber→9/drei→10 · commit .gitignore/CLAUDE.md/README/_ops in code PRs.
DEFINITION OF DONE: webhook deployed + signature-verified against Stripe test events + idempotency proven (replay same event) + founder-slot cap proven (claim at cap fails cleanly) + preview READY + merged + prod field-test with Stripe TEST mode + passdown updated + P6 kickoff generated.
RULES: LFG per step · plan-before-code · ELI-5 · verify before complete · git identity coache45@gmail.com.
