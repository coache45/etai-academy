import Link from 'next/link'

export const metadata = {
  title: 'Trust & Privacy — ET AI Academy',
  description: 'How the ET AI Academy handles your data, security, and what beta means.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-[#1B2A4A]">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-[#1B2A4A]/70">{children}</div>
    </section>
  )
}

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#FBF8F1]">
      <header className="border-b border-[#1B2A4A]/5 bg-[#FBF8F1]">
        <div className="mx-auto max-w-3xl px-4 py-4">
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

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🛡️</span>
          <div>
            <h1 className="text-3xl font-black text-[#1B2A4A]">Trust &amp; Privacy</h1>
            <p className="text-sm text-[#1B2A4A]/50">Plain English, like everything else here.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 p-5">
          <span className="rounded-full bg-[#C9A84C]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#C9A84C]">
            Beta
          </span>
          <p className="mt-2 text-sm text-[#1B2A4A]/70">
            The Academy is in beta and <strong>free to use</strong>. Things will keep improving — thank you for
            being early.
          </p>
        </div>

        <Section title="What we store">
          When you create an account we keep your email, a display name you choose, and your learning
          progress — which lessons you have completed and the badges you have earned. That is it.
        </Section>

        <Section title="How it is protected">
          The site runs over HTTPS. Your progress and badges are guarded by database row-level security, which
          means <strong>only you can read your own</strong> — no other account can see it. Password sign-ins are
          checked against known-leaked passwords, and you can also sign in with Google.
        </Section>

        <Section title="What we do not do">
          We do not sell your data, and we do not show ads. Your learning is yours.
        </Section>

        <Section title="Questions">
          Reach us at{' '}
          <a href="mailto:academy@etaiworld.ai" className="font-semibold text-[#C9A84C] hover:underline">
            academy@etaiworld.ai
          </a>
          .
        </Section>

        <div className="mt-10">
          <Link
            href="/explore"
            className="inline-block rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
          >
            Back to the Academy
          </Link>
        </div>
      </main>

      <footer className="mt-10 border-t border-[#1B2A4A]/5 py-6 text-center">
        <p className="text-xs text-[#1B2A4A]/30">ET AI Academy &middot; Bringing AI Down to Earth</p>
      </footer>
    </div>
  )
}
