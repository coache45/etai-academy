import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Per-user page — always render at request time with the signed-in user's session.
export const dynamic = 'force-dynamic'

type Rung = { min: number; name: string; emoji: string }
const LADDER: Rung[] = [
  { min: 0, name: 'Explorer', emoji: '🔭' },
  { min: 1, name: 'Learner', emoji: '📖' },
  { min: 3, name: 'Builder', emoji: '🔨' },
  { min: 6, name: 'Pathfinder', emoji: '🧭' },
  { min: 10, name: 'Navigator', emoji: '🚀' },
]

function ladderFor(completed: number) {
  let current = LADDER[0]
  let next: Rung | null = null
  for (let i = 0; i < LADDER.length; i++) {
    if (completed >= LADDER[i].min) {
      current = LADDER[i]
      next = LADDER[i + 1] ?? null
    }
  }
  const span = next ? next.min - current.min : 0
  const into = completed - current.min
  const pct = next && span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 100
  return { current, next, pct }
}

export default async function MePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  // RLS restricts this to the signed-in user's own rows.
  const { data: progressRows } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const rows = progressRows ?? []
  const completed = rows.filter((r) => r.status === 'completed')
  const { current, next, pct } = ladderFor(completed.length)
  const name = profile?.display_name || 'learner'

  return (
    <div className="min-h-screen bg-[#FBF8F1]">
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
            <Link
              href="/explore"
              className="rounded-lg bg-[#1B2A4A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1B2A4A]/90"
            >
              Explore
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-[#1B2A4A]/50">Welcome back,</p>
        <h1 className="text-3xl font-black text-[#1B2A4A]">{name}</h1>

        {/* Ladder card */}
        <div className="mt-6 rounded-2xl border border-[#1B2A4A]/8 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{current.emoji}</span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#C9A84C]">Your rung on the Ladder</p>
              <p className="text-2xl font-black text-[#1B2A4A]">{current.name}</p>
              <p className="text-sm text-[#1B2A4A]/50">
                {completed.length} {completed.length === 1 ? 'lesson' : 'lessons'} completed
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between text-xs text-[#1B2A4A]/50">
              <span>{current.name}</span>
              <span>{next ? next.name : 'Top of the Ladder'}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1B2A4A]/10">
              <div className="h-full rounded-full bg-[#C9A84C]" style={{ width: `${pct}%` }} />
            </div>
            {next && (
              <p className="mt-2 text-xs text-[#1B2A4A]/40">
                {Math.max(0, next.min - completed.length)} more to reach {next.emoji} {next.name}
              </p>
            )}
          </div>
        </div>

        {/* Completed list */}
        <h2 className="mt-10 text-lg font-bold text-[#1B2A4A]">Completed</h2>
        {completed.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-[#1B2A4A]/10 bg-white/50 p-8 text-center">
            <p className="text-sm text-[#1B2A4A]/40">
              Nothing completed yet.{' '}
              <Link href="/explore" className="font-semibold text-[#C9A84C] hover:underline">
                Start exploring
              </Link>{' '}
              to climb the Ladder.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {completed.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-[#1B2A4A]/8 bg-white px-4 py-3"
              >
                <span className="text-sm font-medium text-[#1B2A4A]">{r.item_slug}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  {r.item_type} · done
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="mt-10 border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">ET AI Academy &middot; Bringing AI Down to Earth</p>
      </footer>
    </div>
  )
}
