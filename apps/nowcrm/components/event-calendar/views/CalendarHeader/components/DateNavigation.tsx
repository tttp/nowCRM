"use client"

import type React from "react"

/**
 * DateNavigation Component
 *
 * Handles all date-related navigation and switching functionality for the calendar header.
 */

import DaySwitcher from "@/components/event-calendar/switchers/DaySwitcher"
import MonthSwitcher, { type Month } from "@/components/event-calendar/switchers/MonthSwitcher"
import YearSwitcher from "@/components/event-calendar/switchers/YearSwitcher"
import type { EventCalendarConfigType } from "@/components/event-calendar/types"
import type { CalendarViewType } from "@/components/event-calendar/types/CalendarViewType"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DateNavigationProps {
  currentDate: Date
  currentView: CalendarViewType
  handlePrevious: () => void
  handleNext: () => void
  lastUpdated: "day" | "month" | "year" | null
  animationDirection: "up" | "down"
  months: Month[]
  handleDayChange: (date: Date) => void
  handleMonthChange: (month: Month) => void
  handleYearChange: (year: number) => void
  currentConfig: EventCalendarConfigType
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  currentDate,
  currentView,
  handlePrevious,
  handleNext,
  lastUpdated,
  animationDirection,
  months,
  handleDayChange,
  handleMonthChange,
  handleYearChange,
  currentConfig,
}) => {
  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <Button variant="ghost" onClick={handlePrevious} size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <AnimatePresence mode="sync">
        {currentView === "day" && (
          <motion.div
            key="day-switcher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DaySwitcher
              translations={currentConfig.localization!}
              className="font-semibold text-sm sm:text-lg"
              selectedDate={currentDate}
              onDateChange={handleDayChange}
              isAnimating={lastUpdated === "day"}
              direction={animationDirection}
            />
          </motion.div>
        )}
        {currentView !== "year" && (
          <motion.div
            key="month-switcher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MonthSwitcher
              className="font-semibold text-sm sm:text-lg"
              selectedMonth={months[currentDate.getMonth()]}
              onMonthChange={handleMonthChange}
              onDateChange={handleDayChange}
              isAnimating={lastUpdated === "month"}
              direction={animationDirection}
              translations={currentConfig.localization!}
              currentDate={currentDate}
            />
          </motion.div>
        )}
        <motion.div
          key="year-switcher"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <YearSwitcher
            className="font-semibold text-sm sm:text-lg"
            currentYear={currentDate.getFullYear()}
            onYearChange={handleYearChange}
            onDateChange={handleDayChange}
            currentDate={currentDate}
            isAnimating={lastUpdated === "year"}
            direction={animationDirection}
          />
        </motion.div>
      </AnimatePresence>
      <Button variant="ghost" onClick={handleNext} size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default DateNavigation
