import { Suspense } from 'react'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { UpcomingPosts } from '@/components/dashboard/upcoming-posts'
import { QuickCompose } from '@/components/dashboard/quick-compose'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { PlatformConnections } from '@/components/dashboard/platform-connections'
import { CalendarWidget } from '@/components/dashboard/calendar-widget'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your social media activity.
        </p>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<Statsskeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2 cols wide */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Compose */}
          <QuickCompose />

          {/* Upcoming Posts */}
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <UpcomingPosts />
          </Suspense>

          {/* Recent Activity */}
          <Suspense fallback={<Skeleton className="h-[300px]" />}>
            <RecentActivity />
          </Suspense>
        </div>

        {/* Right Column - 1 col wide */}
        <div className="space-y-6">
          {/* Platform Connections */}
          <PlatformConnections />

          {/* Calendar Widget */}
          <CalendarWidget />
        </div>
      </div>
    </div>
  )
}

function StatsS…

leton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[120px]" />
      ))}
    </div>
  )
}