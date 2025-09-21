'use client'

import { SmartScheduler } from '@/components/scheduling/smart-scheduler'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  Settings,
  ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SchedulingPage() {
  const router = useRouter()

  const handleSchedule = (slot: any) => {
    // Navigate to compose with pre-filled scheduling time
    router.push(`/compose?time=${slot.time}&day=${slot.day}`)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Smart Scheduling</h2>
          <p className="text-muted-foreground">
            Optimize your posting schedule with AI-powered recommendations
          </p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Scheduling Preferences
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled This Week
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Engagement Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8%</div>
            <p className="text-xs text-muted-foreground">
              Using smart scheduling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Optimization Score
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92/100</div>
            <p className="text-xs text-muted-foreground">
              Excellent timing
            </p>
          </CardContent>
        </Card>
      </div>

      <SmartScheduler onSchedule={handleSchedule} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Scheduling Performance</CardTitle>
          <CardDescription>
            How your scheduled posts performed compared to predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                post: 'Product Launch Announcement',
                scheduled: 'Tuesday, 9:00 AM',
                predicted: '45K reach',
                actual: '52K reach',
                performance: 'exceeded',
              },
              {
                post: 'Weekly Tips Thread',
                scheduled: 'Thursday, 2:00 PM',
                predicted: '8.2% engagement',
                actual: '7.9% engagement',
                performance: 'close',
              },
              {
                post: 'Behind the Scenes',
                scheduled: 'Friday, 6:00 PM',
                predicted: '30K reach',
                actual: '28K reach',
                performance: 'close',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <p className="font-medium">{item.post}</p>
                  <p className="text-sm text-muted-foreground">{item.scheduled}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm">Predicted: {item.predicted}</p>
                    <p className="text-sm font-medium">Actual: {item.actual}</p>
                  </div>
                  <Badge
                    variant={item.performance === 'exceeded' ? 'default' : 'secondary'}
                    className={
                      item.performance === 'exceeded'
                        ? 'bg-green-100 text-green-800'
                        : ''
                    }
                  >
                    {item.performance === 'exceeded' ? 'Exceeded' : 'On Target'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full mt-4" variant="outline">
            View Full Performance Report
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Pro Tip: Consistency is Key
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            While optimal timing can boost engagement by 20-30%, maintaining a consistent posting schedule 
            helps your audience know when to expect content. We recommend posting at the same times 
            at least 3 days per week to build audience habits.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}