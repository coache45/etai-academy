import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/entitlements'
import { LEARNING_PATHS, stepHref } from '@/lib/paths'

// Public page; progress overlay + Pro gate appear for signed-in users.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Learning Paths · ET AI Academy',
  description: 'Curated journeys through the Academy — from AI Foundations to building your business, one plain-English lesson at a time.',
}

export default async function PathsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let completed = new Set<string>()
  let personalized = false
  if (user) {
    const { data: rows } = await supabase
      .from('progress')
      .select('item_type, item_slug, status')
      .eq('user_id', user.id)
    completed = new Set(
      (rows ?? []).filter((r) => r.status === 'completed').map((r) => `${r.item_type}:${r.item_slug}`)
    )
    const { data: prof } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, entitlements, is_founder')
      .eq('id', user.id)
      .maybeSingle()
    personalized = getEntitlements(prof ?? null).learningPaths
  }

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <header className="border-b border-[#1B2A4A]/5 bg-[#FBF8F1]">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#F49E08] to-[#C9A84C]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 6V14H2V6L8 2Z" fill="#061233" />
                </svg>
              </div>
              <span className="text-sm font-black tracking-tight">
                <span className="text-gold-gradient">ET</span>{' '}
                <span className="text-ai-gradient">AI</span>{' '}
                <span className="font-bold text-[#1B2A4A]">Academy</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/tutor"
                className="rounded-lg border border-[#00B3ED]/40 bg-[#00B3ED]/10 px-4 py-2 text-xs font-bold text-[#0A72D2] transition-colors hover:bg-[#00B3ED]/20"
              >
                🤖 Ask Ada
              </Link>
              <Link
                href="/explore"
                className="rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1B2A4A]/90"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-10 text-center">
          <span className="text-4xl">🧭</span>
          <h1 className="mt-3 text-3xl font-black text-[#1B2A4A] sm:text-4xl">
            Learning <span className="text-ai-gradient">Paths</span>
          </h1>
          <p className="mt-2 text-lg text-[#1B2A4A]/50">
            Follow a trail instead of wandering the library — five lessons, one destination
          </p>
          {!user && (
            <p className="mt-2 text-sm text-[#1B2A4A]/40">
              <Link href="/login" className="font-semibold text-[#C9A84C] hover:underline">
                Sign in
              </Link>{' '}
              to track your progress along each path.
            </p>
          )}
        </div>

        <div className="space-y-8">
          {LEARNING_PATHS.map((path) => {
            const done = path.steps.filter((s) => completed.has(`${s.type}:${s.slug}`)).length
            const nextIdx = path.steps.findIndex((s) => !completed.has(`${s.type}:${s.slug}`))
            const pct = Math.round((done / path.steps.length) * 100)
            return (
              <section key={path.id} className="rounded-2xl border border-[#1B2A4A]/8 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-3xl">{path.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-black text-[#1B2A4A]">{path.title}</h2>
                    <p className="text-sm text-[#1B2A4A]/50">{path.blurb}</p>
                  </div>
                  {user && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        pct === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-[#00B3ED]/10 text-[#0A72D2]'
                      }`}
                    >
                      {pct === 100 ? '✓ Complete' : `${done}/${path.steps.length}`}
                    </span>
                  )}
                </div>
                {user && (
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#1B2A4A]/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#00B3ED]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
                <ol className="mt-5 space-y-2">
                  {path.steps.map((step, i) => {
                    const isDone = completed.has(`${step.type}:${step.slug}`)
                    const isNext = user && i === nextIdx
                    return (
                      <li key={step.slug}>
                        <Link
                          href={stepHref(step)}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                            isNext
                              ? 'border-[#00B3ED]/50 bg-[#00B3ED]/5 hover:bg-[#00B3ED]/10'
                              : 'border-[#1B2A4A]/8 hover:bg-[#1B2A4A]/[0.03]'
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-700'
                                : isNext
                                  ? 'bg-[#00B3ED] text-white'
                                  : 'bg-[#1B2A4A]/8 text-[#1B2A4A]/50'
                            }`}
                          >
                            {isDone ? '✓' : i + 1}
                          </span>
                          <span
                            className={`flex-1 text-sm font-semibold ${
                              isDone ? 'text-[#1B2A4A]/40 line-through decoration-1' : 'text-[#1B2A4A]'
                            }`}
                          >
                            {step.title}
                          </span>
                          {isNext && (
                            <span className="text-xs font-bold text-[#0A72D2]">Next up →</span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </section>
            )
          })}
        </div>

        {/* Personalized path — Pro perk */}
        <div className="mt-10 rounded-2xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 p-6 text-center">
          <p className="text-lg font-black text-[#1B2A4A]">Want a path built just for you?</p>
          <p className="mt-1 text-sm text-[#1B2A4A]/50">
            Ada can look at what you&apos;ve finished and what you&apos;re curious about, then chart
            your next five lessons.
          </p>
          {personalized ? (
            <Link
              href="/tutor"
              className="mt-4 inline-block rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
            >
              🤖 Ask Ada to build my path
            </Link>
          ) : (
            <span className="mt-4 inline-block rounded-full border border-[#C9A84C]/40 bg-white px-5 py-2.5 text-sm font-bold text-[#C9A84C]">
              ✨ A Pro perk — unlocking with the Pro launch
            </span>
          )}
        </div>
      </main>

      <footer className="mt-10 border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">ET AI Academy &middot; Bringing AI Down to Earth</p>
      </footer>
    </div>
  )
}
