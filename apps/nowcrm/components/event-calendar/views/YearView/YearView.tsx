"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  format,
} from "date-fns"
import type { CalendarEventType, EventCalendarConfigType, CalendarViewType } from "../../types"
import EventSkeleton from "../shared/EventSkeleton"
import EventListPopup from "../../popups/EventListPopup"
import { getEventColor } from "../../utils/getEventColor"

interface YearViewProps {
  filteredEvents: CalendarEventType[]
  currentDate: Date
  isAddEventPopupOpen: boolean
  currentConfig: EventCalendarConfigType
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
  setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>
  is24HourFormat: boolean | undefined
  isLoading: boolean
  setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
  onEventUpdate: (event: CalendarEventType) => Promise<void>
  onEventDelete: (eventId: string) => Promise<void>
  onEventAdd: (event: Omit<CalendarEventType, "id">) => Promise<void>
  onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>
}

const YearView: React.FC<YearViewProps> = ({
  currentConfig,
  currentDate,
  filteredEvents,
  isAddEventPopupOpen,
  setCurrentDate,
  setCurrentView,
  is24HourFormat,
  isLoading,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  setIsAddEventPopupOpen,
  onDateRangeChange,
}) => {
  const yearStart = startOfYear(currentDate)
  const yearEnd = endOfYear(currentDate)
  const monthRange = eachMonthOfInterval({ start: yearStart, end: yearEnd })

  const getEventColors = (day: Date) => {
    return filteredEvents
      .filter((event) => {
        const eventDate = new Date(event.publish_date)
        return isSameDay(eventDate, day)
      })
      .map((event) => getEventColor(event.color))
  }

  const handleMonthDoubleClick = (month: Date) => {
    if (isAddEventPopupOpen) return
    if (currentConfig.yearView!.enableDoubleClickToShiftViewToMonthly) {
      setCurrentDate(month)
      setCurrentView("month")
    }
  }

  const weekStartsOn = is24HourFormat ? 1 : 0 // 1 for Monday, 0 for Sunday
  const weekDays = is24HourFormat
    ? currentConfig.localization!.dayNames.slice(1).concat(currentConfig.localization!.dayNames[0])
    : currentConfig.localization!.dayNames

  return (
    <Card className="p-4">
      <ScrollArea>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading && onDateRangeChange && (
            <EventSkeleton className="absolute top-0 left-0 right-0 h-[2px] dark:h-[1px] animate-pulse bg-primary/20" />
          )}
          {monthRange.map((month) => {
            const firstDayOfMonth = startOfMonth(month)
            const lastDayOfMonth = endOfMonth(month)
            const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth })
            const firstDayOfWeek = getDay(firstDayOfMonth)
            const adjustedFirstDayOfWeek = (firstDayOfWeek - weekStartsOn + 7) % 7

            return (
              <div
                key={month.toString()}
                className="border rounded p-2"
                onDoubleClick={() => handleMonthDoubleClick(month)}
              >
                <h3 className="text-lg font-semibold mb-2 text-center">
                  {currentConfig.localization!.monthNames[month.getMonth()]}
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day, index) => (
                    <div
                      key={`${month.toString()}-${day}-${index}`}
                      className="text-center text-xs text-muted-foreground"
                    >
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.charAt(0)}</span>
                    </div>
                  ))}
                  {Array.from({ length: adjustedFirstDayOfWeek }).map((_, index) => (
                    <div key={`empty-start-${index}`} className="h-6 w-6" />
                  ))}
                  {daysInMonth.map((day) => {
                    const eventColors = getEventColors(day)
                    const isToday = isSameDay(day, new Date())
                    const dayEvents = filteredEvents.filter((event) => {
                      const eventDate = new Date(event.publish_date)
                      return isSameDay(eventDate, day)
                    })

                    return (
                      <EventListPopup
                        key={day.toString()}
                        events={dayEvents}
                        addEvent={onEventAdd}
                        updateEvent={onEventUpdate}
                        onDelete={onEventDelete}
                        onOpenChange={setIsAddEventPopupOpen}
                        date={day}
                        is24HourFormat={is24HourFormat}
                        getEventColor={getEventColor}
                        translations={currentConfig.localization!}
                      >
                        <div
                          className={cn(
                            "h-6 w-6 flex items-center justify-center text-xs cursor-pointer",
                            "text-foreground",
                          )}
                        >
                          <div
                            className={cn(
                              "h-5 w-5 flex items-center justify-center rounded-full relative",
                              "transition-all duration-200 ease-in-out",
                              isToday && "bg-accent text-accent-foreground",
                              eventColors.length > 0
                                ? "hover:scale-150 hover:z-10"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700",
                            )}
                          >
                            {eventColors.length > 0 ? (
                              <div className="absolute inset-0 rounded-full overflow-hidden">
                                {eventColors.map((color, colorIndex) => (
                                  <div
                                    key={`${day.toString()}-${colorIndex}`}
                                    className={`absolute inset-0 ${color}`}
                                    style={{
                                      backgroundColor: color.split(" ")[1],
                                      clipPath: `polygon(${colorIndex * (100 / eventColors.length)}% 0%, ${(colorIndex + 1) * (100 / eventColors.length)}% 0%, ${(colorIndex + 1) * (100 / eventColors.length)}% 100%, ${colorIndex * (100 / eventColors.length)}% 100%)`,
                                    }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="absolute inset-0 rounded-full transition-opacity opacity-0 hover:opacity-100 bg-gray-200 dark:bg-gray-700" />
                            )}
                            <time dateTime={format(day, "yyyy-MM-dd")} className="relative z-10">
                              {format(day, "d")}
                            </time>
                          </div>
                        </div>
                      </EventListPopup>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default YearView
