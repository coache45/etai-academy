# Phase 3 Rollback Anchor — recorded 2026-07-21 before env repoint
Old (shared) Supabase values the app ran on until Phase 3:
- NEXT_PUBLIC_SUPABASE_URL = https://pvflufqfeaowzextilpl.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = <legacy anon JWT redacted 2026-09-30 - public by design, live value in Vercel env NEXT_PUBLIC_SUPABASE_ANON_KEY; moves to sb_publishable_ with the key migration>
- SUPABASE_SERVICE_ROLE_KEY = NOT recorded (secret) — re-copy from old project dashboard (pvflufqfeaowzextilpl → Settings → API Keys) if rollback ever needed.
Rollback = restore these three in Vercel (byte-clean via cmd echo|set /p) + vercel redeploy. Old DB untouched and still fully loaded.
New values: URL = https://lippaasbtqsizqzjxtyq.supabase.co; anon key per Supabase MCP get_publishable_keys.
