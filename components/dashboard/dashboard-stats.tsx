'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Send, Eye, TrendingUp, Users, Heart, MessageCircle, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    // TODO: Fetch real stats from API
    // Mock data for now
    setStats({
      scheduledPosts: 12,
      publishedToday: 3,
      totalReach: 15420,
      engagementRate: 4.2,
      newFollowers: 127,
      totalLikes: 892,
      totalComments: 156,
      totalShares: 43,
    })
  }, [])

  const mainStats = [
    {
      title: 'Scheduled Posts',
      value: stats.scheduledPosts.toString(),
      description: 'Ready to publish',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Published Today',
      value: stats.publishedToday.toString(),
      description: 'Across all platforms',
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Reach',
      value: stats.totalReach.toLocaleString(),
      description: 'Last 7 days',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Engagement Rate',
      value: `${stats.engagementRate}%`,
      description: '+0.8% from last week',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
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