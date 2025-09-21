'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Send, Eye, TrendingUp, Users, Heart, MessageCircle, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  scheduledPosts: number;
  publishedToday: number;
  totalReach: number;
  engagementRate: number;
  newFollowers: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    scheduledPosts: 0,
    publishedToday: 0,
    totalReach: 0,
    engagementRate: 0,
    newFollowers: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient()
        
        // Get user's workspace
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch scheduled posts count
        const { count: scheduledCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'scheduled')
        
        // Fetch today's published posts
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const { count: publishedToday } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
          .gte('published_at', today.toISOString())

        // Fetch analytics data (if available)
        const { data: analytics } = await supabase
          .from('analytics')
          .select('reach, likes, comments, shares')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

        // Calculate totals from analytics
        const totalReach = analytics?.reduce((sum, a) => sum + (a.reach || 0), 0) || 0
        const totalLikes = analytics?.reduce((sum, a) => sum + (a.likes || 0), 0) || 0
        const totalComments = analytics?.reduce((sum, a) => sum + (a.comments || 0), 0) || 0
        const totalShares = analytics?.reduce((sum, a) => sum + (a.shares || 0), 0) || 0

        // Calculate engagement rate
        const engagementRate = totalReach > 0 
          ? ((totalLikes + totalComments + totalShares) / totalReach * 100).toFixed(1)
          : 0

        setStats({
          scheduledPosts: scheduledCount || 0,
          publishedToday: publishedToday || 0,
          totalReach,
          engagementRate: parseFloat(engagementRate as string),
          newFollowers: 0, // This would need platform API integration
          totalLikes,
          totalComments,
          totalShares,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const mainStats = [
    {
      title: 'Scheduled Posts',
      value: stats.scheduledPosts.toString(),
      description: 'Ready to publish',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Published Today',
      value: stats.publishedToday.toString(),
      description: 'Across all platforms',
      icon: Send,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Total Reach',
      value: stats.totalReach.toLocaleString(),
      description: 'Last 7 days',
      icon: Eye,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
    {
      title: 'Engagement Rate',
      value: `${stats.engagementRate}%`,
      description: '+0.8% from last week',
      icon: TrendingUp,
      color: 'text-lime-600',
      bgColor: 'bg-lime-100',
    },
  ]

  const engagementStats = [
    { icon: Users, label: 'New Followers', value: `+${stats.newFollowers}` },
    { icon: Heart, label: 'Likes', value: stats.totalLikes },
    { icon: MessageCircle, label: 'Comments', value: stats.totalComments },
    { icon: Share2, label: 'Shares', value: stats.totalShares },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Today's Engagement</h3>
              <p className="text-sm text-muted-foreground">Real-time updates</p>
            </div>
            <div className="flex gap-6">
              {engagementStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}