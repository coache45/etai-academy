import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchContentBySlug } from '@/lib/content/queries'
import { PILLAR_CONFIG, FORMAT_CONFIG } from '@/types/content'
import { MarkComplete } from '@/components/MarkComplete'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { slug: string }
}

type Step = { title: string }

export default async function ContentDetailPage({ params }: PageProps) {
  const item = await fetchContentBySlug(params.slug)
  if (!item || !item.is_published) notFound()

  const pillar = PILLAR_CONFIG[item.pillar]
  const fmt = FORMAT_CONFIG[item.format]
  const steps: Step[] = Array.isArray((item.body as { steps?: Step[] })?.steps)
    ? ((item.body as { steps?: Step[] }).steps as Step[])
    : []

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <header className="sticky top-0 z-10 border-b border-[#1B2A4A]/5 bg-[#FBF8F1]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            href="/explore"
            className="flex items-center gap-2 text-sm font-medium text-[#1B2A4A]/50 transition-colors hover:text-[#1B2A4A]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Explore
          </Link>
          <Link href="/me" className="text-xs font-medium text-[#C9A84C] hover:underline">
            My Progress
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 text-center">
          <span className="text-5xl">{item.emoji}</span>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="rounded-full bg-[#1B2A4A]/5 px-3 py-1 text-xs font-semibold text-[#1B2A4A]/60">
              {pillar.emoji} {pillar.label}
            </span>
            <span className="rounded-full bg-[#C9A84C]/15 px-3 py-1 text-xs font-bold text-[#C9A84C]">
              {fmt.emoji} {fmt.label}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black text-[#1B2A4A] sm:text-4xl">{item.title}</h1>
          <p className="mt-2 text-lg text-[#1B2A4A]/50">{item.summary}</p>
        </div>

        {item.url && (
          <div className="mb-8 text-center">
            <Link
              href={item.url}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B2A4A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1B2A4A]/90"
            >
              Open this {fmt.label.toLowerCase()} &rarr;
            </Link>
          </div>
        )}

        {steps.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1B2A4A]/40">Steps</p>
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-[#1B2A4A]/8 bg-white px-5 py-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/15 text-sm font-bold text-[#C9A84C]">
                  {i + 1}
                </span>
                <span className="font-medium text-[#1B2A4A]">{step.title}</span>
              </div>
            ))}
          </div>
        )}

        {steps.length === 0 && !item.url && (
          <p className="text-center text-sm text-[#1B2A4A]/40">
            More detail for this {fmt.label.toLowerCase()} is coming soon.
          </p>
        )}

        {/* Mark complete — records progress toward the Ladder */}
        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <MarkComplete itemType="content" itemSlug={item.slug} />
          <p className="text-xs text-[#1B2A4A]/30">
            Done with this? Mark it complete to climb your{' '}
            <Link href="/me" className="font-semibold text-[#C9A84C] hover:underline">
              Ladder
            </Link>
            .
          </p>
        </div>
      </main>

      <footer className="mt-10 border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">ET AI Academy &middot; Bringing AI Down to Earth</p>
      </footer>
    </div>
  )
}
