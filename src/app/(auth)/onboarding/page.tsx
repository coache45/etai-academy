'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ArrowRight, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { CATEGORY_CONFIG } from '@/types/guides'
import type { GuideCategory } from '@/types/guides'

const CATEGORIES = Object.entries(CATEGORY_CONFIG) as [GuideCategory, { label: string; emoji: string }][]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [displayName, setDisplayName] = useState('')
  const [interests, setInterests] = useState<GuideCategory[]>([])
  const [saving, setSaving] = useState(false)

  function toggleInterest(id: GuideCategory) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  async function finish() {
    setSaving(true)
    const destination =
      interests.length > 0 ? `/guides?tab=guides&category=${interests[0]}` : '/guides'
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(destination)
      return
    }

    try {
      await supabase
        .from('profiles')
        .update({
          display_name: displayName || null,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      toast.success("You're all set. Let's start learning!")
      router.push(destination)
    } catch {
      toast.error('Could not save your profile. You can update it later.')
      router.push(destination)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1B2A4A] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#1B2A4A]" />
          </div>
          <span className="font-bold text-xl text-white">ET AI Academy</span>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-[#C9A84C]' : s < step ? 'w-2 bg-[#C9A84C]/50' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white">
                  Welcome to ET AI Academy
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Free lessons in plain English. Let&apos;s point you in the right direction.
                </p>
              </div>

              <div>
                <Label htmlFor="display-name">What should we call you?</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nickname or first name"
                  className="mt-1"
                />
              </div>

              <Button
                variant="gold"
                className="w-full gap-2"
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white">
                  What do you want to learn about?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Pick anything that sparks your curiosity. You can explore everything later.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {CATEGORIES.map(([id, config]) => (
                  <button
                    key={id}
                    onClick={() => toggleInterest(id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                      interests.includes(id)
                        ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                        : 'border-gray-100 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{config.emoji}</span>
                    <span
                      className={`text-sm font-medium ${
                        interests.includes(id)
                          ? 'text-[#1B2A4A] dark:text-white'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {config.label}
                    </span>
                    {interests.includes(id) && (
                      <Check className="w-4 h-4 text-[#C9A84C] ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={finish}
                  disabled={saving}
                >
                  {saving ? 'Setting up...' : 'Start Learning'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
