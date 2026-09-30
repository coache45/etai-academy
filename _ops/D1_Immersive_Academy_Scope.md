# The Immersive AI Academy — High-Level Technical Scope (v0.2, for LFG)
**2026-07-20 · Banner D1 · SCOPE ONLY — no code · synthesized from parallel research (3D/4D web tech · AI-tutor UX · usage-based monetization)**

> A plan for your review. Nothing gets built until you LFG a phase. Two honest framings up front:
> - **"Holographic / 4D"** on a website = the *pop-out look* (depth, parallax, iridescence, glow, motion), NOT literal holograms. True light-field holography needs special hardware (Looking Glass, headsets/WebXR) and isn't a public-website feature. We build the *look* — and it can be genuinely stunning.
> - **Payments stay owner-gated.** I scope the model + build the plumbing; you do the Stripe dashboard/keys. Beta stays free by design until you flip it on.

---

## Pillar A — The Immersive Layer ("visitor magnet" look)
Goal: cards, items, and emojis appear to lift off the screen; signature transitions feel alive. Grounded in what browsers do well in 2026.

**Recommended stack (smallest set, real wow, mobile-safe):**
- **Baseline everywhere (no 3D canvas):** CSS 3D transforms (`preserve-3d`, `translateZ`, `perspective`) + pointer/gyro **tilt & parallax** for card/emoji pop-out. ~70% of the wow at ~10% of the cost; accessible + cheap.
- **Motion** (the Framer Motion successor) for page/route + component transitions ("4D" time-based motion).
- **GSAP + ScrollTrigger** (now fully free, all plugins) for ONE signature scroll-choreographed hero sequence.
- **One** `react-three-fiber` + `drei` WebGL hero object (lazy-loaded, `ssr:false`) with a holographic shader material + bloom via `@react-three/postprocessing` — the single "must-have 3D" moment. Optionally Three.js `WebGPURenderer` (baseline in 2026, auto-falls-back to WebGL2).
- **Premium 3D theme** = a gated visual skin (ties into Pillar C as a paid perk).

**Defer:** sitewide Three.js, Spline as a foundation (heavy payload), big particle fields — add post-beta if metrics allow.

**Non-negotiable guardrails:** honor `prefers-reduced-motion` globally (swap parallax/chromatic-shift for fades — WCAG); lazy-load all canvas + hard asset budget (protect Core Web Vitals / mobile FPS); keep ALL real content in semantic HTML (3D is decorative, `aria-hidden`) so SEO + screen readers still work.

Key repos/libs: `pmndrs/react-three-fiber`, `pmndrs/drei`, `pmndrs/react-three-next` (Next.js starter), `@react-three/postprocessing`, `greensock/GSAP`, `motiondivision/motion`, `pmndrs/uikit`.

## Pillar B — The AI Tutor (proposed name: "Ada")
Goal: a friendly ELI-5 tutor that answers from the Academy's own lessons — the thing people come back for and share.

**Recommended beta build:**
- **Transport:** Vercel **AI SDK** (`ai` + `@ai-sdk/anthropic`) — server Route Handler streams Claude; `useChat` on the client. Key stays server-side.
- **UI:** **assistant-ui** (MIT) — ChatGPT-grade streaming thread out of the box, styled with Tailwind. Token streaming + typing indicator + streamed markdown.
- **Grounding (RAG) — start simple:** Postgres **full-text search** (`tsvector`) over guides + lessons → inject the top 2–4 lesson texts as grounded context → **always cite the source lesson** (drives clicks into your content = magnetic). Graduate to **pgvector** embeddings only when the corpus gets large. No vector DB needed for v1.
- **Presence:** one **Rive** mascot (4–5 states: thinking / talking / happy / confused) wired to chat status. ~80% of "alive" at ~5% of the effort. Defer 3D avatar + lip-sync.
- **Magnet mechanics:** no-login first question (live demo on the landing page), a **reading-level toggle ("ELI-5 / 15 / expert")**, curiosity chips ("give an example", "quiz me"), a "Quiz me" micro-loop with a tiny streak, and a **share-as-OG-card** button on any answer (organic distribution).
- **Voice (optional enhancement only):** Web Speech API mic-to-text where supported; optional **Kokoro-82M** open TTS "read aloud." Defer realtime speech-to-speech (~$0.16–1.63/min — dangerous for a public magnet).

