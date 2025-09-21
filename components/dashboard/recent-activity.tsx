'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Send, Edit, Trash2, Link2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
  id: string;
  type: 'published' | 'scheduled' | 'failed' | 'edited' | 'deleted' | 'connected';
  message: string;
  platform?: string;
  timestamp: Date;
  success?: boolean;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // TODO: Fetch real activities from API
    // Mock data for now
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'published',
        message: 'Post published successfully',
        platform: 'twitter',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        success: true,
      },
      {
        id: '2',
        type: 'scheduled',
        message: 'New post scheduled for tomorrow',
        platform: 'linkedin',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        success: true,
      },
      {
        id: '3',
        type: 'connected',
        message: 'Facebook account connected',
        platform: 'facebook',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        success: true,
      },
      {
        id: '4',
        type: 'failed',
        message: 'Failed to publish post - API rate limit',
        platform: 'twitter',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        success: false,
      },
      {
        id: '5',
        type: 'edited',
        message: 'Post content updated',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        success: true,
      },
    ]
    setActivities(mockActivities)
  }, [])

  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'published':
        return <Send className="h-4 w-4" />
      case 'scheduled':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      case 'edited':
        return <Edit className="h-4 w-4" />
      case 'deleted':
        return <Trash2 className="h-4 w-4" />
      case 'connected':
        return <Link2 className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getActivityColor = (activity: Activity) => {
    if (activity.type === 'failed' || !activity.success) return 'bg-destructive'
    if (activity.type === 'published') return 'bg-green-500'
    if (activity.type === 'scheduled') return 'bg-blue-500'
    if (activity.type === 'connected') return 'bg-purple-500'
    return 'bg-muted'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={getActivityColor(activity)}>
                    {getActivityIcon(activity)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{activity.message}</p>
                    {activity.platform && (
                      <Badge variant="outline" className="text-xs">
                        {activity.platform}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}