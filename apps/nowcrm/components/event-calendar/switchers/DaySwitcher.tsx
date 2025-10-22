"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AnimatePresence, motion } from "framer-motion"
import type { EventCalendarTranslations } from "../types/EventCalendarTranslations"

const generateDaysForMonth = (selectedDate: Date) => {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return days.map((date) => ({
    dayNumber: format(date, "d"),
    weekday: format(date, "EEE"),
    value: format(date, "yyyy-MM-dd"),
    date: date,
  }))
}

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th"
  switch (day % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface DaySwitcherProps extends PopoverTriggerProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  isAnimating: boolean
  direction: "up" | "down"
  translations: EventCalendarTranslations
}

interface DayDisplayProps {
  day: string
  weekday: string
  translations: EventCalendarTranslations
}

const fallbackTranslations: EventCalendarTranslations = {
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  selectDate: "Select date",
  search: "Search",
  day: "Day",
  noEvents: "No events found",
  monthNames: [
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
  ],
  today: "Today",
  addEvent: "Add Event",
  more: "more",
  week: "Week",
  month: "Month",
  year: "Year",
  list: "List",
  searchEvents: "Search events",
  multiDayEvent: "Multi-day event",
  repeatingEvent: "Repeating event",
  extendsOutOfRange: "Extends out of range",
  repeatDailyDescription: "Daily from {startDate} to {endDate} at {timeRange}",
  repeatWeeklyDescription: "Weekly on {dayName} from {startDate} to {endDate} at {timeRange}",
  repeatMonthlyDescription: "Monthly on the {dayOfMonth} from {startDate} to {endDate} at {timeRange}",
  language: "",
  thisWeek: "",
  thisMonth: "",
  thisYear: "",
  fullDayNames: [],
  viewBy: "",
  editEvent: "",
  deleteEvent: "",
  eventTitle: "",
  eventDescription: "",
  eventColor: "",
  eventDate: "",
  eventStartTime: "",
  eventEndTime: "",
  eventEndDate: "",
  eventIsRepeating: "",
  eventAdded: "",
  eventUpdated: "",
  eventDeleted: "",
  eventRestored: "",
  eventUpdateUndone: "",
  failedToAddEvent: "",
  failedToUpdateEvent: "",
  failedToDeleteEvent: "",
  failedToFetchEvents: "",
  errorCannotExcludeAllDates: "",
  save: "",
  saving: "",
  cancel: "",
  delete: "",
  deleting: "",
  undo: "",
  tryAgain: "",
  close: "",
  allDay: "",
  fullDayEvents: "",
  loadingEvents: "",
  filterByColor: "",
  filter: "",
  filtering: "",
  use24HourFormat: "",
  displayCalendar: "",
  displayList: "",
  dayXofY: "",
  repeatXofY: "",
  starts: "",
  ends: "",
  untitledEvent: "",
  repeatDaily: "",
  repeatWeekly: "",
  repeatMonthly: "",
  repeatingEventQuestion: "",
  withExcludedDates: "",
  excludedDates: "",
  excludedDatesDescription: "",
  skipDays: "",
  clearAll: "",
  selectDatesToExclude: "",
  selectAll: "",
  noMatchingDates: "",
  noSearchResults: "",
  searchMonthPlaceholder: "",
  ofExcluded: "",
  pageCount: "",
  weeklyIntervalLabel: "",
  monthlyIntervalLabel: "",
  dateButtonFormat: "",
  editEventDescription: "",
  createEventDescription: "",
  timePresetAllDay: "",
  timePresetEarlyMorning: "",
  timePresetMorning: "",
  timePresetLunch: "",
  timePresetEarlyAfternoon: "",
  timePresetLateAfternoon: "",
  timePresetEvening: "",
  timePresetNight: "",
  selectColor: "",
  confirmDelete: "",
  confirmDeleteDescription: "",
  from: "",
  to: "",
  repeatEventDeleteTitle: "",
  repeatEventDeleteDescription: "",
  deleteThisOccurrence: "",
  deleteThisAndFuture: "",
  deleteAllOccurrences: "",
  deleteThisOccurrenceDescription: "",
  deleteThisAndFutureDescription: "",
  deleteAllOccurrencesDescription: "",
  editRecurringEventTitle: "",
  editRecurringEventDescription: "",
  editThisOccurrence: "",
  editThisOccurrenceDescription: "",
  editThisAndFuture: "",
  editThisAndFutureDescription: "",
  editAllOccurrences: "",
  editAllOccurrencesDescription: "",
  pickADate: "",
  errorEndDateBeforeStart: "",
  selectAColor: "",
  validations: {
    eventNameRequired: "",
    invalidTimeFormat: "",
    colorRequired: "",
    endTimeBeforeStart: ""
  }
}

const DayDisplay: React.FC<DayDisplayProps> = ({ day, weekday, translations }) => {
  // Get the day index (0-6) from the weekday string
  const getDayIndex = (weekday: string) => {
    const englishDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return englishDays.indexOf(weekday)
  }

  const dayIndex = getDayIndex(weekday)
  const translatedWeekday = translations.dayNames[dayIndex]

  return (
    <div className="flex items-center w-full">
      <span className="text-xs sm:text-sm text-muted-foreground italic whitespace-nowrap mr-1 sm:mr-2 pl-4">
        {translatedWeekday}
      </span>
      <span className="text-xs sm:text-sm font-medium truncate flex-grow text-center">
        {day}
        {getOrdinalSuffix(Number.parseInt(day))}
      </span>
    </div>
  )
}

export default function DaySwitcher({
  className,
  selectedDate,
  onDateChange,
  isAnimating,
  direction,
  translations,
}: DaySwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const days = React.useMemo(() => generateDaysForMonth(selectedDate), [selectedDate])
  const selectedDay = days.find((day) => format(day.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))

  const safeTranslations = translations || fallbackTranslations

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={safeTranslations.selectDate}
          className={cn(
            "w-[120px] sm:w-[159px] justify-between border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm p-2 sm:p-2",
            className,
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay?.value}
              initial={isAnimating ? { y: direction === "down" ? 10 : -10, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction === "down" ? -10 : 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {selectedDay ? (
                <DayDisplay day={selectedDay.dayNumber} weekday={selectedDay.weekday} translations={safeTranslations} />
              ) : (
                <span className="text-xs sm:text-sm">{safeTranslations.selectDate}</span>
              )}
            </motion.div>
          </AnimatePresence>
          <CaretSortIcon className="ml-1 sm:ml-2 h-4 w-4 sm:h-4 sm:w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] sm:w-[161px] p-0">
        <Command>
          <CommandInput
            placeholder={`${safeTranslations.search} ${safeTranslations.day.toLowerCase()}...`}
            className="text-xs sm:text-sm"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>{safeTranslations.noEvents}</CommandEmpty>
            <CommandGroup>
              {days.map((day) => (
                <CommandItem
                  key={day.value}
                  onSelect={() => {
                    onDateChange(day.date)
                    setOpen(false)
                  }}
                  className="text-xs sm:text-sm"
                >
                  <DayDisplay day={day.dayNumber} weekday={day.weekday} translations={safeTranslations} />
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4 sm:h-4 sm:w-4",
                      selectedDay?.value === day.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
