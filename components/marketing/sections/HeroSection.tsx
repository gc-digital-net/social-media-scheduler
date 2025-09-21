'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Main heading with gradient */}
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight">
            <span className="block text-gray-900 dark:text-gray-100">
              Social media
            </span>
            <span className="block mt-2">
              <span className="text-gradient">scheduling</span>
              {' '}
              <span className="text-gray-900 dark:text-gray-100">
                that just works
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            The modern platform to schedule, analyze, and grow across all social channels. 
            Built for teams who move fast.
          </p>

          {/* CTA buttons - Attio style */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-full px-8 py-6 text-base font-medium transition-all hover:scale-105"
              >
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full px-8 py-6 text-base font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
              >
                Book a demo
              </Button>
            </Link>
          </div>

          {/* Trust indicators - minimalist */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="flex flex-wrap gap-8 text-sm text-gray-500 dark:text-gray-500">
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
        </div>

        {/* Product preview - clean glass morphism card */}
        <div className="mt-24 relative">
          <div className="glass rounded-2xl p-1 shadow-2xl">
            <div className="rounded-xl bg-white dark:bg-gray-900 p-8">
              <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-300 dark:text-gray-700">
                    Dashboard Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}