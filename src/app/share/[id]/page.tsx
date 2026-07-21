import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

// Public share page for an Ada answer (shares table is public-read by link).
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getShare(id: string) {
  if (!UUID_RE.test(id)) return null
  const supabase = createClient()
  const { data } = await supabase
    .from('shares')
    .select('id, question, answer, created_at')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const share = await getShare(params.id)
  if (!share) return { title: 'Ada — ET AI Academy' }
  const q = share.question.slice(0, 90)
  return {
    title: `Ada answers: ${q} · ET AI Academy`,
    description: share.answer.slice(0, 160),
    openGraph: {
      title: `Ada answers: ${q}`,
      description: share.answer.slice(0, 200),
      type: 'article',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function SharePage({ params }: { params: { id: string } }) {
  const share = await getShare(params.id)
  if (!share) notFound()

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <header className="border-b border-[#1B2A4A]/5 bg-[#FBF8F1]">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C9A84C]">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 6V14H2V6L8 2Z" fill="#1B2A4A" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#1B2A4A]">ET AI Academy</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-wide text-[#C9A84C]">
          🤖 Ada · the ELI-5 AI tutor
        </p>

        <div className="mt-4 rounded-2xl rounded-br-md bg-[#1B2A4A] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Someone asked</p>
          <p className="mt-1 text-lg font-bold text-white">{share.question}</p>
        </div>

        <div className="mt-4 rounded-2xl rounded-bl-md border border-[#1B2A4A]/8 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#C9A84C]">Ada explained</p>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-[#1B2A4A]">
            {share.answer}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 p-6 text-center">
          <p className="text-lg font-black text-[#1B2A4A]">Got your own question?</p>
          <p className="mt-1 text-sm text-[#1B2A4A]/50">
            Ada explains AI, tech, and more — at ELI-5, ELI-15, or expert level. Free.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
            >
              Ask Ada free
            </Link>
            <Link
              href="/guides"
              className="rounded-xl border border-[#1B2A4A]/15 px-6 py-3 text-sm font-semibold text-[#1B2A4A] transition-colors hover:bg-[#1B2A4A]/5"
            >
              Browse ELI5 Guides
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-10 border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">ET AI Academy &middot; Bringing AI Down to Earth</p>
      </footer>
    </div>
  )
}
