# Academy AI Tutor — Build Scope (v0.1, for LFG)
**2026-07-20 · Banner D1 · SCOPE ONLY — no code · builds on the live Academy Upgrade**

> A plan for your review. Nothing gets built until you LFG a phase. Follows Crawl-Walk-Run (your rule) + ELI-5 + preview-gate.

## 1. What it is
A friendly, ELI-5 chat tutor inside the Academy — "ask AI about AI (and anything you're learning) in plain English." It fits the mission (*Bring AI to Earth*) and turns the 16 lessons + 132 guides from read-only into something learners can ask questions about.

## 2. Crawl-Walk-Run phases
- **Phase A — Crawl (MVP, supervised):** a `/tutor` chat page. Signed-in only. ELI-5 system prompt. Input moderation gate. Rate-limited + token-capped. Conversations logged for review. No grounding yet, no tool use.
- **Phase B — Walk:** grounding — the tutor answers *from* Academy content (pull the relevant guide/lesson text as context), and a contextual "Ask about this" button on guide/`/explore/[slug]` pages that seeds the tutor with the current lesson.
- **Phase C — Run:** proactive nudges, "suggest my next lesson," light tool use (e.g., mark-complete from chat) — all behind guardrails. Later.

## 3. Architecture (Phase A)
- **Frontend:** `/tutor` — a client chat component (message list + input), streaming responses. A "Tutor" nav link on `/explore` + `/me`.
- **API:** `POST /api/tutor` (server route) — auth-checks the user, runs the moderation gate, calls the Claude API server-side with the ELI-5 system prompt, returns the reply (streamed).
- **Model:** a fast/cheap tier (e.g., Claude Haiku) for cost at beta scale, **configurable** via env; escalate tier later if quality needs it.
- **Key:** `ANTHROPIC_API_KEY` as a **server-only** Vercel env var (NOT `NEXT_PUBLIC`). You add it in the dashboard — never in chat, never in client code.

## 4. Data model (Phase A)
- `tutor_conversations` (id, user_id, created_at) + `tutor_messages` (id, conversation_id, role, content, created_at) — **owner-only RLS** (auth.uid() = user_id), same pattern as `progress`. Powers history + the Review-Diary improvement flywheel.
- `tutor_usage` (user_id, day, message_count) OR an edge rate-limit — for the cost cap (see §5).

## 5. Safety & guardrails (non-negotiable — the reason this is gated)
- **Input moderation gate** before every Claude call — block harmful/abusive prompts; log blocks.
- **ELI-5 output** — system prompt enforces plain language + friendly tone (your ELI-5 gate).
- **Health / financial boundary** — the Academy has health & money content, so the tutor must give *educational* info only, never personalized medical or financial advice, with a short "talk to a professional" line when asked for either. (Consistent with D1's health = content, not the ONE Health app.)
- **Age-appropriate** — the Academy is public; keep it safe for all ages.
- **Cost + abuse control** — per-user daily message cap (e.g. 20–30 for beta) + max tokens per reply + a global kill-switch env flag (`TUTOR_ENABLED`) so you can turn it off instantly.
- **Privacy** — conversations are the user's own (RLS); note tutor use on `/trust`.

## 6. Build plan (Fibonacci batches, each preview-gated)
- **T1:** migration (tutor tables + RLS) → verify (RLS + advisors) → types.
- **T2:** `/api/tutor` route (auth + moderation + Claude call + rate limit) behind `TUTOR_ENABLED` flag (default off).
- **T3:** `/tutor` chat UI + nav links.
- **T4:** log + a minimal review view; flip `TUTOR_ENABLED` on after you add the key and we smoke-test on preview.
- (Phase B/C later.)

## 7. Open decisions for you
1. **Surface:** dedicated `/tutor` page (MVP, recommended) vs. a floating widget on every page (nicer, more work).
2. **Model tier:** start on a cheap/fast tier (recommended) — OK?
3. **Persistence:** log conversations from day one (recommended, feeds Review Diary) vs. stateless MVP.
4. **Access:** signed-in only (recommended — enables rate-limit + history) vs. public with tighter caps.
5. **Daily message cap** for beta (suggest ~25/user/day).

## 8. What you provide
- The `ANTHROPIC_API_KEY` — added by **you** in Vercel env as a server secret when we reach T2/T4 (never pasted to me).
- Answers to §7 (or accept the recommendations and I proceed).

## 9. What I will NOT do
Handle/enter your API key; wire payments; ship the tutor "on" without the moderation gate + the kill-switch + a preview smoke-test first.
