import Link from 'next/link'
import {
  Zap,
  BookOpen,
  Mic,
  GraduationCap,
  Heart,
  Globe,
  Cpu,
  Shield,
  ArrowRight,
  ExternalLink,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import AdaLandingDemo from '@/components/landing/AdaLandingDemo'
import Reveal from '@/components/fx/Reveal'
import ImmersiveHero from '@/components/fx/ImmersiveHero'

const platformSections = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'ELI5 Guides',
    description:
      'AI, health, money, and tech — explained so simply a five-year-old could follow along. No jargon. No gatekeeping.',
    href: '/guides',
    cta: 'Browse Guides',
    count: '130+',
    countLabel: 'lessons live',
    live: true,
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: 'The O-Spot',
    description:
      'Real talk about AI, health, business, and building a life on your own terms. Hosted by Ernest and Tanja Owens.',
    href: '/guides?tab=podcast',
    cta: 'Listen Now',
    count: null,
    countLabel: null,
    live: false,
    comingSoon: true,
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Mini-Courses',
    description:
      'Structured learning paths you can finish in a weekend. Go from curious to confident — no degree required.',
    href: '/guides?tab=courses',
    cta: 'Explore Courses',
    count: null,
    countLabel: null,
    live: false,
    comingSoon: true,
  },
]

const ecosystemApps = [
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'ONE Health',
    description:
      'AI coaching, sleep tracking, stress mastery, and the first couples health dashboard. Your body, your data, your coach.',
    href: 'https://etai-one-health.vercel.app',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    external: true,
    status: 'Live',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Language Academy',
    description:
      'Learn English, Italian, and Spanish with AI-powered lessons built on real teaching frameworks. More languages coming.',
    href: 'https://et-ai-language-academy.vercel.app',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    external: true,
    status: 'Live',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'AETHELFORGE',
    description:
      'Parametric CAD engine for designing real hardware. Two patents filed. The tool that builds what ET AI dreams.',
    href: 'https://aethelforge.vercel.app',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    external: true,
    status: 'Live',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Guardian',
    description:
      'Health monitoring and alert system. CPR scores, trend tracking, and real-time alerts when something needs attention.',
    href: 'https://et-ai-guardian.vercel.app',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    external: true,
    status: 'Coming Soon',
  },
]

