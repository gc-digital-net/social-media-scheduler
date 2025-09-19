import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  CalendarDays,
  BarChart3,
  Users,
  PlusCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MoreHorizontal,
  Eye,
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Mock data - will be replaced with real data from Supabase
  const stats = {
    totalPosts: 145,
    postsThisWeek: 12,
    engagementRate: 4.8,
    connectedAccounts: 5,
  }

  const recentPosts = [
    {
      id: 1,
      content: 'Excited to share our latest product update! Check out the new features...',
      platforms: ['facebook', 'instagram', 'twitter'],
      scheduledFor: '2024-01-15 10:00 AM',
      status: 'scheduled',
      engagement: null,
    },
    {
      id: 2,
      content: 'Behind the scenes of our photo shoot today. What do you think of...',
      platforms: ['instagram'],
      scheduledFor: '2024-01-14 3:00 PM',
      status: 'published',
      engagement: {
        likes: 234,
        comments: 12,
        shares: 5,
        views: 1420,
      },
    },
    {
      id: 3,
      content: 'Join us for our webinar next week! Topics include social media strategy...',
      platforms: ['linkedin', 'facebook'],
      scheduledFor: '2024-01-16 2:00 PM',
      status: 'scheduled',
      engagement: null,
    },
  ]

  const platformIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
  }

  const platformColors = {
    facebook: 'text-blue-600',
    instagram: 'text-pink-600',
    twitter: 'text-sky-500',
    linkedin: 'text-blue-700',
    youtube: 'text-red-600',
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening with your social media.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.postsThisWeek}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span>8 scheduled, 4 published</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagementRate}%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>0.8% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connectedAccounts}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span>Social accounts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/composer">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/platforms">
                <Users className="mr-2 h-4 w-4" />
                Connect Account
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/calendar">
                <CalendarDays className="mr-2 h-4 w-4" />
                View Calendar
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" asChild>
            <Link href="/queue">View All</Link>
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          {recentPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.platforms.map((platform) => {
                        const Icon = platformIcons[platform as keyof typeof platformIcons]
                        return (
                          <Icon
                            key={platform}
                            className={`h-4 w-4 ${platformColors[platform as keyof typeof platformColors]}`}
                          />
                        )
                      })}
                      <Badge
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {post.status}
                      </Badge>
                      <span className="text-sm text-gray-500 ml-auto">
                        {post.scheduledFor}
                      </span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{post.content}</p>
                    {post.engagement && (
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.engagement.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.engagement.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          {post.engagement.shares}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {recentPosts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">
                  Start creating and scheduling your social media content
                </p>
                <Button asChild>
                  <Link href="/composer">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Scheduled posts will appear here</h3>
              <p className="text-gray-500 mb-4">
                Plan your content ahead and maintain a consistent posting schedule
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Published posts will appear here</h3>
              <p className="text-gray-500 mb-4">
                Track the performance of your published content
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardContent className="text-center py-12">
              <PlusCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Draft posts will appear here</h3>
              <p className="text-gray-500 mb-4">
                Save your work in progress and finish later
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}