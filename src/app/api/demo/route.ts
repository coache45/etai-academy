/**
 * POST /api/demo — the landing-page "ask Ada one thing" magnet. No login.
 * Cost/abuse controls (all server-side): rides the same TUTOR_ENABLED kill-switch,
 * per-IP daily cap (3) + global daily cap (300) via atomic increment_demo RPC,
 * moderation gate (fails closed), short non-streamed answer, nothing stored.
 */
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { createServiceClient } from '@/lib/supabase/server'
import { moderateInput } from '@/lib/tutor/moderation'
import { buildAdaSystemPrompt, type AcademySource } from '@/lib/tutor/prompt'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const DEMO_IP_DAILY_CAP = 3
const DEMO_GLOBAL_DAILY_CAP = 300
const DEMO_MAX_CHARS = 300

export async function POST(req: Request) {
  if (process.env.TUTOR_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'Ada is still waking up — the live demo switches on soon!' },
      { status: 503 }
    )
  }

  let question = ''
  try {
    const body = await req.json()
    question = String(body?.question ?? '').trim()
  } catch {
    return NextResponse.json({ error: 'That did not come through — try again.' }, { status: 400 })
  }
  if (!question) return NextResponse.json({ error: 'Ask a question first!' }, { status: 400 })
  if (question.length > DEMO_MAX_CHARS) {
    return NextResponse.json(
      { error: `Keep demo questions under ${DEMO_MAX_CHARS} characters — or sign up free for the full tutor.` },
      { status: 400 }
    )
  }

  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  const ipHash = createHash('sha256').update(`ada-demo:${ip}`).digest('hex').slice(0, 32)

  const service = createServiceClient()
  const { data: ipAllowed, error: ipErr } = await service.rpc('increment_demo', {
    p_ip_hash: ipHash,
    p_cap: DEMO_IP_DAILY_CAP,
  })
  if (ipErr || ipAllowed !== true) {
    return NextResponse.json(
      { error: "That's the demo limit for today — create a free account to keep asking Ada." },
      { status: 429 }
    )
  }
  const { data: globalAllowed, error: gErr } = await service.rpc('increment_demo', {
    p_ip_hash: '__global__',
    p_cap: DEMO_GLOBAL_DAILY_CAP,
  })
  if (gErr || globalAllowed !== true) {
    return NextResponse.json(
      { error: 'The demo is very popular today! Create a free account to ask Ada directly.' },
      { status: 429 }
    )
  }

  const verdict = await moderateInput(question)
  if (!verdict.allowed) {
    return NextResponse.json(
      { error: "Ada sticks to friendly learning questions — try asking about something you'd like to understand!" },
      { status: 400 }
    )
  }

  let sources: AcademySource[] = []
  try {
    const { data } = await service.rpc('search_academy_content', {
      query: question,
      max_results: 3,
    })
    sources = (data ?? []) as AcademySource[]
  } catch {
    // answer ungrounded
  }

  try {
    const { text } = await generateText({
      model: anthropic(process.env.TUTOR_MODEL ?? 'claude-haiku-4-5'),
      system:
        buildAdaSystemPrompt(sources, 'a curious visitor', 'eli5') +
        '\n\nDEMO MODE: this is a one-question public demo. Keep the answer under 120 words. End with one warm line inviting them to join the Academy free to keep learning with you.',
      prompt: question,
      maxTokens: 350,
      temperature: 0.6,
    })
    return NextResponse.json({ answer: text })
  } catch (err) {
    console.error('[demo] generation failed:', err)
    return NextResponse.json(
      { error: 'Ada tripped over a wire — please try again in a moment.' },
      { status: 500 }
    )
  }
}
