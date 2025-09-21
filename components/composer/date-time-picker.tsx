'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format, setHours, setMinutes } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'

interface DateTimePickerProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DateTimePicker({
  date,
  onDateChange,
  minDate = new Date(),
  maxDate
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = date ? new Date(date) : new Date()
      newDate.setFullYear(selectedDate.getFullYear())
      newDate.setMonth(selectedDate.getMonth())
      newDate.setDate(selectedDate.getDate())
      onDateChange(newDate)
    }
  }

  const handleTimeChange = (hour: number, minute: number) => {
    const newDate = date || new Date()
    const updated = setMinutes(setHours(newDate, hour), minute)
    onDateChange(updated)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal flex-1",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        <Select
          value={date ? date.getHours().toString() : ''}
          onValueChange={(value) => {
            handleTimeChange(parseInt(value), date?.getMinutes() || 0)
          }}
        >
          <SelectTrigger className="w-[100px]">
            <Clock className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hours.map(hour => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={date ? date.getMinutes().toString() : ''}
          onValueChange={(value) => {
            handleTimeChange(date?.getHours() || 0, parseInt(value))
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map(minute => (
              <SelectItem key={minute} value={minute.toString()}>
                {minute.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}