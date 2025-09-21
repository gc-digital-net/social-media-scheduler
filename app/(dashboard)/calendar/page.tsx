'use client'

import { useState, useCallback, useMemo } from 'react'
import { Calendar, momentLocalizer, View, SlotInfo } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar as CalendarIcon, List, Grid3X3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PLATFORMS } from '@/lib/constants/platforms'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'

const localizer = momentLocalizer(moment)

interface Post {
  id: string;
  title: string;
  content: string;
  start: Date;
  end: Date;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published';
  resource?: any;
}

export default function CalendarPage() {
  const router = useRouter()
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // TODO: Fetch real events from API
  const events: Post[] = useMemo(() => [
    {
      id: '1',
      title: 'Product Launch Announcement',
      content: 'Excited to announce our new product!',
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 10, 30),
      platforms: ['twitter', 'linkedin'],
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Weekly Tips Thread',
      content: 'Here are 5 tips for better productivity',
      start: new Date(2024, 0, 17, 14, 0),
      end: new Date(2024, 0, 17, 14, 30),
      platforms: ['twitter'],
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Team Photo',
      content: 'Great team building event today!',
      start: new Date(2024, 0, 20, 16, 0),
      end: new Date(2024, 0, 20, 16, 30),
      platforms: ['instagram', 'facebook'],
      status: 'draft',
    },
  ], [])

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    // Navigate to compose with the selected date
    const date = moment(slotInfo.start).format('YYYY-MM-DD')
    const time = moment(slotInfo.start).format('HH:mm')
    router.push(`/compose?date=${date}&time=${time}`)
  }, [router])

  const handleSelectEvent = useCallback((event: Post) => {
    setSelectedPost(event)
    setDialogOpen(true)
  }, [])

  const eventStyleGetter = (event: Post) => {
    let backgroundColor = '#3b82f6' // default blue
    
    if (event.status === 'published') {
      backgroundColor = '#10b981' // green
    } else if (event.status === 'draft') {
      backgroundColor = '#6b7280' // gray
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const CustomEvent = ({ event }: { event: Post }) => {
    return (
      <div className="p-1">
        <div className="font-semibold text-xs truncate">{event.title}</div>
        <div className="flex gap-1 mt-1">
          {event.platforms.slice(0, 2).map(platform => (
            <span key={platform} className="text-[10px]">
              {PLATFORMS[platform as keyof typeof PLATFORMS].icon}
            </span>
          ))}
          {event.platforms.length > 2 && (
            <span className="text-[10px]">+{event.platforms.length - 2}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">
            Visualize and manage your content schedule
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/compose')}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Schedule Overview</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
              >
                <List className="h-4 w-4 mr-2" />
                Day
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent
              }}
              className="rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Post Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              Scheduled for {selectedPost && format(selectedPost.start, 'PPP p')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Content</h4>
              <p className="text-sm text-muted-foreground">{selectedPost?.content}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Platforms</h4>
              <div className="flex gap-2">
                {selectedPost?.platforms.map(platform => (
                  <Badge key={platform} variant="secondary">
                    {PLATFORMS[platform as keyof typeof PLATFORMS].name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Status</h4>
              <Badge variant={selectedPost?.status === 'scheduled' ? 'default' : 'secondary'}>
                {selectedPost?.status}
              </Badge>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  router.push(`/compose?edit=${selectedPost?.id}`)
                  setDialogOpen(false)
                }}
              >
                Edit Post
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}