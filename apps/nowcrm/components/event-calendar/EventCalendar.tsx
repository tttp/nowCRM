"use client"

/**
 * EventCalendar Component
 *
 * A flexible and feature-rich calendar component for React applications that supports
 * multiple view types and comprehensive event management.
 */

import type React from "react"
import { useState } from "react"

import type { CalendarEventType, EventCalendarConfigType } from "./types"
import { EVENT_COLOR_OPTIONS } from "./constants/eventColors"
import { useSwipeable } from "react-swipeable"
import { useCalendarNavigation } from "./hooks/useCalendarNavigation"
import { useTouchDevice } from "./hooks/useTouchDevice"

import CalendarHeader from "./views/CalendarHeader/CalendarHeader"
import CalendarView from "./views/CalendarView"
import { defaultConfig } from "./utils/defaultConfig"

export interface EventCalendarProps {
  config?: EventCalendarConfigType
  events: CalendarEventType[]
  isLoading?: boolean
  onEventAdd: (event: Omit<CalendarEventType, "id">) => Promise<void>
  onEventUpdate: (event: CalendarEventType) => Promise<void>
  onEventDelete: (eventId: string) => Promise<void>
  onDateRangeChange?: (startDate: Date, endDate: Date, signal?: AbortSignal) => Promise<void>
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  config,
  events,
  isLoading = false,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  onDateRangeChange,
}) => {
  const currentConfig: EventCalendarConfigType = {
    ...defaultConfig,
    ...config,
    // Ensure localization is never undefined
    localization: config?.localization || defaultConfig.localization,
  }

  // Navigation states & functions
  const navigation = useCalendarNavigation({
    config: {
      defaultView: currentConfig.defaultView || "month",
      use24HourFormatByDefault: currentConfig.use24HourFormatByDefault || false,
    },
    translations: currentConfig.localization!,
  })

  // Shared States between CalenderHeader & CalendarView
  const [isListView, setIsListView] = useState(false)
  const [listSearchTerm, setListSearchTerm] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>(EVENT_COLOR_OPTIONS.map((color) => color.value))
  const filteredEvents = events.filter((event) => selectedColors.includes(event.color))
  // Swipe Effect
  const isTouchDevice = useTouchDevice()
  const handlers = useSwipeable({
    onSwipedLeft: () => navigation.handleNext(),
    onSwipedRight: () => navigation.handlePrevious(),
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: {
      left: 100,
      right: 100,
    },
    swipeDuration: 150,
    touchEventOptions: {
      passive: true,
    },
    trackTouch: true,
  })

  const sharedProps = {
    ...navigation,
    currentConfig,
    onEventAdd,
    onEventDelete,
    isListView,
  }

  return (
    <div {...(isTouchDevice ? handlers : {})}>
      <CalendarHeader
        {...sharedProps}
        setIsListView={setIsListView}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
      />
      <CalendarView
        {...sharedProps}
        is24HourFormat={navigation.use24HourFormat}
        filteredEvents={filteredEvents}
        listSearchTerm={listSearchTerm}
        setListSearchTerm={setListSearchTerm}
        onEventUpdate={onEventUpdate}
        isLoading={isLoading}
        onDateRangeChange={onDateRangeChange}
      />
    </div>
  )
}

export default EventCalendar
