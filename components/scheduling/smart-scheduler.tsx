'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Clock,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimeSlot {
  time: string
  day: string
  score: number
  engagement: number
  reach: number
  competition: 'low' | 'medium' | 'high'
}

interface SmartSchedulerProps {
  accountId?: string
  onSchedule?: (slot: TimeSlot) => void
}

// Mock best times data
const bestTimes: TimeSlot[] = [
  { time: '9:00 AM', day: 'Monday', score: 95, engagement: 8.5, reach: 45000, competition: 'low' },
  { time: '12:30 PM', day: 'Tuesday', score: 92, engagement: 7.8, reach: 42000, competition: 'medium' },
  { time: '6:00 PM', day: 'Wednesday', score: 89, engagement: 9.2, reach: 38000, competition: 'low' },
  { time: '10:00 AM', day: 'Thursday', score: 88, engagement: 7.2, reach: 40000, competition: 'medium' },
  { time: '3:00 PM', day: 'Friday', score: 85, engagement: 6.8, reach: 35000, competition: 'high' },
]

const platformRecommendations = [
  {
    platform: 'LinkedIn',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
    bestTimes: ['9:00 AM - 10:00 AM', '12:00 PM - 1:00 PM'],
    audience: 'Most active during work hours',
  },
  {
    platform: 'Twitter/X',
    bestDays: ['Monday', 'Wednesday', 'Friday'],
    bestTimes: ['8:00 AM - 9:00 AM', '5:00 PM - 6:00 PM'],
    audience: 'Peak engagement during commute times',
  },
  {
    platform: 'Instagram',
    bestDays: ['Monday', 'Thursday', 'Sunday'],
    bestTimes: ['11:00 AM - 1:00 PM', '7:00 PM - 9:00 PM'],
    audience: 'Higher activity during lunch and evening',
  },
  {
    platform: 'Facebook',
    bestDays: ['Wednesday', 'Thursday', 'Friday'],
    bestTimes: ['1:00 PM - 3:00 PM'],
    audience: 'Consistent afternoon engagement',
  },
]

export function SmartScheduler({ accountId, onSchedule }: SmartSchedulerProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [optimizationMode, setOptimizationMode] = useState<'engagement' | 'reach' | 'balanced'>('balanced')

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCompetitionBadge = (competition: string) => {
    const variants = {
      low: { color: 'bg-green-100 text-green-800', label: 'Low Competition' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Competition' },
      high: { color: 'bg-red-100 text-red-800', label: 'High Competition' },
    }
    const variant = variants[competition as keyof typeof variants]
    return (
      <Badge className={cn('text-xs', variant.color)}>
        {variant.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Smart Scheduling
              </CardTitle>
              <CardDescription>
                AI-powered recommendations for optimal posting times
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={optimizationMode === 'engagement' ? 'default' : 'outline'}
                onClick={() => setOptimizationMode('engagement')}
              >
                <Target className="mr-2 h-4 w-4" />
                Engagement
              </Button>
              <Button
                size="sm"
                variant={optimizationMode === 'reach' ? 'default' : 'outline'}
                onClick={() => setOptimizationMode('reach')}
              >
                <Users className="mr-2 h-4 w-4" />
                Reach
              </Button>
              <Button
                size="sm"
                variant={optimizationMode === 'balanced' ? 'default' : 'outline'}
                onClick={() => setOptimizationMode('balanced')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Balanced
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="best-times" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="best-times">Best Times</TabsTrigger>
              <TabsTrigger value="by-platform">By Platform</TabsTrigger>
              <TabsTrigger value="audience-insights">Audience Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="best-times" className="space-y-4">
              <div className="space-y-3">
                {bestTimes.map((slot, index) => (
                  <Card
                    key={index}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedSlot === slot && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "text-2xl font-bold",
                            getScoreColor(slot.score)
                          )}>
                            {slot.score}
                          </div>
                          <div>
                            <p className="font-medium">
                              {slot.day}, {slot.time}
                            </p>
                            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                              <span>Engagement: {slot.engagement}%</span>
                              <span>Reach: {(slot.reach / 1000).toFixed(0)}K</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getCompetitionBadge(slot.competition)}
                          {selectedSlot === slot && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                      <Progress value={slot.score} className="mt-3 h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedSlot && (
                <Button
                  className="w-full"
                  onClick={() => onSchedule?.(selectedSlot)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule for {selectedSlot.day} at {selectedSlot.time}
                </Button>
              )}
            </TabsContent>

            <TabsContent value="by-platform" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {platformRecommendations.map((platform, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{platform.platform}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Best Days</p>
                        <div className="flex gap-1 flex-wrap">
                          {platform.bestDays.map((day) => (
                            <Badge key={day} variant="secondary" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Optimal Times</p>
                        <div className="flex gap-1 flex-wrap">
                          {platform.bestTimes.map((time) => (
                            <Badge key={time} variant="outline" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {platform.audience}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audience-insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Audience Activity</CardTitle>
                  <CardDescription>
                    When your audience is most active and engaged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Online Peak Hours</span>
                        <span className="text-sm text-muted-foreground">78% of audience</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        9:00 AM - 11:00 AM, 6:00 PM - 8:00 PM
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Engagement Peak</span>
                        <span className="text-sm text-muted-foreground">65% interactions</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tuesday - Thursday, 10:00 AM - 2:00 PM
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Weekend Activity</span>
                        <span className="text-sm text-muted-foreground">45% of weekday</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Lower engagement, best for evergreen content
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Recommendation</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Focus on Tuesday-Thursday mornings for important announcements.
                          Use Monday and Friday for engagement posts and community building.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Timezone Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>EST (Eastern)</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>PST (Pacific)</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CST (Central)</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>International</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}