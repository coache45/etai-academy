// Stripe webhook — the ONE payments integration (P5).
// Signature-verified (manual HMAC-SHA256 of the Stripe-Signature header, 5-min
// tolerance), idempotent (stripe_events insert-first ledger), fail-closed when
// STRIPE_WEBHOOK_SECRET is unset. Writes subscription state + entitlements to
// profiles and claims Founder slots (first 1000) atomically.
// verify_jwt is disabled for this function: Stripe cannot send a Supabase JWT;
// authentication IS the signature check below.
import { createClient } from 'npm:@supabase/supabase-js@2'

const encoder = new TextEncoder()

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

async function verifyStripeSignature(
  payload: string,
  sigHeader: string | null,
  secret: string,
  toleranceSec = 300
): Promise<boolean> {
  if (!sigHeader) return false
  const t = sigHeader
    .split(',')
    .find((p) => p.startsWith('t='))
    ?.slice(2)
  const v1s = sigHeader
    .split(',')
    .filter((p) => p.startsWith('v1='))
    .map((p) => p.slice(3))
  if (!t || v1s.length === 0) return false
  const ts = parseInt(t, 10)
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > toleranceSec) return false
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${t}.${payload}`))
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return v1s.some((v1) => timingSafeEqual(v1, expected))
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// deno-lint-ignore no-explicit-any
type AnyObj = Record<string, any>

function subStatusToProfile(status: string): 'active' | 'past_due' | 'canceled' | 'inactive' {
  if (status === 'active' || status === 'trialing') return 'active'
  if (status === 'past_due') return 'past_due'
  if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired') return 'canceled'
  return 'inactive'
}

function customerIdOf(obj: AnyObj): string | null {
  const c = obj?.customer
  if (typeof c === 'string') return c
  if (c && typeof c.id === 'string') return c.id
  return null
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const secret = getWebhookSecret()
  if (!secret) return new Response('Webhook not configured', { status: 503 }) // fail closed

  const payload = await req.text()
  const valid = await verifyStripeSignature(payload, req.headers.get('stripe-signature'), secret)
  if (!valid) return new Response('Invalid signature', { status: 400 })

  let event: AnyObj
  try {
    event = JSON.parse(payload)
  } catch {
    return new Response('Bad payload', { status: 400 })
  }
  if (typeof event?.id !== 'string' || typeof event?.type !== 'string') {
    return new Response('Bad event', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Idempotency: first writer wins; duplicates ack without reprocessing.
  const { error: ledgerErr } = await supabase
    .from('stripe_events')
    .insert({ id: event.id, type: event.type })
  if (ledgerErr) {
    if ((ledgerErr as AnyObj).code === '23505') return json({ received: true, duplicate: true })
    console.error('[stripe-webhook] ledger error:', ledgerErr)
    return new Response('Ledger error', { status: 500 })
  }

  try {
    const obj: AnyObj = event.data?.object ?? {}

    switch (event.type) {
      case 'checkout.session.completed': {
        // Link the Stripe customer to the Supabase user.
        // Payment Link buy button appends ?client_reference_id=<user.id>.
        const customerId = customerIdOf(obj)
        let profileId: string | null =
          typeof obj.client_reference_id === 'string' ? obj.client_reference_id : null
        if (!profileId) {
          const email = obj.customer_details?.email ?? obj.customer_email
          if (email) {
            const { data: p } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', email)
              .maybeSingle()
            profileId = p?.id ?? null
          }
        }
        if (profileId && customerId) {
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', profileId)
        } else {
          console.warn('[stripe-webhook] checkout completed but could not link customer', {
            hasProfile: !!profileId,
            hasCustomer: !!customerId,
          })
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const customerId = customerIdOf(obj)
        if (!customerId) break
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, is_founder, subscription_tier')
          .eq('stripe_customer_id', customerId)
          .maybeSingle()
        if (!profile) {
          console.warn('[stripe-webhook] subscription event for unknown customer', customerId)
          break
        }

        const deleted = event.type === 'customer.subscription.deleted'
        const status = deleted ? 'canceled' : subStatusToProfile(String(obj.status ?? ''))
        const active = status === 'active'
        const periodEnd =
          typeof obj.current_period_end === 'number'
            ? new Date(obj.current_period_end * 1000).toISOString()
            : null

        const updates: AnyObj = {
          subscription_status: status,
          current_period_end: periodEnd,
          subscription_tier: active ? 'pro' : deleted ? 'free' : profile.subscription_tier,
        }

        // Founder cohort: first activation claims one of the first 1000 slots.
        if (active && !profile.is_founder) {
          const { data: claimed, error: claimErr } = await supabase.rpc('claim_founder_slot')
          if (claimErr) console.error('[stripe-webhook] claim_founder_slot error:', claimErr)
          if (claimed === true) updates.is_founder = true
        }

        await supabase.from('profiles').update(updates).eq('id', profile.id)
        break
      }

      case 'invoice.paid': {
        const customerId = customerIdOf(obj)
        if (!customerId) break
        await supabase
          .from('profiles')
          .update({ subscription_status: 'active' })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'invoice.payment_failed': {
        const customerId = customerIdOf(obj)
        if (!customerId) break
        await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId)
        break
      }

      default:
        // Acknowledged but not handled — keep the ledger row so retries no-op.
        break
    }

    return json({ received: true })
  } catch (e) {
    console.error('[stripe-webhook] handler error:', e)
    // Release the ledger row so Stripe's retry can reprocess this event.
    await supabase.from('stripe_events').delete().eq('id', event.id)
    return new Response('Handler error', { status: 500 })
  }
})

function getWebhookSecret(): string {
  return Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
}
