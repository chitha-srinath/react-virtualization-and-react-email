"use client"

import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { cn } from "@/lib/utils"
import { DayPicker } from "react-day-picker"
import type { DayPickerProps } from "react-day-picker"

interface CalendarWithSelectProps extends Omit<DayPickerProps, 'month' | 'onMonthChange'> {
  className?: string
}

export function CalendarWithSelect({ className, ...props }: CalendarWithSelectProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  // Generate years array (current year ± 50 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i)

  // Month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(Number.parseInt(monthIndex))
    setCurrentMonth(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth)
    newDate.setFullYear(Number.parseInt(year))
    setCurrentMonth(newDate)
  }

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(currentMonth.getMonth() - 1)
    setCurrentMonth(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(currentMonth.getMonth() + 1)
    setCurrentMonth(newDate)
  }

  return (
    <div className={cn("p-3", className)}>
      {/* Custom Header with Select Components */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8 bg-transparent">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Component */}
      <DayPicker
        {...(props as DayPickerProps)}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={true}
        className="p-0"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "hidden", // Hide default caption since we have custom header
          caption_label: "text-sm font-medium",
          nav: "hidden", // Hide default navigation
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-2",
          head_row: "grid grid-cols-7 gap-0 w-full flex justify-center",
          head_cell:
            "text-muted-foreground rounded-md w-12 h-10 font-normal text-[0.8rem] flex items-center justify-center",
          row: "grid grid-cols-7 gap-0 mt-3 w-full flex justify-center",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-12 h-10 flex items-center justify-center [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            (props as any).mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md",
          ),
          day: "h-10 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}/>
    </div>
  )
}
