import { ImageResponse } from 'next/og'

// Branded OG card for shared Ada answers. Edge runtime; fetches the share row
// via Supabase REST with the public anon key (shares are public-read by link).
export const runtime = 'edge'
export const alt = 'Ada answers — ET AI Academy'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type ShareRow = { question: string; answer: string }

async function getShare(id: string): Promise<ShareRow | null> {
  if (!UUID_RE.test(id)) return null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try {
    const res = await fetch(
      `${url}/rest/v1/shares?id=eq.${id}&select=question,answer&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    )
    if (!res.ok) return null
    const rows = (await res.json()) as ShareRow[]
    return rows[0] ?? null
  } catch {
    return null
  }
}

export default async function Image({ params }: { params: { id: string } }) {
  const share = await getShare(params.id)
  const question = (share?.question ?? 'Ask Ada anything').slice(0, 120)
  const answer = (share?.answer ?? 'Plain-English answers from the free AI Academy.').slice(0, 220)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1B2A4A',
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: '#C9A84C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            🤖
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#C9A84C', fontSize: 28, fontWeight: 700 }}>Ada · ET AI Academy</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }}>Bringing AI Down to Earth</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: '#FFFFFF', fontSize: 48, fontWeight: 800, lineHeight: 1.2 }}>
            {question}
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 28,
              lineHeight: 1.4,
              padding: 28,
              backgroundColor: 'rgba(201,168,76,0.12)',
              borderLeft: '6px solid #C9A84C',
              borderRadius: 12,
            }}
          >
            {answer}
          </div>
        </div>

        <div style={{ display: 'flex', color: 'rgba(255,255,255,0.45)', fontSize: 22 }}>
          Explained like you&apos;re five · etai-academy.vercel.app
        </div>
      </div>
    ),
    size
  )
}
