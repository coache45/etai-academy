import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// POST /api/progress  { item_type: 'guide'|'content', item_slug: string }
// Records the signed-in user's completion. RLS enforces auth.uid() = user_id.
export async function POST(req: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  let payload: { item_type?: string; item_slug?: string }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { item_type, item_slug } = payload
  if ((item_type !== 'guide' && item_type !== 'content') || !item_slug) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  const { error } = await supabase.from('progress').upsert(
    {
      user_id: user.id,
      item_type,
      item_slug,
      status: 'completed',
      percent: 100,
    },
    { onConflict: 'user_id,item_type,item_slug' }
  )

  if (error) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  // Completing a lesson counts toward the learning streak (server-role RPC; non-blocking).
  try {
    const service = createServiceClient()
    const { error: streakError } = await service.rpc('bump_streak', { p_user_id: user.id })
    if (streakError) console.error('[progress] bump_streak failed (non-blocking):', streakError)
  } catch (e) {
    console.error('[progress] bump_streak threw (non-blocking):', e)
  }
  return NextResponse.json({ ok: true })
}
