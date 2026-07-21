'use client'

/**
 * Ada's face — a lightweight CSS/SVG mascot with the same state machine a Rive
 * asset will use later (idle / thinking / talking). Swap-in point for the .riv
 * file when the designed mascot is ready; keep the AdaState contract.
 */

export type AdaState = 'idle' | 'thinking' | 'talking'

export default function AdaMascot({ state, size = 56 }: { state: AdaState; size?: number }) {
  return (
    <div
      className={
        state === 'thinking'
          ? 'animate-bounce'
          : state === 'talking'
            ? 'animate-pulse'
            : ''
      }
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" width={size} height={size}>
        {/* head */}
        <rect x="8" y="12" width="48" height="40" rx="12" fill="#1B2A4A" />
        {/* antenna */}
        <line x1="32" y1="12" x2="32" y2="5" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="4" r="3" fill="#C9A84C">
          {state !== 'idle' && (
            <animate attributeName="opacity" values="1;0.3;1" dur="0.9s" repeatCount="indefinite" />
          )}
        </circle>
        {/* eyes */}
        <g fill="#C9A84C">
          <circle cx="23" cy="30" r="4.5">
            <animate
              attributeName="ry"
              values="4.5;0.5;4.5"
              dur="4s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
          <circle cx="41" cy="30" r="4.5">
            <animate
              attributeName="ry"
              values="4.5;0.5;4.5"
              dur="4s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </g>
        {/* mouth */}
        {state === 'talking' ? (
          <ellipse cx="32" cy="42" rx="7" ry="4" fill="#C9A84C">
            <animate attributeName="ry" values="4;1.5;4" dur="0.45s" repeatCount="indefinite" />
          </ellipse>
        ) : state === 'thinking' ? (
          <circle cx="32" cy="42" r="3" fill="#C9A84C" />
        ) : (
          <path d="M24 41 Q32 47 40 41" stroke="#C9A84C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {/* cheeks */}
        <circle cx="16" cy="38" r="2.5" fill="#C9A84C" opacity="0.35" />
        <circle cx="48" cy="38" r="2.5" fill="#C9A84C" opacity="0.35" />
      </svg>
    </div>
  )
}
