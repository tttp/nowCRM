"use client"

import type React from "react"

import { eachDayOfInterval, endOfWeek, format, getWeek, isSameDay, startOfWeek } from "date-fns"
import type { CalendarEventType, EventCalendarConfigType, CalendarViewType } from "../../types"
import { cn } from "@/lib/utils"
import { getEventColor } from "../../utils/getEventColor"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import EventSkeleton from "../shared/EventSkeleton"
import EventPopup from "../../popups/EventPopup/EventPopup"

interface WeekRegularViewProps {
  filteredEvents: CalendarEventType[]
  currentDate: Date
  is24HourFormat: boolean | undefined
  hoverLineRef: React.RefObject<HTMLDivElement>
  hoverTimeRef: React.RefObject<HTMLSpanElement>
  setClickedTime: React.Dispatch<React.SetStateAction<string | null>>
  clickedTime: string | null
  isAddEventPopupOpen: boolean
  currentConfig: EventCalendarConfigType
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
  setCurrentView: React.Dispatch<React.SetStateAction<CalendarViewType>>
  onEventUpdate: (event: CalendarEventType) => Promise<void>
  onEventDelete: (eventId: string) => Promise<void>
  onEventAdd: (event: Omit<CalendarEventType, "id">) => Promise<void>
  setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  currentTimeLineRef: React.RefObject<HTMLDivElement>
  currentTimeTop: number
  onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>
}

