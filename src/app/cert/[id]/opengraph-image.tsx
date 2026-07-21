import { ImageResponse } from 'next/og'

// Branded OG card for shared certificates. Edge runtime; Supabase REST + anon key.
export const runtime = 'edge'
export const alt = 'Certificate of Achievement — ET AI Academy'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type CertRow = { label: string; emoji: string; learner_name: string }

async function getCert(id: string): Promise<CertRow | null> {
  if (!UUID_RE.test(id)) return null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try {
    const res = await fetch(
      `${url}/rest/v1/cert_shares?id=eq.${id}&select=label,emoji,learner_name&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    )
    if (!res.ok) return null
    const rows = (await res.json()) as CertRow[]
    return rows[0] ?? null
  } catch {
    return null
  }
}

export default async function Image({ params }: { params: { id: string } }) {
  const cert = await getCert(params.id)
  const learner = (cert?.learner_name ?? 'An Academy learner').slice(0, 60)
  const label = (cert?.label ?? 'Academy Achievement').slice(0, 60)
  const emoji = cert?.emoji ?? '🏅'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#040C24',
          backgroundImage:
            'radial-gradient(700px 350px at 80% 0%, rgba(10,114,210,0.35), transparent), radial-gradient(500px 300px at 10% 100%, rgba(244,158,8,0.15), transparent)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '3px solid #C9A84C',
            borderRadius: 24,
            padding: '48px 88px',
            backgroundColor: 'rgba(6,18,51,0.85)',
          }}
        >
          <div style={{ color: '#7FD6FF', fontSize: 22, letterSpacing: 8, fontWeight: 700 }}>
            ET AI ACADEMY
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 40, fontWeight: 800, marginTop: 8 }}>
            Certificate of Achievement
          </div>
          <div style={{ fontSize: 90, marginTop: 20 }}>{emoji}</div>
          <div style={{ color: '#F49E08', fontSize: 52, fontWeight: 800, marginTop: 16 }}>
            {learner}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 30, marginTop: 12 }}>
            reached {label} on the Academy Ladder
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 20, marginTop: 24 }}>
            Bringing AI Down to Earth · etai-academy.vercel.app
          </div>
        </div>
      </div>
    ),
    size
  )
}
