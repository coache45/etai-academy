/**
 * Server-side usage caps. Uses the service-role client so counts are tamper-proof
 * (users can read their own usage via RLS but cannot write it). Called by the tutor
 * endpoint (P2) before each Claude call. Free-safe: this is the rate limiter today.
 */
import { createServiceClient } from '@/lib/supabase/server'

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

export type UsageResult = { allowed: boolean; count: number; remaining: number; cap: number }

/**
 * Check today's usage for (user, kind) against `cap`; if under, increment and allow.
 * Returns whether the action is allowed plus the remaining budget.
 */
export async function checkAndIncrementUsage(
  userId: string,
  kind: string,
  cap: number
): Promise<UsageResult> {
  const supabase = createServiceClient()
  const day = todayUTC()

  const { data: existing } = await supabase
    .from('usage_daily')
    .select('count')
    .eq('user_id', userId)
    .eq('day', day)
    .eq('kind', kind)
    .maybeSingle()

  const current = existing?.count ?? 0
  if (current >= cap) {
    return { allowed: false, count: current, remaining: 0, cap }
  }

  const next = current + 1
  await supabase
    .from('usage_daily')
    .upsert({ user_id: userId, day, kind, count: next }, { onConflict: 'user_id,day,kind' })

  return { allowed: true, count: next, remaining: Math.max(0, cap - next), cap }
}

/** Read-only: how many times (user, kind) has acted today. */
export async function getUsageToday(userId: string, kind: string): Promise<number> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('usage_daily')
    .select('count')
    .eq('user_id', userId)
    .eq('day', todayUTC())
    .eq('kind', kind)
    .maybeSingle()
  return data?.count ?? 0
}
