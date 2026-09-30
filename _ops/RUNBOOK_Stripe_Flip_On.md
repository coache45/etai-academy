# Stripe Flip-On Runbook — Ernest's clicks (P5 · prepared 2026-07-21)
**Everything below is YOUR dashboard work — no code changes needed. The plumbing is deployed, verified, and fails closed until these steps are done. Do them whenever you decide to charge; beta stays free until then.**

## ELI-5
The cash register is built, tested, and locked. This is the list of keys you turn to open it: create the products in Stripe, hang the "buy" link on the site, and hand the register the secret handshake so it only accepts real Stripe messages.

## A. Stripe Dashboard (stripe.com)
1. **Products** → create "Academy Pro": price 1 = **$9/mo** recurring, price 2 = **$79/yr** recurring. (Founder = these launch prices; the first 1,000 buyers keep them for life — the webhook marks `is_founder` automatically.)
2. **Payment Links** → create one for Pro (let the buyer pick monthly/yearly, or make two links). Options: allow promotion codes if you want. Copy the link URL (`https://buy.stripe.com/...`).
3. **Settings → Billing → Customer portal** → activate it; copy the portal login link (`https://billing.stripe.com/p/login/...`).
4. **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://lippaasbtqsizqzjxtyq.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
   - Create → reveal the **Signing secret** (`whsec_...`).

## B. Supabase Dashboard (the webhook's secret handshake)
Edge Functions → `stripe-webhook` → **Secrets** → add `STRIPE_WEBHOOK_SECRET` = the `whsec_...` from step A4. (This lives in SUPABASE, not Vercel.)

## C. Vercel (makes the upgrade card appear)
Settings → Environment Variables (Production, then Redeploy):
- `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` = the Payment Link URL from A2
- `NEXT_PUBLIC_STRIPE_PORTAL_URL` = the portal login link from A3

## D. Verify with Stripe TEST mode first (10 min, no real money)
1. Do A1–A4 in **Test mode** (toggle in Stripe) with test-mode secret in Supabase.
2. Buy Pro with card `4242 4242 4242 4242` from your own /me upgrade card.
3. Check: /me shows ✨ Pro + 🏛 Founder · Supabase `profiles` row has `stripe_customer_id`, `subscription_tier=pro`, `subscription_status=active` · `founder_slots.claimed=1` · `stripe_events` has the event ids.
4. Cancel via the portal → status flips to canceled, tier back to free, Founder badge stays (locked price honored on return).
5. If all good: repeat A–C in **Live mode** with live keys. Reset test artifacts if desired (`stripe_events` rows are harmless history).

## What's already proven (you don't need to re-test the machinery)
Signature verification (bad/stale → 400), idempotent replay (duplicate → no-op), activation writes (pro/active/period-end/founder claim), cancellation writes (free/canceled, founder retained), fail-closed when secret missing (503), founder cap at 1,000 (claim at cap → false). All verified with synthetic signed events on 2026-07-21; all test state restored.

## Never
Paste any `sk_live_`, `whsec_`, or restricted key into chat — dashboards only. The site never touches card data (Stripe-hosted checkout only).
