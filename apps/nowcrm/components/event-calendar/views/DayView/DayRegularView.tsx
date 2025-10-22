"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { isSameDay, format } from "date-fns"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CalendarEventType, EventCalendarConfigType } from "../../types"
import { getEventColor } from "../../utils/getEventColor"
import EventSkeleton from "../shared/EventSkeleton"
import EventPopup from "../../popups/EventPopup/EventPopup"

interface DayViewProps {
  filteredEvents: CalendarEventType[]
  currentDate: Date
  hoverLineRef: React.RefObject<HTMLDivElement>
  hoverTimeRef: React.RefObject<HTMLSpanElement>
  setClickedTime: React.Dispatch<React.SetStateAction<string | null>>
  currentConfig: EventCalendarConfigType
  isAddEventPopupOpen: boolean
  onEventAdd: (event: Omit<CalendarEventType, "id">) => Promise<void>
  onEventUpdate: (event: CalendarEventType) => Promise<void>
  onEventDelete: (eventId: string) => Promise<void>
  is24HourFormat: boolean | undefined
  clickedTime: string | null
  currentTimeLineRef: React.RefObject<HTMLDivElement>
  currentTimeTop: number
  isLoading: boolean
  setIsAddEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
  onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>
}

const DayView: React.FC<DayViewProps> = ({
  filteredEvents,
  currentDate,
  hoverLineRef,
  hoverTimeRef,
  setClickedTime,
  currentConfig,
  isAddEventPopupOpen,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  is24HourFormat,
  clickedTime,
  currentTimeLineRef,
  currentTimeTop,
  isLoading,
  setIsAddEventPopupOpen,
  onDateRangeChange,
}) => {
  const dayEvents = filteredEvents.filter((event) => {
    const eventDate = new Date(event.publish_date)
    return isSameDay(eventDate, currentDate)
  })

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleHourColumnHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const hourHeight = 64 // Height of each hour slot

    let hour, minute, snapY

    if (e.ctrlKey) {
      // Snap to nearest 15 minutes when Ctrl is pressed
      const totalMinutes = Math.round(((y / hourHeight) * 60) / 15) * 15
      hour = Math.floor(totalMinutes / 60)
      minute = totalMinutes % 60
      snapY = (totalMinutes / 60) * hourHeight
    } else {
      // Normal behavior without snapping
      hour = Math.floor(y / hourHeight)
      minute = Math.floor(((y % hourHeight) / hourHeight) * 60)
      snapY = y
    }

    const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

    if (hoverLineRef.current) {
      hoverLineRef.current.style.top = `${snapY}px`
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
    const y = e.clientY - rect.top
    const hourHeight = 64 // Height of each hour slot

    const clickedHour = Math.floor(y / hourHeight)
    const clickedMinute = Math.floor(((y % hourHeight) / hourHeight) * 60)
    const time = `${clickedHour.toString().padStart(2, "0")}:${clickedMinute.toString().padStart(2, "0")}`
    setClickedTime(time)
  }

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAddEventPopupOpen) return
    if (!currentConfig.dayView!.enableDoubleClickToAddEvent) return
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const hourHeight = 64 // Height of each hour slot
    const minutes = Math.floor((y / hourHeight) * 60)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    // const startTime = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`

    const eventDateTime = new Date(currentDate)
    eventDateTime.setHours(hours, mins, 0, 0)

    const newEvent: Omit<CalendarEventType, "id"> = {
      name: "",
      description: "",
      publish_date: eventDateTime, // Pass Date object directly
      color: "blue",
    }

    onEventAdd(newEvent)
  }

  console.log("[v0] DayView - Enhanced Debug Info:")
  console.log("[v0] - Total filtered events:", filteredEvents.length)
  console.log("[v0] - Current date:", currentDate.toDateString())
  console.log("[v0] - Day events found:", dayEvents.length)
  console.log(
    "[v0] - All filtered events:",
    filteredEvents.map((e) => ({
      id: e.id,
      name: e.name,
      datetime: e.publish_date,
      dateString: new Date(e.publish_date).toDateString(),
      isSameDay: isSameDay(new Date(e.publish_date), currentDate),
    })),
  )
  console.log(
    "[v0] - Day events:",
    dayEvents.map((e) => ({
      id: e.id,
      name: e.name,
      datetime: e.publish_date,
      color: e.color,
    })),
  )

  return (
    <Card className="pb-4 pl-4 pr-4">
      <div className="sticky top-0 bg-background z-20 pt-4 pb-1">
        <h2 className="text-xl font-bold mb-4">
          {`${currentConfig.localization!.monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
        </h2>
      </div>
      <ScrollArea className="px-4 h-[570px]">
        <div className="relative mt-2 mb-2">
          <div className="absolute left-0 w-16 z-10 bg-background">
            <EventPopup
              translations={currentConfig.localization!}
              onAddEvent={onEventAdd}
              event={{
                publish_date: clickedTime
                  ? new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      currentDate.getDate(),
                      Number.parseInt(clickedTime.split(":")[0]),
                      Number.parseInt(clickedTime.split(":")[1]),
                    )
                  : new Date(),
              }}
            >
              <div
                onMouseMove={handleHourColumnHover}
                onMouseLeave={handleHourColumnLeave}
                onClick={handleTimeColumnClick}
              >
                {hours.map((hour) => (
                  <div
                    key={`hour-${hour}`}
                    className="cursor-pointer h-16 pr-2 text-right text-sm text-muted-foreground"
                  >
                    {format(new Date().setHours(hour), is24HourFormat ? "HH:mm" : "h a")}
                  </div>
                ))}
              </div>
            </EventPopup>
          </div>
          <div className="ml-16 relative" onDoubleClick={handleDoubleClick}>
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-t border-border"></div>
            ))}
            {!currentConfig.dayView?.hideHoverLine && (
              <div
                ref={hoverLineRef}
                className="absolute left-0 right-0 h-px bg-primary z-40 pointer-events-none"
                style={{ display: "none" }}
              >
                <span
                  ref={hoverTimeRef}
                  className="absolute left-0 transform -translate-x-full -translate-y-1/2 bg-primary text-primary-foreground text-xs px-1 rounded"
                />
              </div>
            )}
            {isSameDay(currentDate, new Date()) && !currentConfig.dayView?.hideTimeline && (
              <div
                ref={currentTimeLineRef}
                className="absolute left-0 right-0 h-px bg-red-500 z-30 pointer-events-none"
                style={{ top: `${currentTimeTop}px` }}
              >
                <span className="absolute left-0 transform -translate-x-full -translate-y-1/2 bg-red-500 text-white text-xs px-1 rounded">
                  {format(new Date(), "HH:mm")}
                </span>
              </div>
            )}
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

            {dayEvents.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="text-xs text-red-500 bg-red-100 p-1 rounded mb-2 pointer-events-auto">
                  DEBUG: Rendering {dayEvents.length} events
                </div>
              </div>
            )}

            {dayEvents.map((event, eventIndex) => {
              const eventDateTime = new Date(event.publish_date)
              const startMinutes = eventDateTime.getHours() * 60 + eventDateTime.getMinutes()
              const topPosition = (startMinutes / 60) * 64 // 64px per hour
              const fixedHeight = 48 // Fixed height in pixels for all events

              console.log(`[v0] Rendering event ${eventIndex + 1}:`, {
                eventName: event.name,
                datetime: event.publish_date,
                eventDateTime: eventDateTime.toString(),
                startMinutes,
                topPosition,
                fixedHeight,
                color: event.color,
                zIndex: eventIndex + 10,
              })

              return (
                <EventPopup
                  key={`${event.id}-${eventDateTime.getTime()}`}
                  event={event}
                  onAddEvent={onEventAdd}
                  onUpdateEvent={onEventUpdate}
                  onDeleteEvent={onEventDelete}
                  onOpenChange={setIsAddEventPopupOpen}
                  dateFromViewClick={currentDate}
                  translations={currentConfig.localization!}
                >
                  <motion.div
                    className={cn(
                      getEventColor(event.color),
                      "absolute px-2 py-1 rounded overflow-hidden cursor-pointer",
                      "transition-colors duration-200",
                      "hover:bg-opacity-40",
                      "dark:hover:bg-opacity-40",
                      "border-2 border-white", // Added visible border for debugging
                    )}
                    style={{
                      top: `${topPosition}px`,
                      height: `${fixedHeight}px`,
                      left: "2px", // Small left margin for visibility
                      width: "calc(100% - 4px)", // Account for left margin
                      zIndex: eventIndex + 10, // Higher z-index to ensure visibility
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
                                  : "#6b7280", // Explicit colors for debugging
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: eventIndex * 0.1 }}
                  >
                    <div className="text-xs font-semibold truncate text-white">
                      {event.name || currentConfig.localization!.untitledEvent}
                    </div>
                    <div className="text-xs text-white">
                      {format(eventDateTime, is24HourFormat ? "HH:mm" : "h:mm a")}
                    </div>
                    {event.description && (
                      <div className="text-xs font-semibold truncate text-white">{event.description}</div>
                    )}
                  </motion.div>
                </EventPopup>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}

export default DayView
