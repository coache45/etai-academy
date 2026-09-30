# The AI Academy — Upgrade Design Pass (v0.1, for LFG)
**2026-07-20 · Banner D1 · DESIGN ONLY — no build · draws on the AICI Academy template (`C:\dev\aici-academy`)**

> This is a plan for your review, not code. Nothing here gets built until you LFG a phase.

## 1. What we're building toward
Evolve The AI Academy from an ELI5-guides + O-Spot hub into the diverse **"All things AI" educational Academy** — *Bring AI to Earth*, so everyday people discover how AI can help them take control of their lives. Broad discovery hub: not just written guides, but videos, tutorials, tools, guided learning, and media.

## 2. One boundary to lock BEFORE anything (important)
D1's never-bend rule says: **never re-introduce health/dashboard routes** — because ONE Health is a *separate app* (D2). Your vision keeps **health "still involved."** These are not in conflict IF we hold this line:

- **Health here = educational content** (guides/videos/tutorials *about* health, sleep, nutrition, mental health) — which already exists as guide categories. ✅ In scope.
- **Health tracking / the ONE Health app** (dashboards, wearables, metrics) = **D2, stays out.** ❌
- The learner's progress page will be named **`/me` or `/profile`**, never `/dashboard`, to avoid resurrecting the banned ONE Health route pattern.

Please confirm this boundary — it shapes the whole IA.

## 3. Content pillars (organizing your list)
| Pillar | Covers | Today |
|---|---|---|
| **Learn AI** | AI literacy, how AI works, prompting, tools-explained | exists (guides: AI Basics, Tools) |
| **Health & Wellbeing** | health, sleep, nutrition, **mental health** — as *content* | exists (guide categories) |
| **Lifestyle & Life-Management** | using AI for everyday life, relationships, parenting, money | partial (Couples/Business/Relationships guides) |
| **Tools & Tutorials** | AI tool walkthroughs, videos, how-tos | new surface |
| **Learning Stations** | guided multi-step tracks (the "Ladder" pattern) | new |
| **Media & Broadcasts** | O-Spot podcast + video/media broadcasts | O-Spot exists; video new |

## 4. Surfaces (information architecture)
- **`/` Hub** — discovery home, pillar entry points, featured content
- **`/explore` (or per-pillar hubs)** — the current `/guides` grows into a multi-format explorer (guides + videos + tutorials + stations), filterable by pillar — *open decision: one unified explorer vs. separate pillar routes*
- **`/guides`** — keep (written ELI5)
- **`/videos` · `/tutorials`** — new formats
- **`/stations`** — guided learning tracks
- **`/media` (O-Spot + broadcasts)** — expand the podcast page
- **`/me`** — learner progress/profile (NOT `/dashboard`)
- **`/community`** — Review Diary + engagement (see §5)
- **`/onboarding`** — already the 2-step flow; extends to pick pillars

## 5. Engagement layer — the "wow factor" borrowed from AICI Academy
Adapt the *patterns and look* (the AICI app is a standalone HTML build; the Academy is Next.js — so we rebuild the patterns in-stack, we don't lift the HTML):
1. **The Ladder** — visible progression/leveling as learners complete content → the core engagement hook.
2. **Credentials / badges** — completion credentials per station/pillar (AICI Credential System pattern).
3. **Animated Toolbox** — interactive, browsable catalog of AI tools with a lively feel.
4. **Learner Orientation** — a guided "here's how the Academy works" first-run.
5. **Per-user progress** — Supabase, owner-only RLS (your provisioning trigger already exists).
6. **Review Diary** — per-user diary (likes/questions/feedback, editable) → the community + improvement flywheel.
7. **Trust signal** — `/trust` page + (later) an Aethelgard-grade badge.

## 6. Where the mini-brain slots in (DEFERRED — placeholder only)
The upgrade is where the **mini-brain makes its first appearance.** Per your note, we scope this **later** — I've left a hook in Phase 5 and will not design it unprompted.

## 7. Phased build plan (each phase = its own LFG + preview-gate)
- **Phase 0 — Design lock** *(now)*: you review this → we settle the §2 boundary + §4 IA + the unified-vs-pillar-routes decision → wireframe sign-off. *No code.*
- **Phase 1 — Foundation**: extend the content model beyond guides (videos/tutorials/stations) in the Academy's own Supabase; grow the taxonomy; regenerate `database.types.ts`.
- **Phase 2 — Engagement layer**: progression (Ladder), `/me` progress page, credentials/badges — the retention core.
- **Phase 3 — Pillars + media fill**: video/tutorial surfaces, learning stations, pillar hubs, health-as-content.
- **Phase 4 — Community + trust**: Review Diary, `/trust`, BETA badge.
- **Phase 5 — Mini-brain (first appearance)**: separate spec, deferred.
- **Phase 6 — AI tutor**: the AICI tutor pattern, flag-gated, later.

## 8. Open decisions for you (blockers to Phase 1)
1. Confirm the **health = content, not app** boundary (§2).
2. IA: **one unified `/explore`** with pillar filters, or **separate pillar routes**?
3. Reuse depth: adapt AICI's **look + patterns** in Next.js (recommended), vs. anything you want lifted more directly?
4. New-format content (videos/tutorials): **generate, curate, or both**?

## 9. Constraints carried in (never bend)
LFG per phase · plan-before-code · ELI-5 on every label · preview-gate before every prod flip · repo verified by id (1177761765) · no `/dashboard` or health-*app* routes · no ™/® until filings clear · Stripe stays unwired (free beta by design).
