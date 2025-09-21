'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  Settings,
  X,
  Check,
  Archive
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error' | 'approval'
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  avatar?: string
  metadata?: any
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'approval',
    title: 'Post Approval Required',
    description: 'Sarah requested approval for LinkedIn post about Q4 results',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    actionUrl: '/approvals',
    actionLabel: 'Review',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '2',
    type: 'success',
    title: 'Post Published Successfully',
    description: 'Your scheduled post for TechCorp was published on Twitter',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Engagement Drop Detected',
    description: 'Instagram engagement decreased by 15% this week',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    actionUrl: '/analytics',
    actionLabel: 'View Analytics',
  },
  {
    id: '4',
    type: 'info',
    title: 'New Trending Topic',
    description: '#AIRevolution is trending in your industry',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
    actionUrl: '/discover',
    actionLabel: 'Explore',
  },
  {
    id: '5',
    type: 'error',
    title: 'Post Failed to Publish',
    description: 'Facebook API error for scheduled post at 2:00 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
    actionUrl: '/calendar',
    actionLabel: 'Reschedule',
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'approval':
        return <Users className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'approval':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const random = Math.random()
      if (random > 0.95) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'New Activity',
          description: 'Your post is gaining traction!',
          timestamp: new Date(),
          read: false,
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[400px] p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notifications
            </p>
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 px-2"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {/* Open settings */}}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <Bell className="h-12 w-12 mb-4" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                    !notification.read && "bg-muted/30"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {notification.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        getTypeColor(notification.type).split(' ')[0]
                      )}>
                        {getIcon(notification.type)}
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                        {notification.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Navigate to action URL
                              window.location.href = notification.actionUrl
                            }}
                          >
                            {notification.actionLabel || 'View'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full" onClick={() => {
            setIsOpen(false)
            // Navigate to notifications page
          }}>
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}