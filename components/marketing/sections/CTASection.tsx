import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-900 dark:from-green-950 dark:via-green-900 dark:to-green-950" />
      
      {/* Floating orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-10 animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white dark:text-gray-900">
          Ready to transform your social media?
        </h2>
        <p className="mt-6 text-lg text-gray-300 dark:text-gray-700 max-w-2xl mx-auto">
          Join thousands of teams already using our platform to save time and grow their audience. 
          Start your free trial today.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white rounded-full px-8 py-6 text-base font-medium transition-all hover:scale-105"
            >
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-white dark:border-gray-900/20 dark:hover:bg-gray-900/10 dark:text-gray-900 rounded-full px-8 py-6 text-base font-medium"
            >
              View pricing
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-400 dark:text-gray-600">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  )
}