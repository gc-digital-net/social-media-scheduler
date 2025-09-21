'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PostCount {
  date: Date;
  count: number;
}

export function CalendarWidget() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // TODO: Fetch real post counts from API
  const postCounts: PostCount[] = [
    { date: new Date(), count: 2 },
    { date: new Date(Date.now() + 24 * 60 * 60 * 1000), count: 3 },
    { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), count: 1 },
    { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), count: 5 },
  ]

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Pad the start of the month to align with the correct day of week
  const startPadding = monthStart.getDay()
  const paddedDays = [
    ...Array(startPadding).fill(null),
    ...days
  ]

  const getPostCount = (date: Date | null) => {
    if (!date) return 0
    const found = postCounts.find(pc => isSameDay(pc.date, date))
    return found?.count || 0
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDayClick = (date: Date) => {
    router.push(`/calendar?date=${format(date, 'yyyy-MM-dd')}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {paddedDays.map((date, index) => {
            const postCount = date ? getPostCount(date) : 0
            const isToday = date ? isSameDay(date, new Date()) : false
            const isCurrentMonth = date ? isSameMonth(date, currentMonth) : false
            
            if (!date) {
              return <div key={`empty-${index}`} className="p-2" />
            }
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDayClick(date)}
                className={cn(
                  "relative p-2 text-sm rounded hover:bg-muted transition-colors",
                  !isCurrentMonth && "text-muted-foreground",
                  isToday && "bg-primary/10 font-semibold"
                )}
              >
                {format(date, 'd')}
                {postCount > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center">
                      {postCount}
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button
            className="w-full"
            variant="outline"
            size="sm"
            onClick={() => router.push('/calendar')}
          >
            View Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}