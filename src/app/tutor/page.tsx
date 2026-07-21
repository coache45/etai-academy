import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TutorChat from '@/components/tutor/TutorChat'
import { getEntitlements } from '@/lib/entitlements'

// Per-user page — always render at request time with the signed-in user's session.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Ada — your ELI-5 AI tutor · ET AI Academy',
  description: 'Ask Ada anything you want to understand, answered in plain English from the Academy’s own lessons.',
}

export default async function TutorPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tutorEnabled = process.env.TUTOR_ENABLED === 'true'

  const { data: streakRow } = await supabase
    .from('user_streaks')
    .select('current_streak')
    .eq('user_id', user.id)
    .maybeSingle()
  const streak = streakRow?.current_streak ?? 0

  // Premium 3D theme (entitlement-gated; RLS own-row read).
  const { data: profRow } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status, entitlements, is_founder')
    .eq('id', user.id)
    .maybeSingle()
  const premium = getEntitlements(profRow ?? null).premiumTheme

  return (
    <div className={`flex min-h-screen flex-col bg-[#FBF8F1]${premium ? ' theme-aurora' : ''}`}>
      <header className="border-b border-[#1B2A4A]/5 bg-[#FBF8F1]">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C9A84C]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 6V14H2V6L8 2Z" fill="#1B2A4A" />
                </svg>
              </div>
              <span className="text-sm font-bold text-[#1B2A4A]">ET AI Academy</span>
            </Link>
            <div className="flex items-center gap-2">
              {premium && (
                <span className="rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-1.5 text-xs font-bold text-[#C9A84C]">
                  ✨ Aurora
                </span>
              )}
              {streak > 0 && (
                <span className="rounded-full bg-[#C9A84C]/15 px-3 py-1.5 text-xs font-bold text-[#C9A84C]">
                  🔥 {streak}
                </span>
              )}
              <Link
                href="/me"
                className="rounded-lg border border-[#1B2A4A]/15 px-4 py-2 text-xs font-semibold text-[#1B2A4A] transition-colors hover:bg-[#1B2A4A]/5"
              >
                My Progress
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

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#1B2A4A]/8 shadow-sm" style={{ minHeight: '70vh' }}>
          <TutorChat tutorEnabled={tutorEnabled} />
        </div>
        <p className="mt-3 text-center text-[11px] text-[#1B2A4A]/35">
          Ada teaches — she doesn&apos;t give personal medical or financial advice. Conversations are saved to your
          account only. See{' '}
          <Link href="/trust" className="underline hover:text-[#1B2A4A]/60">
            Trust &amp; Privacy
          </Link>
          .
        </p>
      </main>
    </div>
  )
}
