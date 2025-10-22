"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import type { EventCalendarConfigType, CalendarViewType, CalendarEventType } from "../../types"
import { motion } from "framer-motion"
import EventSkeleton from "../shared/EventSkeleton"
import EventPopup from "../../popups/EventPopup/EventPopup"
import EventListPopup from "../../popups/EventListPopup"
import { getEventColor } from "../../utils/getEventColor"

interface MonthBasicViewProps {
  currentDate: Date
  currentConfig: EventCalendarConfigType
  is24HourFormat: boolean | undefined
  setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
  isAddEventPopupOpen: boolean
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
  setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>
  filteredEvents: CalendarEventType[]
  onEventUpdate: (event: CalendarEventType) => Promise<void>
  onEventDelete: (eventId: string) => Promise<void>
  onEventAdd: (event: Omit<CalendarEventType, "id">) => Promise<void>
  isLoading: boolean
  onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>
}

const MonthBasicView: React.FC<MonthBasicViewProps> = ({
  filteredEvents,
  currentDate,
  currentConfig,
  is24HourFormat,
  setIsAddEventPopupOpen,
  isAddEventPopupOpen,
  setCurrentDate,
  setCurrentView,
  onEventUpdate,
  onEventDelete,
  onEventAdd,
  isLoading,
  onDateRangeChange,
}) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const showOnlyCurrentMonth = currentConfig.monthView?.showOnlyCurrentMonth
  const firstDayOfMonth = getDay(monthStart)
  const today = new Date()

  const baseWeekDays = currentConfig.localization!.dayNames

  let dateRange: Date[]
  let adjustedWeekdays: string[]

  if (showOnlyCurrentMonth) {
    dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd })
    // Adjust weekdays based on first day of month only
    adjustedWeekdays = [...baseWeekDays.slice(firstDayOfMonth), ...baseWeekDays.slice(0, firstDayOfMonth)]
  } else {
    // Only apply 24-hour format setting when showing full weeks
    const weekStartsOn = is24HourFormat ? 1 : 0
    const calendarStart = startOfWeek(monthStart, { weekStartsOn })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn })
    dateRange = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    adjustedWeekdays = is24HourFormat ? [...baseWeekDays.slice(1), baseWeekDays[0]] : baseWeekDays
  }

  const handleDayDoubleClick = (day: Date) => {
    if (isAddEventPopupOpen) return
    if (currentConfig.monthView!.enableDoubleClickToShiftViewToWeekly) {
      setCurrentDate(day)
      setCurrentView("week")
    }
  }

  const renderEventItem = (event: CalendarEventType, index: number, day: Date) => {
    return (
      <motion.div
        key={`${event.id}-${index}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <EventPopup
          event={event}
          onAddEvent={onEventAdd}
          onUpdateEvent={onEventUpdate}
          onDeleteEvent={onEventDelete}
          dateFromViewClick={day}
          onOpenChange={setIsAddEventPopupOpen}
          translations={currentConfig.localization!}
        >
        <div
          className={cn(
            getEventColor(event.color),
            "p-1 text-[8px] sm:text-xs rounded mb-1 cursor-pointer select-none",
            "transition-colors duration-200",
            "hover:bg-opacity-40 dark:hover:bg-opacity-40",
            "flex flex-col justify-between h-full"
          )}
        >
          <div className="flex items-center justify-between gap-1">
            <div className="font-semibold truncate">{event.name || "Untitled Event"}</div>

            {event.status && (
              <span
                className={cn(
                  "inline-block px-1 py-[1px] rounded text-[8px] font-semibold whitespace-nowrap",
                  event.status === "published" && "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300",
                  event.status === "scheduled" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300",
                  event.status === "processing" && "bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-300",
                )}
              >
                {event.status}
              </span>
            )}
          </div>
          <div className="hidden sm:block truncate text-[10px] opacity-80 leading-tight">
            {format(event.publish_date, is24HourFormat ? "HH:mm" : "h:mm a")}
          </div>
        </div>
        </EventPopup>
      </motion.div>
    )
  }

  return (
    <Card className="p-2 sm:p-4">
      <ScrollArea>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {adjustedWeekdays.map((day) => (
            <div key={day} className="text-center font-medium text-xs sm:text-sm">
              {day}
            </div>
          ))}
          {dateRange.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentDate)

            // Skip rendering if showing only current month and day is not in current month
            if (showOnlyCurrentMonth && !isCurrentMonth) {
              return <div key={day.toString()} />
            }

            const dayEvents = filteredEvents.filter((event) => isSameDay(event.publish_date, day))

            const isToday = isSameDay(day, today)

            let visibleEvents: CalendarEventType[] = []
            let remainingEvents = 0

            if (dayEvents.length > 0) {
              visibleEvents.push(dayEvents[0])
              remainingEvents = dayEvents.length - 1
            }

            if (remainingEvents > 0) {
              visibleEvents = visibleEvents.slice(0, 1)
            } else if (dayEvents.length > 1 && visibleEvents.length < 2) {
              // If no "+ X more" button and we have space, add another event
              visibleEvents.push(dayEvents[1])
            }

            return (
              <div
                key={day.toString()}
                className={cn(
                  "p-1 sm:p-2 h-[80px] sm:h-[130px] border rounded relative group flex flex-col",
                  !isCurrentMonth && !showOnlyCurrentMonth && "bg-muted/50",
                )}
                onDoubleClick={() => handleDayDoubleClick(day)}
              >
                <div
                  className={cn(
                    "font-semibold mb-1 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm",
                    isToday && "bg-primary text-primary-foreground rounded-full",
                  )}
                >
                  {format(day, "d")}
                </div>
                <div className="flex-grow overflow-hidden">
                  {isLoading && onDateRangeChange && (
                    <EventSkeleton className="absolute top-0 left-0 right-0 h-[2px] dark:h-[1px] animate-pulse bg-primary/20" />
                  )}
                  {visibleEvents.map((event, index) => renderEventItem(event, index, day))}
                  {dayEvents.length === 0 && (
                    <EventPopup
                      translations={currentConfig.localization!}
                      onOpenChange={setIsAddEventPopupOpen}
                      onAddEvent={onEventAdd}
                      event={{ publish_date: day }}
                      onDeleteEvent={onEventDelete}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-1/2 text-[8px] sm:text-xs text-muted-foreground hover:text-foreground transition-opacity truncate px-0.5 sm:px-2 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <span className="hidden sm:inline ml-1">{currentConfig.localization!.addEvent}</span>
                      </Button>
                    </EventPopup>
                  )}
                </div>
                {remainingEvents > 0 && (
                  <EventListPopup
                    translations={currentConfig.localization!}
                    events={dayEvents}
                    date={day}
                    addEvent={onEventAdd}
                    updateEvent={onEventUpdate}
                    onDelete={onEventDelete}
                    is24HourFormat={is24HourFormat}
                    getEventColor={getEventColor}
                    onOpenChange={setIsAddEventPopupOpen}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full gap-1 text-[8px] sm:text-xs text-muted-foreground hover:text-foreground mt-auto sm:mt-1 truncate px-0.5 sm:px-2 h-5 sm:h-8"
                      >
                        <span>+{remainingEvents}</span>
                        <span className="hidden sm:inline"> {currentConfig.localization!.more}</span>
                      </Button>
                    </motion.div>
                  </EventListPopup>
                )}

                {dayEvents.length === 1 && (
                  <EventPopup
                    translations={currentConfig.localization!}
                    onOpenChange={setIsAddEventPopupOpen}
                    onAddEvent={onEventAdd}
                    event={{ publish_date: day }}
                    onDeleteEvent={onEventDelete}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-1 text-[8px] sm:text-xs text-muted-foreground hover:text-foreground mt-auto sm:mt-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity truncate px-0.5 sm:px-2 "
                    >
                      <span className="font-bold">+</span>
                      <span className="hidden sm:inline">{currentConfig.localization!.addEvent}</span>
                    </Button>
                  </EventPopup>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default MonthBasicView
