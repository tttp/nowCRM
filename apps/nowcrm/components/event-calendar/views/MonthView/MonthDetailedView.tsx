"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  startOfMonth,
  endOfMonth,
  getDay,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns"
import type { CalendarEventType, EventCalendarConfigType, CalendarViewType } from "../../types"
import { motion } from "framer-motion"
import EventSkeleton from "../shared/EventSkeleton"
import EventPopup from "../../popups/EventPopup/EventPopup"
import EventListPopup from "../../popups/EventListPopup"
import { getEventColor } from "../../utils/getEventColor"

interface MonthDetailedViewProps {
  filteredEvents: CalendarEventType[]
  onEventUpdate: (event: CalendarEventType) => Promise<void>
  onEventDelete: (eventId: string) => Promise<void>
  onEventAdd: (event: Omit<CalendarEventType, "id">) => Promise<void>
  isLoading: boolean

  currentDate: Date
  currentConfig: EventCalendarConfigType
  is24HourFormat: boolean | undefined
  isAddEventPopupOpen: boolean
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
  setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>
  setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
  onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>
}

const MonthDetailedView: React.FC<MonthDetailedViewProps> = ({
  filteredEvents,
  onEventUpdate,
  onEventDelete,
  onEventAdd,
  isLoading,
  currentDate,
  currentConfig,
  is24HourFormat,
  isAddEventPopupOpen,
  setCurrentDate,
  setCurrentView,
  setIsAddEventPopupOpen,
  onDateRangeChange,
}) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const showOnlyCurrentMonth = currentConfig.monthView?.showOnlyCurrentMonth
  const firstDayOfMonth = getDay(monthStart)
  const today = new Date()

  // Base weekdays array
  const baseWeekDays = currentConfig.localization!.dayNames

  // Determine date range and weekdays based on display mode
  let dateRange: Date[]
  let adjustedWeekDays: string[]

  if (showOnlyCurrentMonth) {
    dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd })
    // Adjust weekdays based on first day of month only
    adjustedWeekDays = [...baseWeekDays.slice(firstDayOfMonth), ...baseWeekDays.slice(0, firstDayOfMonth)]
  } else {
    // Only apply 24-hour format setting when showing full weeks
    const weekStartsOn = is24HourFormat ? 1 : 0
    const calendarStart = startOfWeek(monthStart, { weekStartsOn })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn })
    dateRange = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    adjustedWeekDays = is24HourFormat ? [...baseWeekDays.slice(1), baseWeekDays[0]] : baseWeekDays
  }

  const weeks = Math.ceil(dateRange.length / 7)

  const handleDayDoubleClick = (day: Date) => {
    if (isAddEventPopupOpen) return
    if (currentConfig.monthView!.enableDoubleClickToShiftViewToWeekly) {
      setCurrentDate(day)
      setCurrentView("week")
    }
  }

  const getEventsForDay = (day: Date) => {
    const eventsForDay = filteredEvents.filter((event) => {
      const eventDate = new Date(event.publish_date)
      return isSameDay(eventDate, day)
    })

    return eventsForDay.sort((a, b) => {
      const timeA = new Date(a.publish_date).getTime()
      const timeB = new Date(b.publish_date).getTime()
      return timeA - timeB
    })
  }

  return (
    <Card className="p-2 sm:p-4">
      <ScrollArea>
        <div className="w-full">
          <div className="grid grid-cols-7 border-b">
            {adjustedWeekDays.map((day) => (
              <div key={day} className="text-center font-medium text-xs sm:text-sm p-2">
                {day}
              </div>
            ))}
          </div>

          {Array.from({ length: weeks }).map((_, weekIndex) => {
            const weekDays = dateRange.slice(weekIndex * 7, (weekIndex + 1) * 7)

            return (
              <div key={weekIndex} className="grid grid-cols-7">
                {weekDays.map((day, dayIndex) => {
                  const isToday = isSameDay(day, today)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const dayEvents = getEventsForDay(day)

                  // Skip rendering if showing only current month and day is not in current month
                  if (showOnlyCurrentMonth && !isCurrentMonth) {
                    return <div key={day.toString()} />
                  }

                  return (
                    <div
                      key={day.toString()}
                      className={cn(
                        "group min-h-[145px] border-b border-r p-1 relative",
                        "transition-colors duration-200",
                        !isCurrentMonth && "bg-muted/50",
                        dayIndex === 0 && "border-l",
                      )}
                      onDoubleClick={() => handleDayDoubleClick(day)}
                    >
                      {isLoading && onDateRangeChange && (
                        <EventSkeleton className="absolute top-0 left-0 right-0 h-[2px] dark:h-[1px] animate-pulse bg-primary/20" />
                      )}

                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            "font-semibold w-6 h-6 flex items-center justify-center text-xs sm:text-sm rounded-full",
                            isToday && "bg-primary text-primary-foreground",
                          )}
                        >
                          {format(day, "d")}
                        </div>
                        <EventPopup
                          translations={currentConfig.localization!}
                          onOpenChange={setIsAddEventPopupOpen}
                          onAddEvent={onEventAdd}
                          event={{ publish_date: day }}
                          dateFromViewClick={day}
                          onDeleteEvent={onEventDelete}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-muted-foreground px-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          >
                            <span className="ml-1 hidden sm:inline">{currentConfig.localization!.addEvent}</span>
                          </Button>
                        </EventPopup>
                      </div>

                      <div className="space-y-1 mt-1 overflow-y-auto">
                        {dayEvents.slice(0, dayEvents.length > 4 ? 3 : 4).map((event, index) => {
                          return (
                            <motion.div
                              key={`${event.id}-${index}`}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <EventPopup
                                translations={currentConfig.localization!}
                                onAddEvent={onEventAdd}
                                onUpdateEvent={onEventUpdate}
                                event={event}
                                dateFromViewClick={day}
                                onDeleteEvent={onEventDelete}
                                onOpenChange={setIsAddEventPopupOpen}
                              >
                                <div
                                  className={cn(
                                    getEventColor(event.color),
                                    "text-xs p-1 min-h-[24px] rounded cursor-pointer",
                                    "hover:opacity-80 transition-opacity",
                                    "flex items-center justify-between gap-1",
                                  )}
                                >
                                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                                    {event.name}
                                  </span>
                                  <span className="text-[10px] opacity-75 whitespace-nowrap">
                                    {format(new Date(event.publish_date), is24HourFormat ? "HH:mm" : "h:mm a")}
                                  </span>
                                </div>
                              </EventPopup>
                            </motion.div>
                          )
                        })}
                        {dayEvents.length > 4 && (
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
                                className="w-full h-6 text-xs text-muted-foreground hover:text-foreground truncate px-2"
                              >
                                +{dayEvents.length - 3} {currentConfig.localization!.more}
                              </Button>
                            </motion.div>
                          </EventListPopup>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default MonthDetailedView