const WeekRegularView: React.FC<WeekRegularViewProps> = ({
  filteredEvents,
  currentDate,
  is24HourFormat,
  hoverLineRef,
  hoverTimeRef,
  setClickedTime,
  clickedTime,
  isAddEventPopupOpen,
  currentConfig,
  setCurrentDate,
  setCurrentView,
  onEventUpdate,
  onEventDelete,
  onEventAdd,
  setIsAddEventPopupOpen,
  isLoading,
  currentTimeLineRef,
  currentTimeTop,
  onDateRangeChange,
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: is24HourFormat ? 1 : 0 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: is24HourFormat ? 1 : 0 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const weekNumber = getWeek(weekStart, { weekStartsOn: is24HourFormat ? 1 : 0 })

  console.log("[v0] WeekView - Enhanced Debug Info:")
  console.log("[v0] - Total filtered events:", filteredEvents.length)
  console.log("[v0] - Week start:", weekStart.toDateString())
  console.log("[v0] - Week end:", weekEnd.toDateString())
  console.log(
    "[v0] - Week days:",
    weekDays.map((d) => d.toDateString()),
  )
  console.log(
    "[v0] - All filtered events:",
    filteredEvents.map((e) => ({
      id: e.id,
      name: e.name,
      datetime: e.publish_date,
      dateString: new Date(e.publish_date).toDateString(),
    })),
  )

  const handleHourColumnHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const headerHeight = 48 // Adjust this value based on your actual header height
    const y = e.clientY - rect.top - headerHeight
    const hourHeight = 64 // Height of each hour slot

    // Ensure y is not negative
    const adjustedY = Math.max(0, y)

    let hour, minute, snapY

    if (e.ctrlKey) {
      // Snap to nearest 15 minutes when Ctrl is pressed
      const totalMinutes = Math.round(((adjustedY / hourHeight) * 60) / 15) * 15
      hour = Math.floor(totalMinutes / 60)
      minute = totalMinutes % 60
      snapY = (totalMinutes / 60) * hourHeight
    } else {
      // Normal behavior without snapping
      hour = Math.floor(adjustedY / hourHeight)
      minute = Math.floor(((adjustedY % hourHeight) / hourHeight) * 60)
      snapY = adjustedY
    }

    const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

    if (hoverLineRef.current) {
      hoverLineRef.current.style.top = `${snapY + headerHeight}px`
      hoverLineRef.current.style.display = "block"
    }
    if (hoverTimeRef.current) {
      hoverTimeRef.current.textContent = time
    }
  }

  const handleHourColumnLeave = () => {
    if (hoverLineRef.current) {
      hoverLineRef.current.style.display = "none"
    }
  }

  const handleTimeColumnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const headerHeight = 48 // Adjust this value based on your actual header height
    const y = e.clientY - rect.top - headerHeight
    const hourHeight = 64 // Height of each hour slot

    // Ensure y is not negative
    const adjustedY = Math.max(0, y)

    const clickedHour = Math.floor(adjustedY / hourHeight)
    const clickedMinute = Math.floor(((adjustedY % hourHeight) / hourHeight) * 60)
    const time = `${clickedHour.toString().padStart(2, "0")}:${clickedMinute.toString().padStart(2, "0")}`
    setClickedTime(time)
  }

  const handleDayDoubleClick = (day: Date) => {
    if (isAddEventPopupOpen) return
    if (currentConfig.weekView!.enableDoubleClickToShiftViewToDaily) {
      setCurrentDate(day)
      setCurrentView("day")
    }
  }

  const isEventInDay = (event: CalendarEventType, day: Date) => {
    const eventDate = new Date(event.publish_date)
    return isSameDay(eventDate, day)
  }

  const getEventPositionForDay = (event: CalendarEventType, day: Date) => {
    const eventDateTime = new Date(event.publish_date)
    const startHour = eventDateTime.getHours() + eventDateTime.getMinutes() / 60
    const fixedHeight = 48 // Fixed height in pixels for all events

    return {
      top: startHour * 64, // 64px per hour
      height: fixedHeight, // Fixed height instead of duration-based
    }
  }

  return (
    <Card className="p-4">
      <ScrollArea className="h-[600px]">
        <div className="relative mb-2">
          <div className="grid grid-cols-8 gap-0">
            {/* Time column */}
            <EventPopup
              event={{
                publish_date: clickedTime
                  ? new Date(
                      weekStart.getFullYear(),
                      weekStart.getMonth(),
                      weekStart.getDate(),
                      Number.parseInt(clickedTime.split(":")[0]),
                      Number.parseInt(clickedTime.split(":")[1]),
                    )
                  : new Date(),
              }}
              onAddEvent={onEventAdd}
              dateFromViewClick={weekStart}
              translations={currentConfig.localization!}
            >
              <div
                className="sticky top-0 left-0 z-30 bg-background"
                onMouseMove={handleHourColumnHover}
                onMouseLeave={handleHourColumnLeave}
                onClick={handleTimeColumnClick}
              >
                <div className="sticky top-0 left-0 bg-background h-12 border-b border-r border-border flex items-center justify-center">
                  <span className="text-xs font-semibold text-muted-foreground  bg-background">Week {weekNumber}</span>
                </div>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="cursor-pointer h-16 pr-2 text-center text-sm text-muted-foreground border-r border-border"
                  >
                    {format(new Date().setHours(hour), is24HourFormat ? "HH:mm" : "h a")}
                  </div>
                ))}
              </div>
            </EventPopup>
            {/* Days columns */}
            <div className="col-span-7 relative z-20">
              <div className="grid grid-cols-7 gap-0">
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = filteredEvents.filter((event) => isEventInDay(event, day))

                  console.log(`[v0] WeekView day ${dayIndex + 1} (${day.toDateString()}):`, {
                    dayEvents: dayEvents.length,
                    events: dayEvents.map((e) => ({
                      id: e.id,
                      name: e.name,
                      datetime: e.publish_date,
                      color: e.color,
                    })),
                  })

                  return (
                    <div key={day.toString()} className="relative" onDoubleClick={() => handleDayDoubleClick(day)}>
                      <div className="sticky top-0 z-30 bg-background h-12 flex items-center justify-center border-b border-border">
                        <div className="text-center">
                          <div className="text-xs font-semibold">
                            {currentConfig.localization!.dayNames[day.getDay()].slice(0, 3)}
                          </div>
                          <div
                            className={`text-sm ${isSameDay(day, new Date()) ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto" : ""}`}
                          >
                            {format(day, "d")}
                          </div>
                        </div>
                      </div>
                      <div className="relative h-[calc(100%-3rem)]">
                        {hours.map((hour, index) => (
                          <div
                            key={hour}
                            className={cn(
                              "h-16",
                              index !== 0 && "border-t border-border",
                              index === hours.length - 1 && "border-b border-border",
                            )}
                          />
                        ))}

                        {dayEvents.length > 0 && (
                          <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
                            <div className="text-xs text-red-500 bg-red-100 p-1 rounded">{dayEvents.length} events</div>
                          </div>
                        )}

                        {dayEvents.map((event, eventIndex) => {
                          const { top, height } = getEventPositionForDay(event, day)
                          const eventDateTime = new Date(event.publish_date)

                          console.log(`[v0] Week event ${eventIndex + 1} positioning:`, {
                            eventName: event.name,
                            datetime: event.publish_date,
                            eventDateTime: eventDateTime.toString(),
                            top,
                            height,
                            color: event.color,
                            zIndex: eventIndex + 10,
                          })

                          return (
                            <EventPopup
                              key={`${event.id}-${day.toISOString()}`}
                              event={event}
                              onAddEvent={onEventAdd}
                              onUpdateEvent={onEventUpdate}
                              onDeleteEvent={onEventDelete}
                              onOpenChange={setIsAddEventPopupOpen}
                              dateFromViewClick={day}
                              translations={currentConfig.localization!}
                            >
                              <motion.div
                                className={cn(
                                  getEventColor(event.color),
                                  "absolute px-1 py-1 rounded overflow-hidden cursor-pointer",
                                  "transition-colors duration-200",
                                  "hover:bg-opacity-40 dark:hover:bg-opacity-40",
                                  "border-2 border-white", // Added visible border for debugging
                                )}
                                style={{
                                  top: `${top}px`,
                                  height: `${height}px`,
                                  left: "2px", // Small left margin for visibility
                                  width: "calc(100% - 4px)", // Account for margins
                                  zIndex: eventIndex + 10, // Higher z-index
                                  minHeight: "48px", // Ensure minimum height
                                  backgroundColor:
                                    event.color === "blue"
                                      ? "#3b82f6"
                                      : event.color === "red"
                                        ? "#ef4444"
                                        : event.color === "green"
                                          ? "#10b981"
                                          : event.color === "yellow"
                                            ? "#f59e0b"
                                            : event.color === "purple"
                                              ? "#8b5cf6"
                                              : "#6b7280", // Explicit colors
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: eventIndex * 0.1 }}
                              >
                                <div className="text-xs font-semibold truncate text-white">
                                  {event.name || "Untitled Event"}
                                </div>
                                <div className="text-xs text-white">
                                  {format(eventDateTime, is24HourFormat ? "HH:mm" : "h:mm a")}
                                </div>
                                {event.description && (
                                  <div className="text-xs truncate text-white">{event.description}</div>
                                )}
                              </motion.div>
                            </EventPopup>
                          )
                        })}
                        {isLoading &&
                          onDateRangeChange &&
                          Array.from({ length: 10 }).map((_, index) => (
                            <EventSkeleton
                              key={index}
                              className="absolute top-0 left-0 right-0 h-[3px] dark:h-[1px] animate-pulse bg-primary/20"
                              style={{
                                top: `${index * 64}px`,
                              }}
                            />
                          ))}
                      </div>
                      {dayIndex < weekDays.length - 1 && (
                        <div className="absolute top-12 right-0 w-px h-[calc(100%-3rem)] bg-border" />
                      )}
                    </div>
                  )
                })}
                <div className="absolute top-0 right-0 w-px h-full bg-border" />
              </div>
            </div>
          </div>

          {!currentConfig.weekView?.hideHoverLine && (
            <div
              ref={hoverLineRef}
              className="absolute left-[12.5%] right-0 h-px bg-primary z-50 pointer-events-none"
              style={{ display: "none" }}
            >
              <span
                ref={hoverTimeRef}
                className="absolute left-0 transform -translate-x-full -translate-y-1/2 bg-primary text-primary-foreground text-xs px-1 rounded"
              />
            </div>
          )}
          {weekDays.some((day) => isSameDay(day, new Date())) && !currentConfig.weekView?.hideTimeline && (
            <div
              ref={currentTimeLineRef}
              className="absolute left-[12.5%] right-0 h-px bg-red-500 z-40 pointer-events-none"
              style={{
                top: `${currentTimeTop + 48}px`, // 48px is the header height
              }}
            >
              <span className="absolute left-0 transform -translate-x-full -translate-y-1/2 bg-red-500 text-white text-xs px-1 rounded">
                {format(new Date(), "HH:mm")}
              </span>
              {/* Vertical line indicators for current day column */}
              {weekDays.map(
                (day, index) =>
                  isSameDay(day, new Date()) && (
                    <div
                      key={day.toString()}
                      className="absolute h-4 w-[1px] bg-red-500 transform -translate-y-1/2 opacity-75"
                      style={{
                        left: `${(100 / 7) * index}%`,
                        boxShadow: "0 0 4px rgba(239, 68, 68, 0.5)", // subtle glow effect
                      }}
                    />
                  ),
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default WeekRegularView
