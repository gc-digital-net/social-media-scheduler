'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  MoreHorizontal,
  Edit,
  Trash,
  Copy,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, addDays, setHours, setMinutes, addWeeks, subWeeks, eachHourOfInterval, startOfDay, endOfDay } from 'date-fns'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface Post {
  id: string
  title: string
  content: string
  date: Date
  time: string
  platforms: string[]
  status: 'draft' | 'scheduled' | 'published'
  color?: string
}

interface ModernCalendarProps {
  posts?: Post[]
  onSelectDate?: (date: Date) => void
  onSelectPost?: (post: Post) => void
}

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
}

const platformColors = {
  twitter: 'bg-sky-500',
  linkedin: 'bg-blue-600',
  instagram: 'bg-pink-500',
  facebook: 'bg-indigo-600',
}

export function ModernCalendar({ posts = [], onSelectDate, onSelectPost }: ModernCalendarProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate))
    const end = endOfWeek(endOfMonth(currentDate))
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  // Group posts by date
  const postsByDate = useMemo(() => {
    const grouped: Record<string, Post[]> = {}
    posts.forEach(post => {
      const dateKey = format(post.date, 'yyyy-MM-dd')
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(post)
    })
    return grouped
  }, [posts])

  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const handleToday = () => setCurrentDate(new Date())

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onSelectDate?.(date)
  }

  const handleQuickAdd = (date: Date, time?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const timeStr = time || '09:00'
    router.push(`/compose?date=${dateStr}&time=${timeStr}`)
  }

  const getPostsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return postsByDate[dateKey] || []
  }

  return (
    <TooltipProvider>
      <div className="bg-background rounded-xl border shadow-sm">
        {/* Calendar Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">
                {view === 'month' && format(currentDate, 'MMMM yyyy')}
                {view === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`}
                {view === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToday}
                  className="px-3"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                <Button
                  variant={view === 'month' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setView('month')}
                  className="h-8"
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setView('week')}
                  className="h-8"
                >
                  Week
                </Button>
                <Button
                  variant={view === 'day' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setView('day')}
                  className="h-8"
                >
                  Day
                </Button>
              </div>
              
              <Button
                onClick={() => handleQuickAdd(selectedDate || new Date())}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Views */}
        <div className="p-6">
          {view === 'month' && (
            <>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Month View - Calendar Days */}
              <div className="grid grid-cols-7 gap-px bg-muted rounded-lg p-px">
                {calendarDays.map((date, index) => {
              const dayPosts = getPostsForDate(date)
              const isCurrentMonth = isSameMonth(date, currentDate)
              const isSelected = selectedDate && isSameDay(date, selectedDate)
              const isHovered = hoveredDate && isSameDay(date, hoveredDate)
              const isTodayDate = isToday(date)
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={cn(
                    "relative bg-background min-h-[120px] p-2 cursor-pointer transition-all",
                    "hover:bg-accent/50 hover:shadow-md",
                    !isCurrentMonth && "opacity-40",
                    isSelected && "ring-2 ring-primary",
                    isTodayDate && "bg-accent/20"
                  )}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  {/* Date Number */}
                  <div className="flex items-start justify-between mb-1">
                    <span className={cn(
                      "text-sm font-medium",
                      isTodayDate && "bg-primary text-primary-foreground rounded-full px-2 py-0.5"
                    )}>
                      {format(date, 'd')}
                    </span>
                    
                    {/* Quick Add Button */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleQuickAdd(date)
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add post for {format(date, 'MMM d')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Posts for this day */}
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map((post, idx) => (
                      <Tooltip key={post.id}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn(
                              "group relative px-1.5 py-0.5 rounded text-xs cursor-pointer",
                              "hover:shadow-sm transition-all",
                              post.status === 'published' ? 'bg-green-100 text-green-800' :
                              post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectPost?.(post)
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              <span className="truncate flex-1">{post.time}</span>
                              
                              {/* Platform Icons */}
                              <div className="flex -space-x-1">
                                {post.platforms.slice(0, 2).map((platform) => {
                                  const Icon = platformIcons[platform as keyof typeof platformIcons]
                                  return Icon ? (
                                    <div
                                      key={platform}
                                      className={cn(
                                        "h-3 w-3 rounded-full flex items-center justify-center",
                                        platformColors[platform as keyof typeof platformColors]
                                      )}
                                    >
                                      <Icon className="h-2 w-2 text-white" />
                                    </div>
                                  ) : null
                                })}
                                {post.platforms.length > 2 && (
                                  <div className="h-3 w-3 rounded-full bg-gray-400 flex items-center justify-center">
                                    <span className="text-[8px] text-white">
                                      +{post.platforms.length - 2}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Actions Menu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem onClick={() => router.push(`/compose?edit=${post.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Post
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="truncate text-[10px] mt-0.5 opacity-70">
                              {post.title}
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm">
                          <div className="space-y-2">
                            <div className="font-semibold">{post.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {post.content}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="h-3 w-3" />
                              {format(post.date, 'MMM d')} at {post.time}
                            </div>
                            <div className="flex gap-1">
                              {post.platforms.map(platform => (
                                <Badge key={platform} variant="secondary" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    
                    {dayPosts.length > 3 && (
                      <div className="text-[10px] text-center text-muted-foreground">
                        +{dayPosts.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Hover Time Slots */}
                  <AnimatePresence>
                    {isHovered && dayPosts.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-2 bottom-2 space-y-1"
                      >
                        {['09:00', '12:00', '15:00', '18:00'].map((time) => (
                          <button
                            key={time}
                            className="w-full text-[10px] py-0.5 rounded bg-accent/50 hover:bg-accent transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleQuickAdd(date, time)
                            }}
                          >
                            + {time}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
            </>
          )}

          {/* Week View */}
          {view === 'week' && (
            <div>
              {/* Week Days Header */}
              <div className="grid grid-cols-8 gap-px bg-muted rounded-lg p-px mb-2">
                <div className="bg-background p-2 text-center text-sm font-medium text-muted-foreground">
                  Time
                </div>
                {eachDayOfInterval({
                  start: startOfWeek(currentDate),
                  end: endOfWeek(currentDate)
                }).map(day => (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "bg-background p-2 text-center",
                      isToday(day) && "bg-accent/20"
                    )}
                  >
                    <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                    <div className={cn(
                      "text-lg font-semibold",
                      isToday(day) && "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                    )}>
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-8 gap-px bg-muted rounded-lg p-px max-h-[600px] overflow-y-auto">
                {Array.from({ length: 24 }, (_, hour) => (
                  <React.Fragment key={hour}>
                    <div className="bg-background p-2 text-center text-sm text-muted-foreground">
                      {format(setHours(new Date(), hour), 'HH:mm')}
                    </div>
                    {eachDayOfInterval({
                      start: startOfWeek(currentDate),
                      end: endOfWeek(currentDate)
                    }).map(day => {
                      const slotDate = setHours(day, hour)
                      const slotPosts = posts.filter(post => {
                        const postHour = post.date.getHours()
                        return isSameDay(post.date, day) && postHour === hour
                      })
                      
                      return (
                        <div
                          key={day.toISOString()}
                          className={cn(
                            "bg-background p-2 min-h-[60px] border-l cursor-pointer hover:bg-accent/50",
                            isToday(day) && "bg-accent/10"
                          )}
                          onClick={() => handleQuickAdd(slotDate, format(slotDate, 'HH:mm'))}
                        >
                          {slotPosts.map(post => (
                            <motion.div
                              key={post.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={cn(
                                "p-1 rounded text-xs mb-1 cursor-pointer",
                                post.status === 'published' ? 'bg-green-100 text-green-800' :
                                post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectPost?.(post)
                              }}
                            >
                              <div className="font-semibold truncate">{post.title}</div>
                              <div className="text-[10px] opacity-70">{post.time}</div>
                            </motion.div>
                          ))}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Day View */}
          {view === 'day' && (
            <div>
              {/* Day Header */}
              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    {format(currentDate, 'EEEE')}
                  </div>
                  <div className={cn(
                    "text-2xl font-bold mt-1",
                    isToday(currentDate) && "text-primary"
                  )}>
                    {format(currentDate, 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>

              {/* Hour Slots */}
              <div className="space-y-px max-h-[600px] overflow-y-auto">
                {Array.from({ length: 24 }, (_, hour) => {
                  const slotDate = setHours(startOfDay(currentDate), hour)
                  const slotPosts = posts.filter(post => {
                    const postHour = post.date.getHours()
                    return isSameDay(post.date, currentDate) && postHour === hour
                  })
                  
                  return (
                    <div
                      key={hour}
                      className="grid grid-cols-12 gap-px bg-muted rounded-lg p-px"
                    >
                      <div className="col-span-2 bg-background p-3 text-right">
                        <span className="text-sm font-medium text-muted-foreground">
                          {format(slotDate, 'HH:mm')}
                        </span>
                      </div>
                      <div
                        className="col-span-10 bg-background p-3 min-h-[60px] cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleQuickAdd(slotDate, format(slotDate, 'HH:mm'))}
                      >
                        <div className="space-y-2">
                          {slotPosts.map(post => (
                            <motion.div
                              key={post.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={cn(
                                "p-2 rounded cursor-pointer",
                                post.status === 'published' ? 'bg-green-100 text-green-800' :
                                post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectPost?.(post)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold">{post.title}</div>
                                  <div className="text-sm opacity-70 mt-1">{post.content}</div>
                                  <div className="flex items-center gap-2 mt-2">
                                    {post.platforms.map(platform => {
                                      const Icon = platformIcons[platform as keyof typeof platformIcons]
                                      return Icon ? (
                                        <div
                                          key={platform}
                                          className={cn(
                                            "h-5 w-5 rounded-full flex items-center justify-center",
                                            platformColors[platform as keyof typeof platformColors]
                                          )}
                                        >
                                          <Icon className="h-3 w-3 text-white" />
                                        </div>
                                      ) : null
                                    })}
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/compose?edit=${post.id}`)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </motion.div>
                          ))}
                          {slotPosts.length === 0 && (
                            <div className="text-sm text-muted-foreground text-center py-2">
                              Click to schedule a post
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-100" />
              <span className="text-muted-foreground">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-100" />
              <span className="text-muted-foreground">Published</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-gray-100" />
              <span className="text-muted-foreground">Draft</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}