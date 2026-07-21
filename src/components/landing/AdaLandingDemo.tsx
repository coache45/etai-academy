'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdaMascot, { type AdaState } from '@/components/tutor/AdaMascot'

/**
 * Landing-page magnet: ask Ada ONE question, no login. Server enforces
 * per-IP + global daily caps and the TUTOR_ENABLED kill-switch.
 */
export default function AdaLandingDemo() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [asked, setAsked] = useState(false)

  const adaState: AdaState = loading ? 'thinking' : answer ? 'talking' : 'idle'

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || loading || asked) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'Something went sideways — try again in a moment.')
      } else {
        setAnswer(data.answer)
        setAsked(true)
      }
    } catch {
      setError('Something went sideways — try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-6 pb-20 max-w-3xl mx-auto">
      <div className="rounded-3xl border border-[#C9A84C]/30 bg-white shadow-md overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[#1B2A4A]/5 bg-[#C9A84C]/5 px-6 py-4">
          <AdaMascot state={adaState} size={44} />
          <div>
            <p className="text-sm font-black text-[#1B2A4A]">Try Ada — the ELI-5 AI tutor</p>
            <p className="text-xs text-[#1B2A4A]/50">One free question, no account. Ask anything about AI.</p>
          </div>
        </div>

        <div className="px-6 py-5">
          {answer && (
            <div className="mb-4 rounded-2xl rounded-bl-md border border-[#1B2A4A]/8 bg-[#FBF8F1] px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1B2A4A]">{answer}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-3 text-center text-xs text-[#1B2A4A]/70">
              {error}
            </div>
          )}

          {asked ? (
            <div className="text-center">
              <p className="text-sm font-bold text-[#1B2A4A]">Want to keep going?</p>
              <p className="mt-1 text-xs text-[#1B2A4A]/50">
                Free members get {`Ada's`} full chat — reading levels, quizzes, streaks, and 130+ guides.
              </p>
              <Link
                href="/signup"
                className="mt-3 inline-block rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a]"
              >
                Keep asking Ada — free
              </Link>
            </div>
          ) : (
            <form onSubmit={ask} className="flex items-center gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder='Try "Why does AI make things up sometimes?"'
                maxLength={300}
                className="flex-1 rounded-xl border border-[#1B2A4A]/15 bg-[#FBF8F1] px-4 py-3 text-sm text-[#1B2A4A] outline-none transition-colors focus:border-[#C9A84C]"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="rounded-xl bg-[#1B2A4A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1B2A4A]/90 disabled:opacity-40"
              >
                {loading ? 'Thinking…' : 'Ask Ada'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
