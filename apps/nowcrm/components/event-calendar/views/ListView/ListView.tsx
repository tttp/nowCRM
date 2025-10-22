"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  compareAsc,
  format,
} from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, CalendarIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import EventPopup from "../../popups/EventPopup/EventPopup"
import type { CalendarEventType, CalendarViewType, EventCalendarConfigType } from "../../types"
import { getEventColor } from "../../utils/getEventColor"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ListViewProps {
  filteredEvents: CalendarEventType[]
  currentView: CalendarViewType
  currentDate: Date
  listSearchTerm: string
  setListSearchTerm: React.Dispatch<React.SetStateAction<string>>
  currentConfig: EventCalendarConfigType
  onEventUpdate: (event: CalendarEventType) => Promise<void>
  onEventDelete: (eventId: string) => Promise<void>
  onEventAdd: (event: Omit<CalendarEventType, "id">) => Promise<void>
  is24HourFormat: boolean
  isLoading: boolean
}

const ListView: React.FC<ListViewProps> = ({
  filteredEvents,
  currentView,
  currentDate,
  listSearchTerm,
  setListSearchTerm,
  currentConfig,
  onEventUpdate,
  onEventDelete,
  onEventAdd,
  is24HourFormat,
  isLoading,
}) => {
  let startDate: Date
  let endDate: Date

  switch (currentView) {
    case "day":
      startDate = startOfDay(currentDate)
      endDate = endOfDay(currentDate)
      break
    case "week":
      startDate = startOfWeek(currentDate)
      endDate = endOfWeek(currentDate)
      break
    case "month":
      startDate = startOfMonth(currentDate)
      endDate = endOfMonth(currentDate)
      break
    case "year":
      startDate = startOfYear(currentDate)
      endDate = endOfYear(currentDate)
      break
    default:
      startDate = startOfDay(currentDate)
      endDate = endOfDay(currentDate)
  }

  const filteredAndSearchedEvents = filteredEvents
    .filter((event) => {
      // Simple date filtering based on the single datetime field
      const eventDate = startOfDay(event.publish_date)
      return isWithinInterval(eventDate, { start: startDate, end: endDate })
    })
    .filter(
      (event) =>
        event.name.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(listSearchTerm.toLowerCase())),
    )
    .sort((a, b) => compareAsc(a.publish_date, b.publish_date))

  const getEventDateInfo = (event: CalendarEventType) => {
    const eventDate = event.publish_date
    const dateInfo = format(eventDate, "MMM d, yyyy")
    const timeInfo = format(eventDate, is24HourFormat ? "HH:mm" : "h:mm a")

    return { dateInfo, timeInfo }
  }

  return (
    <Card className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="relative">
          <AnimatePresence initial={false} mode="wait">
            {listSearchTerm ? (
              <motion.div
                key="clearButton"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-2.5 top-[0.6rem] transform -translate-y-1/2 flex items-center justify-center"
              >
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => setListSearchTerm("")}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="searchIcon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute left-2.5 top-[0.75rem] transform -translate-y-1/2 flex items-center justify-center"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
          <Input
            type="text"
            placeholder={currentConfig.localization!.searchEvents}
            value={listSearchTerm}
            onChange={(e) => setListSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </motion.div>
      <ScrollArea className="h-[600px]">
        <AnimatePresence initial={true}>
          {filteredAndSearchedEvents.map((event) => {
            const { dateInfo, timeInfo } = getEventDateInfo(event)
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <EventPopup
                  event={event}
                  onAddEvent={onEventAdd}
                  onUpdateEvent={onEventUpdate}
                  onDeleteEvent={onEventDelete}
                  dateFromViewClick={currentDate}
                  translations={currentConfig.localization!}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg cursor-pointer mb-2",
                      getEventColor(event.color),
                      "hover:opacity-80 transition-opacity",
                    )}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold">{dateInfo}</span>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <CalendarIcon className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Event time: {timeInfo}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span>{timeInfo}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mt-2">{event.name || "Untitled Event"}</h3>
                    {event.description && <p className="mt-1 text-sm">{event.description}</p>}
                  </div>
                </EventPopup>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {!isLoading && filteredAndSearchedEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-8"
          >
            {listSearchTerm
              ? currentConfig.localization!.noEvents
              : `${currentConfig.localization!.noEvents} ${currentConfig.localization![currentView]}`}
          </motion.div>
        )}
      </ScrollArea>
    </Card>
  )
}

export default ListView
