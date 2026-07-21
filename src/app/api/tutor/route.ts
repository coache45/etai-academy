/**
 * POST /api/tutor — Ada, the Academy's ELI-5 tutor (P2 MVP).
 *
 * Gate order (all server-side, none bypassable from the client):
 *   1. TUTOR_ENABLED kill-switch (default OFF)
 *   2. Auth (signed-in only)
 *   3. Free rule checks + daily cap (entitlements-driven; increments BEFORE the
 *      moderation model call so every paid token is inside the cap)
 *   4. Input moderation gate (fails closed)
 *   5. FTS grounding over published guides + content_items (cited in answers)
 *   6. Claude via Vercel AI SDK, streamed; conversation logged (owner-read RLS)
 */
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/entitlements'
import { checkAndIncrementUsage } from '@/lib/usage'
import { moderateInput, MAX_INPUT_CHARS } from '@/lib/tutor/moderation'
import { buildAdaSystemPrompt, READING_LEVELS, type AcademySource, type ReadingLevel } from '@/lib/tutor/prompt'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function friendly(status: number, message: string) {
  return new Response(message, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

export async function POST(req: Request) {
  // 1. Kill-switch — default OFF.
  if (process.env.TUTOR_ENABLED !== 'true') {
    return friendly(503, 'Ada is still waking up — the tutor is not switched on yet. Check back soon!')
  }

  // 2. Signed-in only.
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return friendly(401, 'Please sign in to chat with Ada.')

  // Parse the useChat body.
  let messages: ChatMessage[] = []
  let level: ReadingLevel = 'eli5'
  try {
    const body = await req.json()
    if (READING_LEVELS.includes(body?.level)) level = body.level as ReadingLevel
    messages = (body?.messages ?? [])
      .filter((m: ChatMessage) => m && (m.role === 'user' || m.role === 'assistant'))
      .map((m: ChatMessage) => ({ role: m.role, content: String(m.content ?? '') }))
      .slice(-12) // bounded context window
  } catch {
    return friendly(400, 'That message did not come through. Please try again.')
  }
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUser || !lastUser.content.trim()) {
    return friendly(400, 'Ask Ada a question to get started!')
  }
  if (lastUser.content.length > MAX_INPUT_CHARS) {
    return friendly(400, `That question is a bit long for Ada — try keeping it under ${MAX_INPUT_CHARS} characters.`)
  }

  const service = createServiceClient()

  // 3. Entitlements + daily cap (tamper-proof: service-role counter).
  const { data: profile } = await service
    .from('profiles')
    .select('subscription_tier, subscription_status, entitlements, is_founder, display_name')
    .eq('id', user.id)
    .maybeSingle()
  const ents = getEntitlements(profile ?? null)
  const usage = await checkAndIncrementUsage(user.id, 'tutor', ents.dailyTutorCap)
  if (!usage.allowed) {
    return friendly(
      429,
      `You have used all ${usage.cap} of today's tutor messages. Your questions reset tomorrow — or Pro will raise the cap when it launches.`
    )
  }

  // 4. Moderation gate — before ANY tutoring tokens are generated. Fails closed.
  const verdict = await moderateInput(lastUser.content)
  if (!verdict.allowed) {
    console.warn(`[tutor] blocked message user=${user.id} reason=${verdict.reason}`)
    if (verdict.reason === 'moderation-unavailable') {
      return friendly(503, 'Ada could not safety-check that message just now. Please try again in a moment.')
    }
    return friendly(
      400,
      "Ada can't help with that one — she sticks to friendly, safe learning questions. Try asking about something you'd like to understand!"
    )
  }

  // Learning streak: a real (allowed, moderated) tutor question counts as today's activity.
  service
    .rpc('bump_streak', { p_user_id: user.id })
    .then(({ error }) => {
      if (error) console.error('[tutor] bump_streak failed (non-blocking):', error)
    })

  // 5. Grounding: full-text search over the Academy's own published lessons.
  let sources: AcademySource[] = []
  try {
    const { data } = await service.rpc('search_academy_content', {
      query: lastUser.content.slice(0, 300),
      max_results: 4,
    })
    sources = (data ?? []) as AcademySource[]
  } catch (err) {
    console.error('[tutor] search_academy_content failed (answering ungrounded):', err)
  }

  // Conversation log (owner-read RLS; server-role writes). One thread per day.
  let conversationId: string | null = null
  try {
    const dayStart = new Date()
    dayStart.setUTCHours(0, 0, 0, 0)
    const { data: existing } = await service
      .from('tutor_conversations')
      .select('id')
      .eq('user_id', user.id)
      .gte('updated_at', dayStart.toISOString())
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (existing) {
      conversationId = existing.id
    } else {
      const { data: created } = await service
        .from('tutor_conversations')
        .insert({ user_id: user.id, title: lastUser.content.slice(0, 60) })
        .select('id')
        .single()
      conversationId = created?.id ?? null
    }
    if (conversationId) {
      await service.from('tutor_messages').insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'user',
        content: lastUser.content,
      })
    }
  } catch (err) {
    console.error('[tutor] conversation logging failed (continuing):', err)
  }

  // 6. Ada answers, streamed.
  const result = await streamText({
    model: anthropic(process.env.TUTOR_MODEL ?? 'claude-haiku-4-5'),
    system: buildAdaSystemPrompt(sources, profile?.display_name, level),
    messages,
    maxTokens: 1024,
    temperature: 0.6,
    onFinish: async ({ text }) => {
      if (!conversationId) return
      try {
        await service.from('tutor_messages').insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'assistant',
          content: text,
        })
        await service
          .from('tutor_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)
      } catch (err) {
        console.error('[tutor] assistant message logging failed:', err)
      }
    },
  })

  return result.toDataStreamResponse({
    headers: { 'x-tutor-remaining': String(usage.remaining) },
  })
}
