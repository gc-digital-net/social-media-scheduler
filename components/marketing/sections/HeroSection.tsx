'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { AnimatedDashboardMockup } from '@/components/marketing/AnimatedDashboardMockup'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto text-center">
          {/* Main heading with gradient - smaller and centered */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-gray-900 dark:text-gray-100">
              Social media{' '}
              <span className="text-gradient">scheduling</span>
              {' '}that just works
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            The modern platform to schedule, analyze, and grow across all social channels. 
            Built for teams who move fast.
          </p>

          {/* CTA buttons - Attio style */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full px-8 py-6 text-base font-medium transition-all hover:scale-105 shadow-lg shadow-green-500/25"
              >
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full px-8 py-6 text-base font-medium border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950 transition-all"
              >
                Book a demo
              </Button>
            </Link>
          </div>

          {/* Trust indicators - minimalist */}
          <div className="mt-8 flex flex-wrap gap-8 text-sm text-gray-500 dark:text-gray-500 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>10,000+ teams</span>
            </div>
          </div>
        </div>

        {/* Animated Dashboard Mockup - moved up */}
        <div className="mt-16 relative">
          <AnimatedDashboardMockup />
        </div>
      </div>
    </section>
  )
}