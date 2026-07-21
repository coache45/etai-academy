/**
 * POST /api/share — create a public share card from one of the user's OWN Ada answers.
 * Anti-abuse: the answer text must match a real assistant message in the caller's
 * tutor history (server-verified), so nobody can publish arbitrary text through
 * our share pages. Returns { id, url }.
 */
import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Please sign in to share.' }, { status: 401 })

  let answer = ''
  try {
    const body = await req.json()
    answer = String(body?.answer ?? '').trim()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  if (!answer || answer.length > 8000) {
    return NextResponse.json({ error: 'Nothing to share.' }, { status: 400 })
  }

  const service = createServiceClient()

  // Verify: this exact answer exists among the caller's recent assistant messages.
  const { data: match } = await service
    .from('tutor_messages')
    .select('id, conversation_id, created_at')
    .eq('user_id', user.id)
    .eq('role', 'assistant')
    .eq('content', answer)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!match) {
    return NextResponse.json(
      { error: 'Only real Ada answers from your own chats can be shared.' },
      { status: 403 }
    )
  }

  // The question = the latest user message in that conversation before the answer.
  const { data: qRow } = await service
    .from('tutor_messages')
    .select('content')
    .eq('conversation_id', match.conversation_id)
    .eq('user_id', user.id)
    .eq('role', 'user')
    .lt('created_at', match.created_at)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const question = (qRow?.content ?? 'A question for Ada').slice(0, 500)

  const { data: share, error } = await service
    .from('shares')
    .insert({ user_id: user.id, question, answer })
    .select('id')
    .single()
  if (error || !share) {
    console.error('[share] insert failed:', error)
    return NextResponse.json({ error: 'Could not create the share. Try again.' }, { status: 500 })
  }

  return NextResponse.json({ id: share.id, url: `/share/${share.id}` })
}