**Safety (why this is gated):** input moderation gate (OpenAI free moderation or self-hosted Llama Guard) before every Claude call; ELI-5 output; **health/finance = educational only** with an automatic "see a professional" line; kind refusals; scope guardrail (not a free general ChatGPT); `TUTOR_ENABLED` kill-switch; per-user daily cap enforced server-side.

Key repos/libs: `assistant-ui/react`, `vercel/ai`, `hexgrad/Kokoro-82M` + `kokoro-web`, `rive-app/rive-react`, `pgvector/pgvector`, Meta `Llama-Guard-3`, `HamedMP/NextRag`.

## Pillar C — Monetization (Free + Pro + add-ons)
Model that covers what you asked: the paid fee absorbs **heavy tutor usage (overage beyond the free cap)** AND **funds the next phase of features**.

**Tiers:**
- **Free (beta default, stays free):** all ELI-5 lessons; tutor capped ~10–25 msgs/day; standard theme.
- **Pro — ~$7–12/mo (or ~$60–99/yr):** much-higher/unlimited tutor cap (absorbs overage) + immersive **3D premium theme** + early access (day 1) → certificates export + personalized learning paths (next) → voice tutor + offline lessons (phase 2).
- **One-time add-ons (free *or* Pro):** certificate/credential export ($3–9), credit top-up pack ($5–10), lifetime theme unlock ($5–15).

**Start flat, meter later:** begin with a **flat Pro tier (higher cap)** — simplest to build + explain. Add metered overage or credit top-ups only after beta shows a heavy-user tail.

**Entitlements model (minimal DB):** you already have `profiles.subscription_tier`. Add `stripe_customer_id`, `subscription_status`, `current_period_end`, `entitlements jsonb`. One server helper `getEntitlements(profile)` → `{ dailyMessageCap, voiceTutor, learningPaths, premiumTheme, certificates }`; gate every feature + the tutor endpoint against that (never raw tier strings).

**The only real integration = one webhook.** Everything else is Stripe dashboard config (Payment Links to buy, Customer Portal to manage — no billing UI to build). A single webhook endpoint (Supabase Edge Function, service key) handles `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.paid`, `invoice.payment_failed` → writes tier/status/period_end/add-on flags. Idempotent + signature-verified; store an access-expiry timestamp and check `expiry > now()`.

**Honest sequencing:** the **`getEntitlements` gate + server-side cap enforcement is useful NOW even while free** (it's your rate limiter) — build that first. DB columns next. The webhook + Payment Link/Portal only when you decide to flip payments on and supply keys.

## Phased build plan (each phase = its own LFG + preview-gate, Fibonacci batches)
- **P1 — Entitlements + caps (free-safe):** DB columns + `getEntitlements` + server-side tutor cap. Doubles as the rate limiter. No payments.
- **P2 — Tutor MVP ("Ada"):** tutor tables (RLS) + `/api/tutor` (AI SDK + Claude + moderation gate) behind `TUTOR_ENABLED` (off) + assistant-ui `/tutor` page + full-text RAG grounding + Rive mascot. Smoke-test on preview; you add the `ANTHROPIC_API_KEY` in Vercel; flip on.
- **P3 — Magnet mechanics:** reading-level toggle, curiosity chips, "quiz me" + streak, share-as-OG-card, landing-page live demo.
- **P4 — Immersive layer:** CSS 3D pop-out + Motion/GSAP transitions sitewide; one R3F/drei holographic hero; gate the premium 3D theme.
- **P5 — Payments (owner-gated):** Stripe Payment Link + Customer Portal + the one webhook → tier/entitlement writes. You do the Stripe setup/keys.
- **P6+ — Expansion the fee funds:** voice tutor, personalized learning paths, certificates export, offline lessons, pgvector RAG.

## What you provide
- **Anthropic API key** — added by you in Vercel env (server-only) at P2; never in chat.
- **Stripe account/keys + dashboard setup** — at P5, by you.
- **Decisions:** tutor name (Ada?), Free daily cap (suggest ~15), Pro price (suggest $9/mo or $79/yr), and which add-ons to launch first.

## What I will NOT do
Handle/enter your Anthropic or Stripe keys; wire live payments; ship the tutor "on" without the moderation gate + kill-switch + preview smoke-test; promise literal holograms.