export default function PlatformHub() {
  return (
    <div className="min-h-screen bg-[#FBF8F1] dark:bg-gray-950">
      {/* Deep-space brand canvas: nav + hero (palette from the ET AI commercial) */}
      <div className="bg-space-hero">
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#F49E08] to-[#C9A84C] rounded-lg flex items-center justify-center shadow-[0_0_18px_rgba(244,158,8,0.35)]">
            <Zap className="w-5 h-5 text-[#061233]" />
          </div>
          <span className="text-lg font-black tracking-tight">
            <span className="text-gold-gradient">ET</span>{' '}
            <span className="text-ai-gradient">AI</span>{' '}
            <span className="text-white/90 font-bold">Academy</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="hidden md:flex items-center gap-1.5">
            <Link href="/guides" className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              Guides
            </Link>
            <Link href="/explore" className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              Explore
            </Link>
            <Link href="/paths" className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              Paths
            </Link>
            <Link href="/tutor" className="rounded-lg px-3.5 py-2 text-sm font-semibold text-[#7FD6FF] transition-colors hover:bg-[#00B3ED]/15 hover:text-white">
              🤖 Ask Ada
            </Link>
            <Link href="/podcast" className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              O-Spot
            </Link>
          </div>
          <Link href="/login" className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            Sign In
          </Link>
          <Link href="/signup">
            <Button variant="gold">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero — Bringing AI Down to Earth */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-10 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00B3ED]/30 bg-[#00B3ED]/10 px-4 py-1.5 text-sm font-medium text-[#7FD6FF]">
              <Zap className="w-4 h-4 text-[#F49E08]" />
              Bringing AI Down to Earth
            </div>
            <h1 className="mb-6 text-5xl font-black leading-tight text-white md:text-6xl">
              Learn anything.
              <br />
              <span className="text-gold-gradient glow-gold">Understand</span>{' '}
              <span className="text-ai-gradient glow-electric">everything.</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-xl leading-relaxed text-white/60 lg:mx-0">
              ET AI Academy is where AI stops being scary and starts being useful. Free guides, a
              personal AI tutor, and a community that speaks plain English — not tech jargon.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link href="/guides">
                <Button variant="gold" size="lg" className="gap-2">
                  Start Learning Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" className="border border-white/25 bg-white/5 text-white hover:bg-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/30">
              No credit card. No degree required. Just curiosity.
            </p>
            {/* Holographic badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="holo-badge"><span>🎓 130+ free ELI-5 lessons</span></span>
              <span className="holo-badge"><span>🤖 Ada — your personal AI tutor</span></span>
              <span className="holo-badge"><span>🌍 Plain English, always</span></span>
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <div className="h-[440px] w-full">
              <ImmersiveHero />
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Ada live demo */}
      <Reveal>
        <AdaLandingDemo />
      </Reveal>

      {/* Platform Content Sections */}
      <section className="px-6 py-16 bg-white/60 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1B2A4A] dark:text-white mb-3">
              The Academy
            </h2>
            <p className="text-[#1B2A4A]/50 dark:text-gray-400">
              Three ways to learn. All free to start. All explained like you&apos;re five.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {platformSections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="hover-pop3d group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg border border-[#1B2A4A]/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#1B2A4A]/10 dark:bg-[#C9A84C]/10 rounded-xl flex items-center justify-center text-[#1B2A4A] dark:text-[#C9A84C]">
                    {section.icon}
                  </div>
                  {section.live && section.count && (
                    <span className="text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full">
                      {section.count} {section.countLabel}
                    </span>
                  )}
                  {section.comingSoon && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B2A4A]/40 bg-[#1B2A4A]/5 px-2.5 py-1 rounded-full">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A84C] opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                      </span>
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2 text-lg">
                  {section.title}
                </h3>
                <p className="text-sm text-[#1B2A4A]/50 dark:text-gray-400 leading-relaxed mb-4">
                  {section.description}
                </p>
                <span className="text-sm font-semibold text-[#C9A84C] group-hover:underline flex items-center gap-1">
                  {section.cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Apps */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1B2A4A] dark:text-white mb-3">
              The Ecosystem
            </h2>
            <p className="text-[#1B2A4A]/50 dark:text-gray-400 max-w-xl mx-auto">
              One brand. Multiple tools. Each app does one thing really well — and they all talk to each other.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {ecosystemApps.map((app) => (
              <a
                key={app.title}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-pop3d group flex gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-lg border border-[#1B2A4A]/5 hover:border-[#C9A84C]/20"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${app.color}`}
                >
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white">
                      {app.title}
                    </h3>
                    <ExternalLink className="w-3 h-3 text-[#1B2A4A]/20 group-hover:text-[#C9A84C] transition-colors" />
                    <span
                      className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Live'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-[#C9A84C]/10 text-[#C9A84C]'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#1B2A4A]/50 dark:text-gray-400 leading-relaxed">
                    {app.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="px-6 py-16 bg-[#1B2A4A] dark:bg-[#0D1B2A]">
        <div className="max-w-3xl mx-auto text-center">
          <Users className="w-10 h-10 text-[#C9A84C] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Earth Station
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
            The community where AI meets real life. Ask questions, share wins, and connect with
            people who are building the future — not just reading about it.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://www.skool.com/earth-station"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="gold" size="lg" className="gap-2">
                Join Earth Station <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <a
              href="https://etaiworld.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Visit etaiworld.ai
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* The O-Spot Thread */}
      <section className="px-6 py-12 bg-[#C9A84C]/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-[#C9A84C] mb-2">The Thread That Connects It All</p>
          <h3 className="text-2xl font-bold text-[#1B2A4A] dark:text-white mb-6">
            The O-Spot
          </h3>
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-[#1B2A4A]/50">
            <a
              href="https://etaiworld.ai/podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              <Mic className="w-4 h-4" /> Podcast
            </a>
            <span className="text-[#1B2A4A]/10">|</span>
            <Link
              href="/guides?tab=podcast"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Academy
            </Link>
            <span className="text-[#1B2A4A]/10">|</span>
            <a
              href="https://instagram.com/the.o.spot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              Instagram
            </a>
            <span className="text-[#1B2A4A]/10">|</span>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              Spotify
            </a>
            <span className="text-[#1B2A4A]/10">|</span>
            <a
              href="https://youtube.com/@TheOSpotPodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#1B2A4A]/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#C9A84C] rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#1B2A4A]" />
            </div>
            <span className="font-bold text-[#1B2A4A] dark:text-white text-sm">ET AI Academy</span>
          </div>
          <p className="text-xs text-[#1B2A4A]/30">
            &copy; {new Date().getFullYear()} ET AI, LLC. Charlotte, North Carolina.
            Bringing AI Down to Earth.
          </p>
        </div>
      </footer>
    </div>
  )
}
