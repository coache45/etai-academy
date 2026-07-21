/**
 * Curated learning paths — ordered journeys through real guides + content items.
 * Slugs verified against the live DB (2026-07-21). Progress overlay matches
 * the `progress` table exactly: (item_type, item_slug).
 * Free users see and walk every curated path; the PERSONALIZED path builder
 * (Ada) is gated by entitlements.learningPaths (Pro perk).
 */

export type PathStep = {
  type: 'guide' | 'content'
  slug: string
  title: string
}

export type LearningPath = {
  id: string
  title: string
  emoji: string
  blurb: string
  steps: PathStep[]
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'ai-foundations',
    title: 'AI Foundations',
    emoji: '🚀',
    blurb: 'Zero to "oh, NOW I get it" — the five lessons everyone should start with.',
    steps: [
      { type: 'guide', slug: 'how-ai-actually-thinks-spoiler-it-doesnt', title: "How AI Actually Thinks (Spoiler: It Doesn't)" },
      { type: 'guide', slug: 'llms-explained-the-worlds-fanciest-autocomplete', title: "LLMs Explained: The World's Fanciest Autocomplete" },
      { type: 'guide', slug: 'what-is-a-prompt-and-why-does-wording-matter', title: 'What Is a Prompt and Why Does Wording Matter?' },
      { type: 'guide', slug: 'why-ai-hallucinates-and-how-to-catch-it', title: 'Why AI Hallucinates (And How to Catch It)' },
      { type: 'content', slug: 'spot-ai-in-your-day', title: 'Spot the AI in Your Day' },
    ],
  },
  {
    id: 'prompt-master',
    title: 'Prompt Master',
    emoji: '🎯',
    blurb: 'Talk to AI like a pro: clearer asks, better answers, your own voice.',
    steps: [
      { type: 'guide', slug: 'how-to-talk-to-ai-like-a-pro-prompt-engineering-101', title: 'How to Talk to AI Like a Pro (Prompt Engineering 101)' },
      { type: 'content', slug: 'write-better-ai-prompts', title: 'Write Better AI Prompts' },
      { type: 'content', slug: 'teach-ai-your-style', title: 'Teach AI Your Style' },
      { type: 'content', slug: 'summarize-anything-fast', title: 'Summarize Anything in 60 Seconds' },
      { type: 'content', slug: 'when-ai-says-i-dont-know', title: 'When AI Says "I Don\'t Know"' },
    ],
  },
  {
    id: 'ai-powered-life',
    title: 'The AI-Powered Life',
    emoji: '🏡',
    blurb: 'Inbox, dinners, bedtime stories, gifts — everyday wins in under an hour.',
    steps: [
      { type: 'content', slug: 'first-ai-assistant-10-minutes', title: 'Your First AI Assistant in 10 Minutes' },
      { type: 'content', slug: 'tame-your-inbox-with-ai', title: 'Tame Your Inbox With AI' },
      { type: 'content', slug: 'ai-groceries-and-meals', title: 'Groceries and Meals on Autopilot' },
      { type: 'content', slug: 'family-story-time-ai', title: 'Family Story Time, Supercharged' },
      { type: 'content', slug: 'ai-gift-genius', title: 'The Gift Genius' },
    ],
  },
  {
    id: 'ai-for-business',
    title: 'AI for Your Business',
    emoji: '💼',
    blurb: 'From idea to landing page — the lean path for builders and side-hustlers.',
    steps: [
      { type: 'guide', slug: 'ai-for-small-business-your-first-steps-made-simple', title: 'AI for Small Business: Your First Steps Made Simple' },
      { type: 'guide', slug: 'test-your-big-idea-before-building-it', title: 'Test Your Big Idea Before Building It' },
      { type: 'guide', slug: 'mvp-build-less-learn-more', title: 'MVP: Build Less, Learn More' },
      { type: 'guide', slug: 'landing-pages-that-actually-work-your-step-by-step-guide', title: 'Landing Pages That Actually Work' },
      { type: 'guide', slug: 'email-marketing-your-money-making-friend', title: 'Email Marketing: Your Money-Making Friend' },
    ],
  },
  {
    id: 'understand-the-machine',
    title: 'Understand the Machine',
    emoji: '🧠',
    blurb: 'Go one level deeper: embeddings, RAG, fine-tuning, and why safety matters.',
    steps: [
      { type: 'guide', slug: 'ai-vs-machine-learning-vs-deep-learning-whats-the-difference', title: 'AI vs Machine Learning vs Deep Learning' },
      { type: 'guide', slug: 'how-ai-reads-between-the-lines-understanding-embeddings', title: 'How AI Reads Between the Lines: Embeddings' },
      { type: 'guide', slug: 'teaching-ai-your-own-data-rag-made-simple', title: 'Teaching AI Your Own Data: RAG Made Simple' },
      { type: 'guide', slug: 'fine-tuning-ai-teaching-your-robot-friend-new-tricks', title: 'Fine-Tuning AI: New Tricks for Your Robot Friend' },
      { type: 'guide', slug: 'ai-safety-why-your-digital-assistant-needs-boundaries', title: 'AI Safety: Why Assistants Need Boundaries' },
    ],
  },
]

export function stepHref(step: PathStep): string {
  return step.type === 'guide' ? `/guides/${step.slug}` : `/explore/${step.slug}`
}
