import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

// Public certificate page (cert_shares is public-read by link).
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getCert(id: string) {
  if (!UUID_RE.test(id)) return null
  const supabase = createClient()
  const { data } = await supabase
    .from('cert_shares')
    .select('id, label, emoji, learner_name, awarded_at')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cert = await getCert(params.id)
  if (!cert) return { title: 'Certificate · ET AI Academy' }
  return {
    title: `${cert.learner_name} — ${cert.label} · ET AI Academy`,
    description: `Certificate of Achievement: ${cert.label}, earned at ET AI Academy — Bringing AI Down to Earth.`,
    openGraph: {
      title: `${cert.learner_name} earned ${cert.label}`,
      description: 'Certificate of Achievement · ET AI Academy — Bringing AI Down to Earth.',
      type: 'article',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const cert = await getCert(params.id)
  if (!cert) notFound()

  const date = new Date(cert.awarded_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-space-hero">
      <main className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12">
        {/* The certificate */}
        <div className="w-full rounded-3xl bg-gradient-to-br from-[#F49E08] via-[#C9A84C] to-[#0A72D2] p-[3px] shadow-2xl shadow-[#00B3ED]/20">
          <div className="rounded-3xl bg-[#061233] px-8 py-12 text-center sm:px-14">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7FD6FF]">
              ET AI Academy
            </p>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Certificate of <span className="text-gold-gradient">Achievement</span>
            </h1>

            <div className="mt-8 text-7xl">{cert.emoji}</div>
            <p className="mt-4 text-sm uppercase tracking-widest text-white/40">awarded to</p>
            <p className="mt-2 text-3xl font-black text-gold-gradient sm:text-4xl">
              {cert.learner_name}
            </p>
            <p className="mt-4 text-lg font-semibold text-white/80">
              for reaching <span className="text-ai-gradient font-black">{cert.label}</span> on the
              Academy Ladder
            </p>
            <p className="mt-6 text-sm text-white/40">{date}</p>

            <div className="mx-auto mt-8 h-px w-2/3 bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
            <p className="mt-4 text-xs italic text-white/40">
              Bringing AI Down to Earth &mdash; one lesson at a time
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/50">Earn yours — free, in plain English.</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#061233] transition-colors hover:bg-[#d4b55a]"
            >
              Start learning free
            </Link>
            <Link
              href="/guides"
              className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse the library
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
