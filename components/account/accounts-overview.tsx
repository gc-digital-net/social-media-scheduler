'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientAccount } from '@/lib/contexts/account-context'
import { 
  Building2, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Users,
  Activity
} from 'lucide-react'

interface AccountsOverviewProps {
  accounts: ClientAccount[]
}

export function AccountsOverview({ accounts }: AccountsOverviewProps) {
  // Calculate overview metrics
  const totalAccounts = accounts.length
  const activeAccounts = accounts.filter(a => a.status === 'active').length
  const pausedAccounts = accounts.filter(a => a.status === 'paused').length
  const needsAttention = 3 // Mock - would calculate based on failed posts, low engagement, etc.

  const stats = [
    {
      title: 'Total Accounts',
      value: totalAccounts,
      description: `${activeAccounts} active, ${pausedAccounts} paused`,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Scheduled',
      value: '142',
      description: 'Across all accounts',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Weekly Reach',
      value: '284K',
      description: '+12% from last week',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Avg. Engagement',
      value: '4.2%',
      description: '↑ 0.8% from last month',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Health Score',
      value: '87%',
      description: `${needsAttention} accounts need attention`,
      icon: Activity,
      color: needsAttention > 0 ? 'text-yellow-600' : 'text-green-600',
      bgColor: needsAttention > 0 ? 'bg-yellow-100' : 'bg-green-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
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
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}