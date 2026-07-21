/**
 * POST /api/certificate — mint a public shareable certificate from one of the
 * caller's OWN earned credentials. Entitlement-gated (Pro perk: certificates).
 * Server-verified: the credential must exist on the caller's account; the
 * learner name comes from their profile. Returns { id, url }.
 */
import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/entitlements'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(req: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })

  let credentialId = ''
  try {
    const body = await req.json()
    credentialId = String(body?.credentialId ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  if (!UUID_RE.test(credentialId)) {
    return NextResponse.json({ error: 'Invalid credential.' }, { status: 400 })
  }

  const service = createServiceClient()

  // Entitlement gate: certificates are a Pro perk.
  const { data: profile } = await service
    .from('profiles')
    .select('subscription_tier, subscription_status, entitlements, is_founder, display_name, full_name')
    .eq('id', user.id)
    .maybeSingle()
  const ents = getEntitlements(profile ?? null)
  if (!ents.certificates) {
    return NextResponse.json(
      { error: 'Certificate export is a Pro perk — it unlocks when Pro launches.' },
      { status: 403 }
    )
  }

  // The credential must be the caller's own.
  const { data: cred } = await service
    .from('credentials')
    .select('id, code, label, emoji, awarded_at')
    .eq('id', credentialId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!cred) {
    return NextResponse.json({ error: 'That badge is not on your account.' }, { status: 403 })
  }

  const learnerName = profile?.display_name || profile?.full_name || 'An Academy learner'

  // Reuse an existing certificate for this credential if one was already minted.
  const { data: existing } = await service
    .from('cert_shares')
    .select('id')
    .eq('user_id', user.id)
    .eq('code', cred.code)
    .maybeSingle()
  if (existing) {
    return NextResponse.json({ id: existing.id, url: `/cert/${existing.id}` })
  }

  const { data: cert, error } = await service
    .from('cert_shares')
    .insert({
      user_id: user.id,
      code: cred.code,
      label: cred.label,
      emoji: cred.emoji,
      learner_name: learnerName,
      awarded_at: cred.awarded_at,
    })
    .select('id')
    .single()
  if (error || !cert) {
    console.error('[certificate] insert failed:', error)
    return NextResponse.json({ error: 'Could not mint the certificate. Try again.' }, { status: 500 })
  }

  return NextResponse.json({ id: cert.id, url: `/cert/${cert.id}` })
}
