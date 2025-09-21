'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Building2,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  MoreVertical,
  Settings,
  BarChart,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Archive,
  ExternalLink
} from 'lucide-react'
import { ClientAccount } from '@/lib/contexts/account-context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AccountCardProps {
  account: ClientAccount
  className?: string
}

interface AccountMetrics {
  scheduledPosts: number
  publishedToday: number
  pendingApproval: number
  failedPosts: number
  totalFollowers: number
  engagementRate: number
  weeklyGrowth: number
}

export function AccountCard({ account, className }: AccountCardProps) {
  const [metrics, setMetrics] = useState<AccountMetrics>({
    scheduledPosts: 0,
    publishedToday: 0,
    pendingApproval: 0,
    failedPosts: 0,
    totalFollowers: 0,
    engagementRate: 0,
    weeklyGrowth: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadMetrics()
  }, [account.id])

  const loadMetrics = async () => {
    try {
      // Fetch scheduled posts
      const { count: scheduled } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('client_account_id', account.id)
        .eq('status', 'scheduled')

      // Fetch today's published posts
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: published } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('client_account_id', account.id)
        .eq('status', 'published')
        .gte('published_at', today.toISOString())

      // Fetch pending approval
      const { count: pending } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('client_account_id', account.id)
        .eq('approval_status', 'pending_review')

      // Fetch failed posts
      const { count: failed } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('client_account_id', account.id)
        .eq('status', 'failed')

      setMetrics({
        scheduledPosts: scheduled || 0,
        publishedToday: published || 0,
        pendingApproval: pending || 0,
        failedPosts: failed || 0,
        totalFollowers: Math.floor(Math.random() * 50000), // Mock data
        engagementRate: Math.random() * 10, // Mock data
        weeklyGrowth: Math.random() * 20 - 5, // Mock data
      })
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = () => {
    // Switch to this account and go to dashboard
    router.push(`/dashboard?account=${account.id}`)
  }

  const getStatusColor = () => {
    if (account.status === 'active') return 'bg-green-500'
    if (account.status === 'paused') return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getHealthScore = () => {
    // Calculate health score based on metrics
    if (metrics.failedPosts > 0) return 'warning'
    if (metrics.engagementRate > 5) return 'excellent'
    if (metrics.engagementRate > 2) return 'good'
    return 'needs-attention'
  }

  const healthScore = getHealthScore()

  return (
    <Card 
      className={cn(
        "relative overflow-hidden hover:shadow-lg transition-all cursor-pointer",
        className
      )}
      onClick={handleNavigate}
    >
      {/* Status indicator */}
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        getStatusColor()
      )} />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {account.logo_url ? (
              <img 
                src={account.logo_url} 
                alt={account.name}
                className="h-10 w-10 rounded-lg"
              />
            ) : (
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: account.brand_colors?.primary || '#22c55e' }}
              >
                {account.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{account.name}</CardTitle>
              {account.industry && (
                <p className="text-sm text-muted-foreground">{account.industry}</p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                router.push(`/dashboard?account=${account.id}`)
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                router.push(`/analytics?account=${account.id}`)
              }}>
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                router.push(`/settings/accounts/${account.id}`)
              }}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                // Handle archive
              }}>
                <Archive className="mr-2 h-4 w-4" />
                Archive Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Health indicator */}
        <div className="flex items-center gap-2 mt-3">
          {healthScore === 'excellent' && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Excellent
            </Badge>
          )}
          {healthScore === 'good' && (
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              <TrendingUp className="mr-1 h-3 w-3" />
              Good
            </Badge>
          )}
          {healthScore === 'warning' && (
            <Badge variant="default" className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="mr-1 h-3 w-3" />
              Needs Attention
            </Badge>
          )}
          {account.status === 'paused' && (
            <Badge variant="secondary">
              <Clock className="mr-1 h-3 w-3" />
              Paused
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Scheduled</p>
            <p className="text-2xl font-bold">{metrics.scheduledPosts}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Published Today</p>
            <p className="text-2xl font-bold">{metrics.publishedToday}</p>
          </div>
        </div>

        {/* Alerts */}
        {(metrics.pendingApproval > 0 || metrics.failedPosts > 0) && (
          <div className="space-y-2 pt-2 border-t">
            {metrics.pendingApproval > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-600">Pending Approval</span>
                <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                  {metrics.pendingApproval}
                </Badge>
              </div>
            )}
            {metrics.failedPosts > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600">Failed Posts</span>
                <Badge variant="outline" className="border-red-600 text-red-600">
                  {metrics.failedPosts}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Engagement metrics */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Engagement Rate</span>
            <span className="font-medium">{metrics.engagementRate.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.engagementRate * 10} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Weekly Growth</span>
            <span className={cn(
              "font-medium",
              metrics.weeklyGrowth > 0 ? "text-green-600" : "text-red-600"
            )}>
              {metrics.weeklyGrowth > 0 ? '+' : ''}{metrics.weeklyGrowth.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/compose?account=${account.id}`)
            }}
          >
            <Edit className="mr-1 h-3 w-3" />
            Compose
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/calendar?account=${account.id}`)
            }}
          >
            <Calendar className="mr-1 h-3 w-3" />
            Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}