import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createAdminClient } from './admin'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Server component — can't set cookies
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Server component — can't set cookies
          }
        },
      },
    }
  )
}

/**
 * Service-role client — cookie-BLIND by design.
 *
 * Lesson learned 2026-07-21: the previous implementation built this on
 * @supabase/ssr with the request cookies, so whenever a SIGNED-IN user hit an
 * API route, the client authenticated as that user (role `authenticated`)
 * instead of `service_role`. Every server-only RPC (increment_usage,
 * bump_streak, search grounding) then failed with 42501 for logged-in users
 * while working for anonymous ones. A service client must never see request
 * cookies — it delegates to the bare service-key client in admin.ts.
 */
export function createServiceClient() {
  return createAdminClient()
}
