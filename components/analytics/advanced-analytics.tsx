'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Calendar,
  Target,
  Award,
  Zap,
  Globe,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const engagementData = [
  { date: 'Mon', likes: 245, comments: 89, shares: 45, reach: 12500 },
  { date: 'Tue', likes: 285, comments: 95, shares: 52, reach: 13800 },
  { date: 'Wed', likes: 310, comments: 102, shares: 61, reach: 14200 },
  { date: 'Thu', likes: 295, comments: 98, shares: 58, reach: 13900 },
  { date: 'Fri', likes: 325, comments: 110, shares: 65, reach: 15100 },
  { date: 'Sat', likes: 215, comments: 75, shares: 38, reach: 10200 },
  { date: 'Sun', likes: 195, comments: 68, shares: 35, reach: 9800 },
]

const platformPerformance = [
  { platform: 'LinkedIn', posts: 45, engagement: 8.5, reach: 125000, growth: 15.2 },
  { platform: 'Twitter', posts: 89, engagement: 6.2, reach: 98000, growth: 8.7 },
  { platform: 'Instagram', posts: 67, engagement: 9.8, reach: 145000, growth: 22.5 },
  { platform: 'Facebook', posts: 34, engagement: 5.1, reach: 67000, growth: -3.2 },
]

const contentTypePerformance = [
  { type: 'Educational', value: 35, engagement: 8.9 },
  { type: 'Promotional', value: 25, engagement: 5.2 },
  { type: 'Behind the Scenes', value: 20, engagement: 7.8 },
  { type: 'User Generated', value: 15, engagement: 9.5 },
  { type: 'News & Updates', value: 5, engagement: 4.1 },
]

const audienceDemographics = [
  { age: '18-24', percentage: 15 },
  { age: '25-34', percentage: 35 },
  { age: '35-44', percentage: 28 },
  { age: '45-54', percentage: 15 },
  { age: '55+', percentage: 7 },
]

const topPosts = [
  { title: 'Product Launch Announcement', engagement: 12500, platform: 'LinkedIn', type: 'success' },
  { title: 'Industry Insights Thread', engagement: 9800, platform: 'Twitter', type: 'success' },
  { title: 'Behind the Scenes Video', engagement: 8900, platform: 'Instagram', type: 'success' },
  { title: 'Customer Success Story', engagement: 2100, platform: 'Facebook', type: 'warning' },
  { title: 'Weekly Tips Newsletter', engagement: 1500, platform: 'LinkedIn', type: 'warning' },
]

const competitorComparison = [
  { metric: 'Engagement', us: 85, competitor1: 72, competitor2: 68 },
  { metric: 'Reach', us: 90, competitor1: 85, competitor2: 75 },
  { metric: 'Growth', us: 78, competitor1: 65, competitor2: 82 },
  { metric: 'Content Quality', us: 88, competitor1: 70, competitor2: 75 },
  { metric: 'Consistency', us: 92, competitor1: 88, competitor2: 70 },
]

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

interface AdvancedAnalyticsProps {
  accountId?: string
}

export function AdvancedAnalytics({ accountId }: AdvancedAnalyticsProps) {
  const [dateRange, setDateRange] = useState('7d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  const calculateChange = (value: number) => {
    const change = Math.random() * 40 - 10 // Random change for demo
    return {
      value: change,
      isPositive: change > 0,
      formatted: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
    }
  }

  const metrics = {
    totalReach: { value: 489500, change: calculateChange(489500) },
    engagement: { value: 7.8, change: calculateChange(7.8) },
    followers: { value: 45200, change: calculateChange(45200) },
    conversions: { value: 342, change: calculateChange(342) },
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.totalReach.value / 1000).toFixed(1)}K
            </div>
            <p className={cn(
              "text-xs flex items-center gap-1",
              metrics.totalReach.change.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {metrics.totalReach.change.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {metrics.totalReach.change.formatted} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.engagement.value}%</div>
            <p className={cn(
              "text-xs flex items-center gap-1",
              metrics.engagement.change.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {metrics.engagement.change.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {metrics.engagement.change.formatted} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.followers.value / 1000).toFixed(1)}K
            </div>
            <p className={cn(
              "text-xs flex items-center gap-1",
              metrics.followers.change.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {metrics.followers.change.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {metrics.followers.change.formatted} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversions.value}</div>
            <p className={cn(
              "text-xs flex items-center gap-1",
              metrics.conversions.change.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {metrics.conversions.change.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {metrics.conversions.change.formatted} from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>
                  Daily engagement metrics across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="likes" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="comments" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="shares" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>
                  Engagement rates by social platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>
                Your best content from the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        post.type === 'success' ? "bg-green-500" : "bg-yellow-500"
                      )} />
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(post.engagement / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-muted-foreground">engagements</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
                <CardDescription>
                  Distribution of your audience by age group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={audienceDemographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ age, percentage }) => `${age}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {audienceDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Growth</CardTitle>
                <CardDescription>
                  Follower growth across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformPerformance.map((platform) => (
                    <div key={platform.platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{platform.platform}</span>
                        <span className={cn(
                          "text-sm",
                          platform.growth > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {platform.growth > 0 ? '+' : ''}{platform.growth}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.abs(platform.growth) * 4} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Where your audience is located
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Top Countries</h4>
                  <div className="space-y-2">
                    {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'].map((country, index) => (
                      <div key={country} className="flex items-center justify-between text-sm">
                        <span>{country}</span>
                        <span className="font-medium">{35 - index * 5}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Top Cities</h4>
                  <div className="space-y-2">
                    {['New York', 'London', 'Los Angeles', 'Toronto', 'Sydney'].map((city, index) => (
                      <div key={city} className="flex items-center justify-between text-sm">
                        <span>{city}</span>
                        <span className="font-medium">{20 - index * 3}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Performance</CardTitle>
                <CardDescription>
                  Engagement by content category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contentTypePerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimal Posting Times</CardTitle>
                <CardDescription>
                  Best times to post based on engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dayIndex) => (
                    <div key={dayIndex} className="space-y-1">
                      <div className="text-center font-medium mb-1">{day}</div>
                      {[6, 9, 12, 15, 18, 21].map((hour) => (
                        <div
                          key={hour}
                          className={cn(
                            "h-4 rounded",
                            hour === 9 || hour === 18 ? "bg-green-500" :
                            hour === 12 || hour === 15 ? "bg-yellow-500" :
                            "bg-gray-200"
                          )}
                          title={`${day} ${hour}:00`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-green-500" />
                    <span>Best</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-yellow-500" />
                    <span>Good</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-gray-200" />
                    <span>Average</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Recommendations</CardTitle>
              <CardDescription>
                AI-powered suggestions based on your performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge className="bg-green-100 text-green-800">Tip</Badge>
                  <p className="text-sm">
                    Your educational content performs 73% better than promotional posts. Consider increasing educational content to 50% of your content mix.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Insight</Badge>
                  <p className="text-sm">
                    Video content on Instagram gets 2.5x more engagement than static images. Try posting more Reels.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  <p className="text-sm">
                    Facebook engagement has declined 15% this month. Review your content strategy for this platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Comparison</CardTitle>
              <CardDescription>
                How you stack up against your main competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={competitorComparison}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Your Brand" dataKey="us" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                  <Radar name="Competitor 1" dataKey="competitor1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="Competitor 2" dataKey="competitor2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Competitive Advantage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Higher engagement rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm">More consistent posting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Better content quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Expand reach</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Grow follower base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Increase growth rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-32 w-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.75)}`}
                        className="text-green-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">#2</div>
                        <div className="text-xs text-muted-foreground">of 5</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}