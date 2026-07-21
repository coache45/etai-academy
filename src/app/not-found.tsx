import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#C9A84C] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-[#1B2A4A]" />
        </div>
        <h1 className="text-6xl font-bold text-[#1B2A4A] dark:text-white mb-2">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
          This page does not exist.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          But your learning is right where you left it.
        </p>
        <Link href="/">
          <Button variant="gold" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
