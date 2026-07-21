'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useChat } from '@ai-sdk/react'
import AdaMascot, { type AdaState } from './AdaMascot'
import type { ReadingLevel } from '@/lib/tutor/prompt'

const STARTERS = [
  'What is AI, in plain words?',
  'How do I write a good prompt?',
  'Why does AI sometimes make things up?',
]

const CURIOSITY_CHIPS = ['Give me an example', 'Explain it simpler', 'Quiz me on this']

const LEVEL_LABELS: Array<{ value: ReadingLevel; label: string }> = [
  { value: 'eli5', label: 'ELI-5' },
  { value: 'eli15', label: 'ELI-15' },
  { value: 'expert', label: 'Expert' },
]

/** Render Ada's plain-prose text, turning internal lesson paths into links. */
function AdaText({ text }: { text: string }) {
  const parts = text.split(/(\/(?:guides|explore)\/[a-z0-9-]+)/g)
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, i) =>
        /^\/(?:guides|explore)\/[a-z0-9-]+$/.test(part) ? (
          <Link key={i} href={part} className="font-semibold text-[#C9A84C] underline hover:text-[#b3953f]">
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

export default function TutorChat({ tutorEnabled }: { tutorEnabled: boolean }) {
  const [level, setLevel] = useState<ReadingLevel>('eli5')
  const { messages, input, handleInputChange, handleSubmit, append, isLoading, error } = useChat({
    api: '/api/tutor',
  })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const ask = (content: string) => append({ role: 'user', content }, { body: { level } })

  const last = messages[messages.length - 1]
  const adaState: AdaState = isLoading ? (last?.role === 'assistant' && last.content ? 'talking' : 'thinking') : 'idle'
  const showChips = tutorEnabled && !isLoading && last?.role === 'assistant' && !!last.content

  return (
    <div className="flex h-full flex-col">
      {/* Ada header */}
      <div className="flex items-center gap-3 border-b border-[#1B2A4A]/8 bg-white px-5 py-4 rounded-t-2xl">
        <AdaMascot state={adaState} size={44} />
        <div className="flex-1">
          <p className="text-sm font-black text-[#1B2A4A]">Ada</p>
          <p className="text-xs text-[#1B2A4A]/50">
            {adaState === 'thinking'
              ? 'Thinking…'
              : adaState === 'talking'
                ? 'Explaining…'
                : 'Your ELI-5 tutor — ask me anything you want to understand'}
          </p>
        </div>
        {/* Reading-level toggle */}
        <div className="flex rounded-full border border-[#1B2A4A]/10 bg-[#FBF8F1] p-0.5" role="group" aria-label="Reading level">
          {LEVEL_LABELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLevel(value)}
              className={
                level === value
                  ? 'rounded-full bg-[#1B2A4A] px-3 py-1 text-[11px] font-bold text-white'
                  : 'rounded-full px-3 py-1 text-[11px] font-semibold text-[#1B2A4A]/50 hover:text-[#1B2A4A]'
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-[#FBF8F1] px-4 py-6">
        {messages.length === 0 && (
          <div className="mx-auto max-w-md text-center">
            <p className="text-sm text-[#1B2A4A]/60">
              Hi! I&apos;m Ada. I explain things at whatever level you pick up top — no jargon, no judgment.
            </p>
            {tutorEnabled && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-[#C9A84C]/40 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1B2A4A] transition-colors hover:bg-[#C9A84C]/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[85%] rounded-2xl rounded-br-md bg-[#1B2A4A] px-4 py-3 text-sm text-white'
                  : 'max-w-[85%] rounded-2xl rounded-bl-md border border-[#1B2A4A]/8 bg-white px-4 py-3 text-sm text-[#1B2A4A] shadow-sm'
              }
            >
              <AdaText text={m.content} />
            </div>
          </div>
        ))}

        {/* Curiosity chips — keep the loop going */}
        {showChips && (
          <div className="flex flex-wrap gap-2 pl-1">
            {CURIOSITY_CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => ask(c)}
                className="rounded-full border border-[#C9A84C]/40 bg-white px-3 py-1 text-[11px] font-semibold text-[#1B2A4A]/70 transition-colors hover:bg-[#C9A84C]/10 hover:text-[#1B2A4A]"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {isLoading && (!last || last.role !== 'assistant' || !last.content) && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-[#1B2A4A]/8 bg-white px-4 py-3 shadow-sm">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9A84C]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9A84C]" style={{ animationDelay: '120ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9A84C]" style={{ animationDelay: '240ms' }} />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-xl border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-3 text-center text-xs text-[#1B2A4A]/70">
            {error.message || 'Something went sideways. Give it another try in a moment.'}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      {tutorEnabled ? (
        <form
          onSubmit={(e) => handleSubmit(e, { body: { level } })}
          className="flex items-center gap-2 border-t border-[#1B2A4A]/8 bg-white px-4 py-3 rounded-b-2xl"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask Ada anything…"
            maxLength={2000}
            className="flex-1 rounded-xl border border-[#1B2A4A]/15 bg-[#FBF8F1] px-4 py-2.5 text-sm text-[#1B2A4A] outline-none transition-colors focus:border-[#C9A84C]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-bold text-[#1B2A4A] transition-colors hover:bg-[#d4b55a] disabled:opacity-40"
          >
            Send
          </button>
        </form>
      ) : (
        <div className="border-t border-[#1B2A4A]/8 bg-white px-4 py-4 text-center rounded-b-2xl">
          <p className="text-sm font-semibold text-[#1B2A4A]">Ada is almost ready 🛠️</p>
          <p className="mt-1 text-xs text-[#1B2A4A]/50">
            The tutor is being safety-tested and will switch on soon. Meanwhile, the{' '}
            <Link href="/guides" className="font-semibold text-[#C9A84C] hover:underline">
              ELI5 Guides
            </Link>{' '}
            are all yours.
          </p>
        </div>
      )}
    </div>
  )
}
