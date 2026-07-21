/**
 * Server-side usage caps. Uses the service-role client so counts are tamper-proof
 * (users can read their own usage via RLS but cannot write it). Called by the tutor
 * endpoint before each Claude call. Free-safe: this is the rate limiter today.
 *
 * P3: check+increment is now a single atomic SQL RPC (increment_usage) — no
 * read-then-write race. Day granularity is UTC by design (matches usage_daily).
 */
import { createServiceClient } from '@/lib/supabase/server'

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

export type UsageResult = { allowed: boolean; count: number; remaining: number; cap: number }

/**
 * Atomically check today's usage for (user, kind) against `cap`; if under,
 * increment and allow. Fails CLOSED on database errors.
 */
export async function checkAndIncrementUsage(
  userId: string,
  kind: string,
  cap: number
): Promise<UsageResult> {
  const supabase = createServiceClient()
  const { data, error } = await supabase.rpc('increment_usage', {
    p_user_id: userId,
    p_kind: kind,
    p_cap: cap,
  })

  if (error || !data || data.length === 0) {
    console.error('[usage] increment_usage RPC failed — failing closed:', error)
    return { allowed: false, count: 0, remaining: 0, cap }
  }

  const row = data[0]
  return {
    allowed: row.allowed,
    count: row.new_count,
    remaining: Math.max(0, cap - row.new_count),
    cap,
  }
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
